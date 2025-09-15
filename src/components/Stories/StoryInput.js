import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper
} from '@mui/material';
import { Close, Add } from '@mui/icons-material';
import { uploadStory } from '../../services/chat';

const StoryInput = ({ onClose }) => {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        await uploadStory('user-id', file, caption);
        onClose();
      } catch (error) {
        console.error('Error uploading story:', error);
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: 500,
          p: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Create Story</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        
        {preview ? (
          <Box sx={{ mb: 2, position: 'relative' }}>
            {file.type.startsWith('image/') ? (
              <img
                src={preview}
                alt="Preview"
                style={{ width: '100%', borderRadius: 8 }}
              />
            ) : (
              <video
                src={preview}
                controls
                style={{ width: '100%', borderRadius: 8 }}
              />
            )}
          </Box>
        ) : (
          <Box
            sx={{
              height: 300,
              border: '2px dashed #555',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              cursor: 'pointer',
            }}
            onClick={() => fileInputRef.current.click()}
          >
            <Add sx={{ fontSize: 48, color: '#555' }} />
            <Typography variant="body1" color="text.secondary">
              Add Photo or Video
            </Typography>
          </Box>
        )}
        
        <TextField
          fullWidth
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleUpload} disabled={!file}>
            Share
          </Button>
        </Box>
      </Paper>
      
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
    </Box>
  );
};

export default StoryInput;
