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

const VoiceCall = ({ socket }) => {
  const { chatId } = useParams();
  const { currentUser } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callStatus, setCallStatus] = useState('connecting');
  const [remoteUser, setRemoteUser] = useState({});
  const [callDuration, setCallDuration] = useState(0);
  
  const peerRef = useRef(null);
  const callContainerRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true,
          video: false
        });
        
        const peer = createPeer(true, stream);
        peerRef.current = setupCall(peer, null);
        
        // In a real app, you would send the offer to the remote user via signaling
        // For demo purposes, we'll simulate a connection
        setTimeout(() => {
          setCallStatus('connected');
          // Start call timer
          timerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1);
          }, 1000);
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
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (peerRef.current && peerRef.current.streams[0]) {
      peerRef.current.streams[0].getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    window.history.back();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      ref={callContainerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        bgcolor: '#121212',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Call Info */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar
          src={remoteUser.photoURL}
          sx={{ width: 120, height: 120, mx: 'auto', mb: 3 }}
        />
        <Typography variant="h4" gutterBottom>
          {remoteUser.name || 'User'}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {callStatus === 'connected' ? formatTime(callDuration) : 'Connecting...'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {callStatus === 'connected' ? 'Voice Call' : 'Ringing...'}
        </Typography>
      </Box>
      
      {/* Call Controls */}
      <CallControls
        isMuted={isMuted}
        isVideoOn={isVideoOn}
        onToggleMute={toggleMute}
        onToggleVideo={() => {}}
        onEndCall={endCall}
        onShareScreen={() => {}}
        onMoreOptions={() => {}}
      />
    </Box>
  );
};

export default VoiceCall;
