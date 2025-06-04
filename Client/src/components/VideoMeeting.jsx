import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import {
  Phone, PhoneOff, MonitorUp, MonitorX, Mic, MicOff, Video, VideoOff
} from 'lucide-react';
import { toast } from 'react-toastify';
import { BASE_URL } from '../config';
import { apiRequest } from '../utils/api';
const socket = io('https://www.codeverse.solutions', {
  transports: ['websocket'],
  withCredentials: true,
});


const VideoMeeting = () => {
  const { meetingRoom } = useParams();
  const navigate = useNavigate();

 
  const [localStream, setLocalStream] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [role, setRole] = useState('initiator');
  const [offer, setOffer] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

 
  const [currentUserId, setCurrentUserId] = useState(null);
  const peerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const controlsTimerRef = useRef(null);


  useEffect(() => {
  (async () => {
    try {
      const res = await apiRequest(`${BASE_URL}/api/auth/profile`, { method: 'GET' });
      const id = res.data?.data?.user?._id;
      console.log(id);
      if (!id) throw new Error('No user._id in payload');
      console.log('▶️ setCurrentUserId:', id);
      setCurrentUserId(id);
    } catch (err) {
      console.error('Profile fetch error:', err);
      navigate('/login');
    }
  })();
}, [navigate]);


  
  const useFakeMedia = new URLSearchParams(window.location.search).get('fake');
  useEffect(() => {
  let canvas, ctx, intervalId;
  let realStream = null;

  const startFake = () => {
    canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    ctx = canvas.getContext('2d');
    let hue = 0;
    intervalId = setInterval(() => {
      ctx.fillStyle = `hsl(${hue++ % 360}, 60%, 50%)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, 100);

    const fakeStream = canvas.captureStream(30);
    setLocalStream(fakeStream);
    setCameraStream(fakeStream);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = fakeStream;
      localVideoRef.current.onloadedmetadata = () => localVideoRef.current.play();
    }
  };

  const startReal = async () => {
    try {
      realStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(realStream);
      setCameraStream(realStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = realStream;
        localVideoRef.current.onloadedmetadata = () => localVideoRef.current.play();
      }
    } catch (err) {
      console.warn('Real camera failed, falling back to fake:', err);
      if (err.name === 'NotReadableError' || err.name === 'OverconstrainedError') {
        startFake();
      } else {
        console.error('Unexpected getUserMedia error:', err);
        toast.error('Could not access camera/mic');
      }
    }
  };

  if (useFakeMedia) {
    startFake();
  } else {
    startReal();
  }

  return () => {
    realStream?.getTracks().forEach(t => t.stop());
    if (intervalId) clearInterval(intervalId);
  };
}, [useFakeMedia]);


 
  useEffect(() => {
    if (!meetingRoom || !localStream || !currentUserId) return;
    socket.emit('join-room', { meetingRoom, userId: currentUserId });
  }, [meetingRoom, localStream, currentUserId]);

 
  useEffect(() => {
    const resetControlsTimer = () => {
      clearTimeout(controlsTimerRef.current);
      setControlsVisible(true);
      controlsTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 5000);
    };

    const onOffer = data => {
      console.log('Received offer:', data);
      setOffer(data.signal);
      setRole('answerer');
    };
    const onAnswer = data => {
      console.log('Received answer:', data);
      peerRef.current?.signal(data.signal);
    };
    const onIce = data => {
      console.log('Received ICE candidate:', data);
      peerRef.current?.signal(data.candidate);
    };
    const onUserLeft = () => {
      console.log('User left');
      setRemoteStream(null);
      if (remoteVideoRef.current)
        remoteVideoRef.current.srcObject = null;
    };
    const onUserConnected = ({ userId }) => {
      if (role === 'initiator' && !offer) {
        startCall();
      }
    };

    socket.on('offer', onOffer);
    socket.on('answer', onAnswer);
    socket.on('ice-candidate', onIce);
    socket.on('user-left', onUserLeft);
    socket.on('user-connected', onUserConnected);
    document.addEventListener('mousemove', resetControlsTimer);

    return () => {
      socket.off('offer', onOffer);
      socket.off('answer', onAnswer);
      socket.off('ice-candidate', onIce);
      socket.off('user-left', onUserLeft);
      socket.off('user-connected', onUserConnected);
      document.removeEventListener('mousemove', resetControlsTimer);
      clearTimeout(controlsTimerRef.current);
    };
  }, [role, offer]);


  const startCall = () => {
    if (!localStream || !currentUserId) return;
    setRole('initiator');
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: localStream,
    });
    peerRef.current = peer;

    peer.on('signal', data => {
      console.log('Sending offer:', data);
      socket.emit('offer', {
        meetingRoom,
        callerId: currentUserId,
        signal: data,
      });
    });

    peer.on('stream', stream => {
      console.log('Received remote stream:', stream);
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.onloadedmetadata = () =>
          remoteVideoRef.current.play();
      }
    });

    peer.on('error', err => console.error('Peer error:', err));
  };

  const answerCall = () => {
    if (!localStream || !offer || !currentUserId) return;
    setRole('answerer');
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: localStream,
    });
    peerRef.current = peer;

    peer.on('signal', data => {
      console.log('Sending answer:', data);
      socket.emit('answer', {
        meetingRoom,
        callerId: currentUserId,
        signal: data,
      });
    });

    peer.on('stream', stream => {
      console.log('Received remote stream:', stream);
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.onloadedmetadata = () =>
          remoteVideoRef.current.play();
      }
    });

    peer.on('error', err => console.error('Peer error:', err));
    peer.signal(offer);
    setHasAnswered(true);
  };


  const leaveCall = () => {
    peerRef.current?.destroy();
    peerRef.current = null;
    socket.emit('leave-room', {
      meetingRoom,
      userId: currentUserId,
    });
    navigate('/community');
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const newTrack = screenStream.getVideoTracks()[0];
      const oldTrack = cameraStream.getVideoTracks()[0];
      peerRef.current?.replaceTrack(oldTrack, newTrack, cameraStream);
      localVideoRef.current.srcObject = screenStream;
      newTrack.onended = stopScreenShare;
      setScreenSharing(true);
    } catch (err) {
      toast.error('Error sharing screen');
    }
  };
  const stopScreenShare = () => {
    const cameraTrack = cameraStream?.getVideoTracks()[0];
    const screenTrack = localVideoRef.current?.srcObject?.getVideoTracks()[0];
    peerRef.current?.replaceTrack(screenTrack, cameraTrack, cameraStream);
    localVideoRef.current.srcObject = cameraStream;
    setScreenSharing(false);
  };
  const toggleVideo = () => {
    localStream?.getVideoTracks().forEach(t => t.enabled = !isVideoOn);
    setIsVideoOn(!isVideoOn);
  };
  const toggleAudio = () => {
    localStream?.getAudioTracks().forEach(t => t.enabled = !isAudioOn);
    setIsAudioOn(!isAudioOn);
  };

 
  return (
    <div
      className="video-container relative w-full h-screen bg-gradient-to-b from-gray-800 to-gray-900"
      onMouseMove={() => {
        clearTimeout(controlsTimerRef.current);
        setControlsVisible(true);
        controlsTimerRef.current = setTimeout(() => setControlsVisible(false), 5000);
      }}
    >
      <video
        ref={remoteVideoRef}
        className="video-element w-full h-full object-cover"
        autoPlay
        playsInline
      />
      {!remoteStream && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-gray-300 text-xl">Waiting for remote stream...</p>
        </div>
      )}

      {role === 'answerer' && !hasAnswered && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-gray-900 bg-opacity-50 px-6 py-4 rounded">
            <p className="text-white text-xl font-bold">Incoming Call…</p>
          </div>
        </div>
      )}

      <div className={`absolute ${controlsVisible ? 'right-6 bottom-24' : 'right-4 bottom-4'} w-1/4 max-w-xs max-h-48`}>
        <video
          ref={localVideoRef}
          className="video-element rounded-lg"
          autoPlay
          muted
          playsInline
        />
      </div>

      <div className={`control-bar absolute bottom-0 left-0 right-0 p-4 bg-gray-900 bg-opacity-70 flex justify-center space-x-4 rounded-t-xl transition-all duration-300 ${controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
       
        {role === 'initiator' && !offer && (
          <button
            onClick={startCall}
            disabled={!localStream || !currentUserId}
            className="bg-green-500 text-white px-4 py-2 rounded"
            title={!currentUserId ? 'Authenticating…' : 'Start Call'}
          >
            <Phone size={24} />
          </button>
        )}
        {role === 'answerer' && !hasAnswered && (
          <button
            onClick={answerCall}
            disabled={!localStream || !offer || !currentUserId}
            className="bg-green-500 text-white px-4 py-2 rounded"
            title={!currentUserId ? 'Authenticating…' : 'Answer Call'}
          >
            <Phone size={24} />
          </button>
        )}

        
        <button onClick={toggleAudio} className="bg-gray-500 text-white px-4 py-2 rounded" title={isAudioOn ? 'Mute' : 'Unmute'}>
          {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
        </button>
        <button onClick={toggleVideo} className="bg-gray-500 text-white px-4 py-2 rounded" title={isVideoOn ? 'Camera Off' : 'Camera On'}>
          {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
        </button>

       
        {peerRef.current && (
          screenSharing ? (
            <button onClick={stopScreenShare} className="bg-blue-500 text-white px-4 py-2 rounded" title="Stop Share">
              <MonitorX size={24} />
            </button>
          ) : (
            <button onClick={startScreenShare} className="bg-blue-500 text-white px-4 py-2 rounded" title="Share Screen">
              <MonitorUp size={24} />
            </button>
          )
        )}

        
        <button onClick={leaveCall} className="bg-red-500 text-white px-4 py-2 rounded" title="Leave Call">
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
};

export default VideoMeeting;
