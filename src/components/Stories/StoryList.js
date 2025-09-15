import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getStories } from '../../services/chat';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Paper,
  Grid
} from '@mui/material';
import { Add, Story } from '../../components/UI/Icons';

const StoryList = () => {
  const { currentUser } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getStories((data) => {
      setStories(data);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const groupedStories = stories.reduce((acc, story) => {
    if (!acc[story.userId]) {
      acc[story.userId] = [];
    }
    acc[story.userId].push(story);
    return acc;
  }, {});

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Stories</Typography>
      
      <Grid container spacing={2}>
        {/* Add Story */}
        <Grid item>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <IconButton
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                border: '2px dashed #555',
                bgcolor: 'background.paper',
                mb: 1
              }}
            >
              <Add />
            </IconButton>
            <Typography variant="body2">Your Story</Typography>
          </Box>
        </Grid>
        
        {/* Other Stories */}
        {Object.entries(groupedStories).map(([userId, userStories]) => (
          <Grid item key={userId}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  p: 0.5,
                  background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                  mb: 1
                }}
              >
                <Avatar
                  sx={{ width: '100%', height: '100%', border: '2px solid #121212' }}
                  src="/static/images/avatar/1.jpg"
                />
              </Box>
              <Typography variant="body2">User {userId.substring(0, 4)}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StoryList;
