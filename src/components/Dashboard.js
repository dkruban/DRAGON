import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './UI/Header';
import Sidebar from './UI/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { io } from 'socket.io-client';
import {
  Box,
  CssBaseline,
  Drawer,
  useMediaQuery,
  useTheme
} from '@mui/material';

const drawerWidth = 280;

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState(null);
  
  // Initialize socket connection
  useEffect(() => {
    if (currentUser) {
      const newSocket = io('http://localhost:5000', {
        query: { userId: currentUser.uid }
      });
      setSocket(newSocket);
      
      return () => newSocket.close();
    }
  }, [currentUser]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <Header onDrawerToggle={handleDrawerToggle} />
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid #2c2c2c',
            },
          }}
        >
          <Sidebar socket={socket} />
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        <Outlet context={{ socket }} />
      </Box>
    </Box>
  );
};

export default Dashboard;
