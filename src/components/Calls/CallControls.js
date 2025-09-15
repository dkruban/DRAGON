import React from 'react';
import {
  Box,
  IconButton,
  Paper,
  Typography
} from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  CallEnd,
  ScreenShare,
  MoreVert
} from '@mui/icons-material';

const CallControls = ({
  isMuted,
  isVideoOn,
  onToggleMute,
  onToggleVideo,
  onEndCall,
  onShareScreen,
  onMoreOptions
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        p: 1,
        borderRadius: 8,
        bgcolor: 'rgba(0, 0, 0, 0.7)',
      }}
    >
      <IconButton
        color={isMuted ? 'error' : 'default'}
        onClick={onToggleMute}
        sx={{ mx: 1 }}
      >
        {isMuted ? <MicOff /> : <Mic />}
      </IconButton>
      
      <IconButton
        color={isVideoOn ? 'default' : 'error'}
        onClick={onToggleVideo}
        sx={{ mx: 1 }}
      >
        {isVideoOn ? <Videocam /> : <VideocamOff />}
      </IconButton>
      
      <IconButton
        color="primary"
        onClick={onShareScreen}
        sx={{ mx: 1 }}
      >
        <ScreenShare />
      </IconButton>
      
      <IconButton
        color="error"
        onClick={onEndCall}
        sx={{ mx: 1 }}
      >
        <CallEnd />
      </IconButton>
      
      <IconButton
        color="default"
        onClick={onMoreOptions}
        sx={{ mx: 1 }}
      >
        <MoreVert />
      </IconButton>
    </Paper>
  );
};

export default CallControls;
