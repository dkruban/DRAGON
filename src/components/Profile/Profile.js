import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Edit,
  Phone,
  Email,
  CalendarToday,
  LocationOn,
  Info
} from '@mui/icons-material';

const Profile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={currentUser?.photoURL}
            alt={currentUser?.displayName}
            sx={{ width: 120, height: 120, mr: 3 }}
          />
          <Box>
            <Typography variant="h4" gutterBottom>
              {currentUser?.displayName || 'User Name'}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {currentUser?.email}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <List>
          <ListItem>
            <ListItemIcon>
              <Phone />
            </ListItemIcon>
            <ListItemText
              primary="Phone"
              secondary="+1 (555) 123-4567"
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <Email />
            </ListItemIcon>
            <ListItemText
              primary="Email"
              secondary={currentUser?.email}
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <CalendarToday />
            </ListItemIcon>
            <ListItemText
              primary="Joined"
              secondary="January 2023"
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <LocationOn />
            </ListItemIcon>
            <ListItemText
              primary="Location"
              secondary="San Francisco, CA"
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText
              primary="About"
              secondary="Premium user of DRAGON communication app. Love connecting with people!"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default Profile;
