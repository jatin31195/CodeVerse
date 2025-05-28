import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { Phone, PhoneOff, MonitorUp, MonitorX, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import {toast} from 'react-toastify'
const socket = io('http://localhost:8080', {
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

  const peerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const controlsTimerRef = useRef(null);

  const resetControlsTimer = () => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    setControlsVisible(true);
    controlsTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 5000);
  };

  useEffect(() => {
    // Get the camera stream and join the meeting room
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        setCameraStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.onloadedmetadata = () => localVideoRef.current.play();
        }
        socket.emit('join-room', { meetingRoom, userId: sessionStorage.getItem('userId') });
      })
      .catch(err => console.error("Error accessing media devices:", err));

    socket.on('offer', data => {
      console.log('Received offer:', data);
      setOffer(data.signal);
      setRole('answerer');
    });

    socket.on('answer', data => {
      console.log('Received answer:', data);
      if (peerRef.current) {
        peerRef.current.signal(data.signal);
      }
    });

    socket.on('ice-candidate', data => {
      console.log('Received ICE candidate:', data);
      if (peerRef.current) {
        peerRef.current.signal(data.candidate);
      }
    });

    socket.on('user-left', data => {
      console.log('User left:', data);
      setRemoteStream(null);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    });

    document.addEventListener('mousemove', resetControlsTimer);
    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-left');
      document.removeEventListener('mousemove', resetControlsTimer);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [meetingRoom]);

  const startCall = () => {
    if (!localStream) {
      alert("Local stream not ready.");
      return;
    }
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
        callerId: sessionStorage.getItem('userId'),
        signal: data,
      });
    });

    peer.on('stream', stream => {
      console.log('Received remote stream:', stream);
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.onloadedmetadata = () => remoteVideoRef.current.play();
      }
    });

    peer.on('error', err => console.error('Peer error:', err));
  };

  const answerCall = () => {
    if (!localStream || !offer) {
      alert("Local stream or offer not ready.");
      return;
    }
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
        signal: data,
        callerId: sessionStorage.getItem('userId'),
      });
    });

    peer.on('stream', stream => {
      console.log('Received remote stream:', stream);
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.onloadedmetadata = () => remoteVideoRef.current.play();
      }
    });

    peer.on('error', err => console.error('Peer error:', err));

    peer.signal(offer);
    setHasAnswered(true);
  };

  const leaveCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    socket.emit('leave-room', { meetingRoom, userId: sessionStorage.getItem('userId') });
    navigate('/raise-ticket');
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const newVideoTrack = screenStream.getVideoTracks()[0];
      const oldVideoTrack = cameraStream.getVideoTracks()[0];
      if (peerRef.current && oldVideoTrack && newVideoTrack) {
        peerRef.current.replaceTrack(oldVideoTrack, newVideoTrack, cameraStream);
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }
      newVideoTrack.onended = () => {
        stopScreenShare();
      };
      setScreenSharing(true);
    } catch (error) {
      toast.error("Error sharing screen:", error);
    }
  };

  const stopScreenShare = () => {
    if (!cameraStream) return;
    const cameraVideoTrack = cameraStream.getVideoTracks()[0];
    const currentStream = localVideoRef.current.srcObject;
    const screenTrack = currentStream.getVideoTracks()[0];
    if (peerRef.current && screenTrack && cameraVideoTrack) {
      peerRef.current.replaceTrack(screenTrack, cameraVideoTrack, cameraStream);
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = cameraStream;
    }
    setScreenSharing(false);
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioOn;
      });
      setIsAudioOn(!isAudioOn);
    }
  };

  return (
    <div
      className="video-container relative w-full h-screen bg-gradient-to-b from-gray-800 to-gray-900"
      onMouseMove={resetControlsTimer}
    >
      {/* Always render the remote video element */}
      <video
        ref={remoteVideoRef}
        className="video-element w-full h-full object-cover"
        autoPlay
        playsInline
        muted={false}
      />
      {/* Overlay waiting message if no remote stream is available */}
      {!remoteStream && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg className="text-gray-400 mb-4" width="80" height="80" fill="none" stroke="currentColor">
            <circle cx="40" cy="40" r="38" strokeWidth="4" />
          </svg>
          <p className="text-gray-300 text-xl">Waiting for remote stream...</p>
        </div>
      )}

      {/* Incoming Call Indicator for the receiver */}
      {role === 'answerer' && !hasAnswered && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-gray-900 bg-opacity-50 px-6 py-4 rounded">
            <p className="text-white text-xl font-bold">Incoming Call...</p>
          </div>
        </div>
      )}

      <div
        className={`local-video absolute ${controlsVisible ? 'right-6 bottom-24' : 'right-4 bottom-4'} w-1/4 max-w-xs max-h-48`}
      >
        <video
          ref={localVideoRef}
          className="video-element rounded-lg"
          autoPlay
          playsInline
          muted
        />
      </div>

      <div
        className={`control-bar absolute bottom-0 left-0 right-0 p-4 bg-gray-900 bg-opacity-70 flex justify-center space-x-4 rounded-t-xl transition-all duration-300 ${
          controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
        }`}
      >
        {role === 'initiator' && !offer && (
          <button
            onClick={startCall}
            disabled={!localStream}
            className="control-button bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            title="Start Call"
          >
            <Phone size={24} />
          </button>
        )}
        {role === 'answerer' && !hasAnswered && (
          <button
            onClick={answerCall}
            disabled={!localStream || !offer}
            className="control-button bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            title="Answer Call"
          >
            <Phone size={24} />
          </button>
        )}
        {/* New Audio Toggle Button */}
        <button
          onClick={toggleAudio}
          className="control-button bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          title={isAudioOn ? "Mute Audio" : "Unmute Audio"}
        >
          {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
        </button>
        {/* New Video Toggle Button */}
        <button
          onClick={toggleVideo}
          className="control-button bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          title={isVideoOn ? "Turn off Video" : "Turn on Video"}
        >
          {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
        </button>
        {peerRef.current && (
          <>
            {screenSharing ? (
              <button
                onClick={stopScreenShare}
                className="control-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                title="Stop Screen Share"
              >
                <MonitorX size={24} />
              </button>
            ) : (
              <button
                onClick={startScreenShare}
                className="control-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                title="Share Screen"
              >
                <MonitorUp size={24} />
              </button>
            )}
          </>
        )}
        <button
          onClick={leaveCall}
          className="control-button bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          title="Leave Call"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
};

export default VideoMeeting;
