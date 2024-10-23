import React, { useState } from 'react';
import {
  Drawer,
  IconButton,
  Box,
  AppBar,
  Toolbar,
  CssBaseline,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ChatWindow from './ChatWindow';
import Sidebar from './Sidebar';
import IconSidebar from './IconSidebar';
import Resizable from 're-resizable'; // You can use this library for resizing panels.

export default function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [iconSidebarVisible, setIconSidebarVisible] = useState(true);

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#212121' }}>
      <CssBaseline />

      {/* AppBar with mobile menu buttons */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1400,
          backgroundColor: 'transparent',
          boxShadow: 'none',
          left: 0,
          right: 0,
        }}
      >
        <Toolbar sx={{ display: { md: 'none' }, justifyContent: 'flex-start' }}>
          <IconButton
            color="inherit"
            onClick={() => setIconSidebarVisible(!iconSidebarVisible)}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Icon Sidebar for small screens */}
      <Drawer
        variant="temporary"
        open={iconSidebarVisible}
        onClose={() => setIconSidebarVisible(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 60, backgroundColor: '#212121' },
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <IconSidebar />
      </Drawer>

      {/* Main Sidebar for larger screens */}
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? 240 : 0,
            transition: 'width 0.3s',
            backgroundColor: '#212121',
          },
        }}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </Drawer>

      {/* Resizable panel for the sidebar */}
      <Resizable
        defaultSize={{ width: sidebarOpen ? '240px' : '0px', height: '100%' }}
        minWidth="15%"
        maxWidth="40%"
        enable={{
          right: true,
        }}
        style={{ transition: 'width 0.3s' }}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </Resizable>

      {/* Main Content - ChatWindow */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <ChatWindow />
      </Box>

      {/* Overlay for mobile when menus are open */}
      {(sidebarOpen || iconSidebarVisible) && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1300,
            display: { md: 'none' },
          }}
          onClick={() => {
            setSidebarOpen(false);
            setIconSidebarVisible(false);
          }}
        />
      )}
    </Box>
  );
}
