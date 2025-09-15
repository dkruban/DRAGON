import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserChats } from '../../services/chat';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Badge,
  Box,
  Avatar
} from '@mui/material';
import {
  Chat,
  People,
  Call,
  VideoCall,
  Star,
  Archive,
  Settings,
  Logout,
  Add,
  Story
} from '@mui/icons-material';

const Sidebar = ({ socket }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeTab, setActiveTab] = useState('chats');

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = getUserChats(currentUser.uid, (data) => {
        setChats(data);
      });
      
      return () => unsubscribe();
    }
  }, [currentUser]);

  const menuItems = [
    { id: 'chats', icon: <Chat />, label: 'Chats', path: '/dashboard' },
    { id: 'people', icon: <People />, label: 'People', path: '/dashboard/people' },
    { id: 'calls', icon: <Call />, label: 'Calls', path: '/dashboard/calls' },
    { id: 'stories', icon: <Story />, label: 'Stories', path: '/dashboard/stories' },
    { id: 'starred', icon: <Star />, label: 'Starred', path: '/dashboard/starred' },
    { id: 'archived', icon: <Archive />, label: 'Archived', path: '/dashboard/archived' },
    { id: 'settings', icon: <Settings />, label: 'Settings', path: '/dashboard/settings' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar src={currentUser?.photoURL} alt={currentUser?.displayName} sx={{ mr: 2 }}>
          {currentUser?.email?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6">{currentUser?.displayName || 'User'}</Typography>
          <Typography variant="body2" color="text.secondary">{currentUser?.email}</Typography>
        </Box>
      </Box>
      
      <Divider />
      
      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={activeTab === item.id}
              onClick={() => {
                setActiveTab(item.id);
                navigate(item.path);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/dashboard/new-chat')}>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary="New Chat" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
