// ChatLayout.jsx
import React, { useState } from 'react';
import { Box, Drawer, useMediaQuery, useTheme, CssBaseline } from '@mui/material';
import { Outlet, useParams } from 'react-router-dom';
import { ChatSidebar } from 'components/chat/sidebar';

// Define the width of the sidebar
const drawerWidth = 300;

// =========================================================
// [ChatLayout] | Centralizes the layout and responsiveness
// =========================================================
export const ChatLayout = () => {
  const { workspaceId, sessionId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State to manage the sidebar's open status
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={isSidebarOpen}
        onClose={toggleSidebar}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <ChatSidebar workspaceId={workspaceId} />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: isSidebarOpen && !isMobile ? `${drawerWidth}px` : 0,
        }}
      >
        <Outlet context={{ workspaceId, sessionId, toggleSidebar, isSidebarOpen }} />
      </Box>
    </Box>
  );
};

export default ChatLayout;

// import { Box, Portal, useMediaQuery } from '@mui/material';
// import { Outlet, useParams } from 'react-router-dom';

// import { ChatSidebar } from 'components/chat/sidebar';

// // =========================================================
// // [ChatLayout] | This code provides the chat layout for the app
// // =========================================================
// export const ChatLayout = props => {
//   const { workspaceId, sessionId } = useParams();

//   return (
//     <Box
//       id="chat-layout-container"
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         minHeight: '100vh',
//         height: '100vh',
//         width: '100%',
//         minWidth: '100vw',
//         // overflow: 'hidden',
//       }}
//     >
//       <>
//         <Portal>
//           <ChatSidebar workspaceId={workspaceId} />
//         </Portal>
//       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//         <Outlet context={{ workspaceId, sessionId }} />
//       </Box>
//       </>
//     </Box>
//   );
// };

// export default ChatLayout;
