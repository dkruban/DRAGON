import React, { useState, useRef } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Paper,
  Tooltip,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import {
  AttachFile,
  Mic,
  SentimentSatisfiedAlt,
  Send,
  InsertDriveFile,
  Image,
  Audiotrack,
  Videocam
} from '@mui/icons-material';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const open = Boolean(anchorEl);

  const handleAttachClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAttachClose = () => {
    setAnchorEl(null);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (type) => {
    // In a real app, this would open a file dialog and upload the file
    handleAttachClose();
    
    // Simulate file upload
    if (type === 'image') {
      onSendMessage('https://via.placeholder.com/300', 'image');
    } else if (type === 'file') {
      onSendMessage('example-document.pdf', 'file');
    } else if (type === 'video') {
      onSendMessage('example-video.mp4', 'video');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // In a real app, you would upload this blob and send the URL
        onSendMessage('voice-message.wav', 'voice');
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={handleAttachClick}>
        <AttachFile />
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleAttachClose}
      >
        <MenuItem onClick={() => handleFileUpload('document')}>
          <InsertDriveFile sx={{ mr: 1 }} /> Document
        </MenuItem>
        <MenuItem onClick={() => handleFileUpload('image')}>
          <Image sx={{ mr: 1 }} /> Image
        </MenuItem>
        <MenuItem onClick={() => handleFileUpload('video')}>
          <Videocam sx={{ mr: 1 }} /> Video
        </MenuItem>
        <MenuItem onClick={() => handleFileUpload('audio')}>
          <Audiotrack sx={{ mr: 1 }} /> Audio
        </MenuItem>
      </Menu>
      
      <IconButton>
        <SentimentSatisfiedAlt />
      </IconButton>
      
      <Paper
        component="form"
        sx={{ 
          p: '2px 4px', 
          display: 'flex', 
          alignItems: 'center', 
          flexGrow: 1,
          mx: 1,
          borderRadius: 4,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Type a message..."
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </Paper>
      
      {message.trim() === '' ? (
        <Tooltip title={isRecording ? 'Stop recording' : 'Record voice message'}>
          <IconButton 
            color={isRecording ? 'error' : 'default'} 
            onClick={handleMicClick}
          >
            <Mic />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton color="primary" onClick={handleSendMessage}>
          <Send />
        </IconButton>
      )}
    </Box>
  );
};

export default MessageInput;
