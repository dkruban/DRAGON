import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createPeer, setupCall } from '../../services/webrtc';
import CallControls from './CallControls';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  IconButton
} from '@mui/material';
import { Fullscreen, FullscreenExit } from '@mui/icons-material';

const VideoCall = ({ socket }) => {
  const { chatId } = useParams();
  const { currentUser } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callStatus, setCallStatus] = useState('connecting');
  const [remoteUser, setRemoteUser] = useState({});
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const callContainerRef = useRef(null);

  useEffect(() => {
    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        const peer = createPeer(true, stream);
        peerRef.current = setupCall(peer, remoteVideoRef);
        
        // In a real app, you would send the offer to the remote user via signaling
        // For demo purposes, we'll simulate a connection
        setTimeout(() => {
          setCallStatus('connected');
        }, 2000);
        
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setCallStatus('failed');
      }
    };
    
    startCall();
    
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn;
      });
    }
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    window.history.back();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      callContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <Box
      ref={callContainerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        bgcolor: 'black',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Remote Video */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {callStatus === 'connecting' && (
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, mb: 2 }} />
            <Typography variant="h6">Connecting to {remoteUser.name || 'User'}...</Typography>
          </Box>
        )}
        
        {callStatus === 'connected' && (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </Box>
      
      {/* Local Video */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 100,
          right: 20,
          width: 200,
          height: 150,
          borderRadius: 1,
          overflow: 'hidden',
          border: '2px solid #333',
        }}
      >
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
      
      {/* Call Info */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Avatar src={remoteUser.photoURL} sx={{ mr: 2 }} />
        <Box>
          <Typography variant="h6">{remoteUser.name || 'User'}</Typography>
          <Typography variant="body2" color="text.secondary">
            {callStatus === 'connected' ? '00:15:23' : 'Connecting...'}
          </Typography>
        </Box>
      </Box>
      
      {/* Fullscreen Button */}
      <IconButton
        sx={{ position: 'absolute', top: 20, right: 20, color: 'white' }}
        onClick={toggleFullscreen}
      >
        {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
      </IconButton>
      
      {/* Call Controls */}
      <CallControls
        isMuted={isMuted}
        isVideoOn={isVideoOn}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onEndCall={endCall}
        onShareScreen={() => {}}
        onMoreOptions={() => {}}
      />
    </Box>
  );
};

export default VideoCall;
