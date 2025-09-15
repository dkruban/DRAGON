import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getMessages, sendMessage, deleteMessage } from '../../services/chat';
import Message from './Message';
import MessageInput from './MessageInput';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Paper
} from '@mui/material';
import {
  MoreVert,
  Search,
  AttachFile,
  Mic,
  Videocam,
  Call
} from '@mui/icons-material';

const ChatWindow = ({ socket }) => {
  const { chatId } = useParams();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [otherUser, setOtherUser] = useState({});

  useEffect(() => {
    if (chatId) {
      setLoading(true);
      const unsubscribe = getMessages(chatId, (data) => {
        setMessages(data);
        setLoading(false);
        scrollToBottom();
      });
      
      return () => unsubscribe();
    }
  }, [chatId]);

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', (newMessage) => {
        if (newMessage.chatId === chatId) {
          setMessages(prev => [...prev, newMessage]);
          scrollToBottom();
        }
      });
      
      return () => {
        socket.off('receive-message');
      };
    }
  }, [socket, chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (message, type = 'text') => {
    if (message.trim() === '') return;
    
    const newMessage = {
      text: message,
      senderId: currentUser.uid,
      type,
      timestamp: new Date(),
      chatId
    };
    
    sendMessage(chatId, message, currentUser.uid, type);
    
    if (socket) {
      socket.emit('send-message', newMessage);
    }
  };

  const handleDeleteMessage = (messageId) => {
    deleteMessage(chatId, messageId);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Paper elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar src={otherUser.photoURL} alt={otherUser.name} sx={{ mr: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">{otherUser.name || 'User'}</Typography>
          <Typography variant="body2" color="text.secondary">Online</Typography>
        </Box>
        <IconButton color="inherit">
          <Videocam />
        </IconButton>
        <IconButton color="inherit">
          <Call />
        </IconButton>
        <IconButton color="inherit">
          <Search />
        </IconButton>
        <IconButton color="inherit">
          <MoreVert />
        </IconButton>
      </Paper>
      
      <Divider />
      
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {loading ? (
          <Typography variant="body2" color="text.secondary" align="center">
            Loading messages...
          </Typography>
        ) : messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No messages yet. Start a conversation!
          </Typography>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUser.uid}
              onDelete={handleDeleteMessage}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>
      
      <Divider />
      
      <MessageInput onSendMessage={handleSendMessage} />
    </Box>
  );
};

export default ChatWindow;
