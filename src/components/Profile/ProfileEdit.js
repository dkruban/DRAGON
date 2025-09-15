import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { uploadProfilePicture } from '../../services/storage';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  TextField,
  IconButton,
  Divider
} from '@mui/material';
import { Close, CameraAlt } from '@mui/icons-material';

const ProfileEdit = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [location, setLocation] = useState('San Francisco, CA');
  const [about, setAbout] = useState('Premium user of DRAGON communication app. Love connecting with people!');
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(currentUser?.photoURL || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      if (profilePicture) {
        const photoURL = await uploadProfilePicture(profilePicture, currentUser.uid);
        // Update user profile with photoURL
      }
      
      // Update user profile with other details
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
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
          maxWidth: 600,
          p: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Edit Profile</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Avatar
              src={preview}
              alt="Profile"
              sx={{ width: 120, height: 120 }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
              component="label"
            >
              <CameraAlt />
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Click on the camera icon to change profile picture
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <TextField
          fullWidth
          label="Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="About"
          multiline
          rows={3}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          sx={{ mb: 3 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfileEdit;
