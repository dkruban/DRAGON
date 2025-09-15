import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserChats } from '../../services/chat';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Badge,
  InputBase,
  IconButton,
  Paper
} from '@mui/material';
import { Search as SearchIcon, MoreVert } from '@mui/icons-material';

const ChatList = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = getUserChats(currentUser.uid, (data) => {
        setChats(data);
      });
      
      return () => unsubscribe();
    }
  }, [currentUser]);

  const filteredChats = chats.filter(chat => {
    // This is a simplified filter. In a real app, you would have user names in the chat object
    return chat.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleChatClick = (chatId) => {
    navigate(`/dashboard/chat/${chatId}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: 2 }}
        >
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Paper>
      </Box>
      
      <List sx={{ overflow: 'auto', flexGrow: 1 }}>
        {filteredChats.map((chat) => (
          <ListItem 
            key={chat.id} 
            button 
            alignItems="flex-start"
            onClick={() => handleChatClick(chat.id)}
            sx={{ borderBottom: '1px solid #2c2c2c' }}
          >
            <ListItemAvatar>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                color="success"
              >
                <Avatar alt="Chat" src="/static/images/avatar/1.jpg" />
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold' }}
                >
                  Chat {chat.id.substring(0, 6)}
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Last message...
                  </Typography>
                  {" — "}
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {new Date(chat.createdAt?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChatList;
