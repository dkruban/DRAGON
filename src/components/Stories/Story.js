import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Avatar,
  LinearProgress
} from '@mui/material';
import { Close, ArrowBack, ArrowForward } from '@mui/icons-material';

const Story = ({ story, onClose, onNext, onPrev }) => {
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!paused) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer);
            onNext();
            return 0;
          }
          return Math.min(oldProgress + 1, 100);
        });
      }, 50);
      
      return () => clearInterval(timer);
    }
  }, [paused, onNext]);

  const handlePause = () => {
    setPaused(!paused);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'black',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={handlePause}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar src="/static/images/avatar/1.jpg" sx={{ mr: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1">User Name</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(story.timestamp?.toDate()).toLocaleTimeString()}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: 2, bgcolor: '#333' }}
      />
      
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {story.type === 'image' ? (
          <img
            src={story.mediaUrl}
            alt="Story"
            style={{ maxWidth: '100%', maxHeight: '80%', objectFit: 'contain' }}
          />
        ) : (
          <video
            src={story.mediaUrl}
            controls
            style={{ maxWidth: '100%', maxHeight: '80%' }}
          />
        )}
        
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 20,
            transform: 'translateY(-50%)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
        >
          <IconButton sx={{ color: 'white' }}>
            <ArrowBack />
          </IconButton>
        </Box>
        
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: 20,
            transform: 'translateY(-50%)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          <IconButton sx={{ color: 'white' }}>
            <ArrowForward />
          </IconButton>
        </Box>
      </Box>
      
      {story.caption && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body1">{story.caption}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Story;
