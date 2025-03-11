import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const socket = io('http://localhost:8080',{
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

  const peerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    // Get the camera stream and join the meeting room
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        setCameraStream(stream); 
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
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

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-left');
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
      console.error("Error sharing screen:", error);
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

  return (
    <div>
      <h1>Video Meeting Room: {meetingRoom}</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <h3>Your Video ({role}) {screenSharing && "(Screen Sharing)"}</h3>
          <video ref={localVideoRef} playsInline muted autoPlay style={{ width: "300px", border: "1px solid black" }} />
        </div>
        <div>
          <h3>Remote Video</h3>
          <video ref={remoteVideoRef} playsInline autoPlay style={{ width: "300px", border: "1px solid black" }} />
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        {role === 'initiator' && !offer && (
          <button onClick={startCall} disabled={!localStream}>Start Call (Initiator)</button>
        )}
        {role === 'answerer' && !hasAnswered && (
          <button onClick={answerCall} disabled={!localStream || !offer}>Answer Call</button>
        )}
        {peerRef.current && (
          <>
            {screenSharing ? (
              <button onClick={stopScreenShare}>Stop Screen Share</button>
            ) : (
              <button onClick={startScreenShare}>Share Screen</button>
            )}
          </>
        )}
        <button onClick={leaveCall}>Leave Call</button>
      </div>
    </div>
  );
};

export default VideoMeeting;
