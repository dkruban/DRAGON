import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import {
  MoreVert,
  Delete,
  Reply,
  Forward
} from '@mui/icons-material';

const Message = ({ message, isOwn, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete(message.id);
    handleClose();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <Box sx={{ maxWidth: '300px' }}>
            <img 
              src={message.text} 
              alt="Shared content" 
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Box>
        );
      case 'file':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {message.text.split('.').pop().toUpperCase().charAt(0)}
              </Avatar>
            </Box>
            <Box>
              <Typography variant="body1">{message.text.split('/').pop()}</Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.floor(Math.random() * 10) + 1} MB
              </Typography>
            </Box>
          </Box>
        );
      case 'voice':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}>
            <IconButton color="primary">
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <span style={{ fontSize: '14px' }}>▶</span>
              </Avatar>
            </IconButton>
            <Box sx={{ flexGrow: 1, mx: 1 }}>
              <Box sx={{ height: '4px', bgcolor: '#555', borderRadius: '2px' }}>
                <Box sx={{ width: '30%', height: '100%', bgcolor: 'primary.main', borderRadius: '2px' }}></Box>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              0:15
            </Typography>
          </Box>
        );
      default:
        return <Typography variant="body1">{message.text}</Typography>;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        mb: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isOwn ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          maxWidth: '70%',
        }}
      >
        {!isOwn && (
          <Avatar sx={{ mr: 1, width: 32, height: 32 }} />
        )}
        
        <Box>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: '18px',
              bgcolor: isOwn ? 'primary.main' : 'background.paper',
              color: isOwn ? 'background.paper' : 'text.primary',
              borderBottomRightRadius: isOwn ? '4px' : '18px',
              borderBottomLeftRadius: isOwn ? '18px' : '4px',
              position: 'relative',
            }}
          >
            {renderMessageContent()}
            
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: isOwn ? 'right' : 'left',
                mt: 0.5,
                fontSize: '0.7rem',
                opacity: 0.7,
              }}
            >
              {formatTime(message.timestamp)}
            </Typography>
          </Paper>
          
          {isOwn && (
            <IconButton
              size="small"
              onClick={handleClick}
              sx={{ ml: 1, color: 'text.secondary' }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
      
      <Menu
        id="message-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>
          <Reply sx={{ mr: 1 }} /> Reply
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Forward sx={{ mr: 1 }} /> Forward
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Message;
