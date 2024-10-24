// =========================================================
// [ChatLayout] | Centralizes the layout and responsiveness
// =========================================================
import {
  Box,
  Drawer,
  useMediaQuery,
  useTheme,
  CssBaseline,
  Fade,
} from '@mui/material';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { SidebarContent, SidebarTabs } from 'components';
import { SIDEBAR_CONFIG } from 'config/data-configs/sidebar'; // Move sidebar configuration to separate file
import { useAppStore, useChatStore, useUserStore } from 'contexts/index'; // Consolidated imports
import { useMode } from 'hooks/app';

export const ChatLayout = () => {
  const useResponsiveDrawer = () => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.down('md'));

    const drawerWidth = useMemo(() => {
      if (isMobile) return '100vw';
      if (isMd) return '350px';
      return '450px';
    }, [isMobile, isMd]);

    return {
      isXs,
      isMobile,
      isMd,
      drawerWidth,
    };
  };
  const { workspaceId, sessionId } = useParams();
  const navigate = useNavigate();
  const { theme } = useMode();
  const { isXs, isMobile, isMd, drawerWidth } = useResponsiveDrawer();
  const [activeTab, setActiveTab] = useState(null);
  const {
    state: { user, isAuthenticated, profile },
  } = useUserStore();
  const {
    state: {
      apiKey,
      chatSessions,
      workspaces,
      prompts,
      files,
      assistants,
      selectedWorkspace,
    },
    actions: {
      updateWorkspace,
      updateChatSession,
      updateAssistant,
      updatePrompt,
      updateFile,
      updateUser,
    },
  } = useChatStore();
  const {
    state: { isSidebarOpen },
    actions: { setSidebarOpen },
  } = useAppStore();

  // -- --
  const folders = selectedWorkspace?.folders || [];
  // -- --
  const sideBarWidthRef = useRef(null);
  const buttonRef = useRef(null);
  const isValidApiKey = Boolean(apiKey);
  // Enhanced sidebar handlers
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, [setSidebarOpen]);

  const handleSidebarOpen = useCallback(
    index => {
      setActiveTab(index);
      setSidebarOpen(true);
    },
    [setSidebarOpen]
  );

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
    setActiveTab(null);
  }, [setSidebarOpen]);

  const chatState = useMemo(
    () => ({
      apiKey,
      chatSessions,
      workspaces,
      prompts,
      files,
      assistants,
      selectedWorkspace,
    }),
    [
      apiKey,
      chatSessions,
      workspaces,
      prompts,
      files,
      assistants,
      selectedWorkspace,
    ]
  );
  const chatActions = useMemo(
    () => ({
      updateWorkspace,
      updateChatSession,
      updateAssistant,
      updatePrompt,
      updateFile,
      updateUser,
    }),
    []
  );

  // Generate sidebar tabs with dynamic data
  const sidebarTabs = useMemo(
    () =>
      SIDEBAR_CONFIG.map(config => ({
        ...config,
        data: config.getDataFromState?.(chatState, user, profile),
        onClick: () =>
          config.isNavigationTab
            ? navigate(config.navigationPath)
            : handleSidebarOpen(config.id),
      })),
    [chatState, user, profile, navigate, handleSidebarOpen]
  );

  // Enhanced save handler with error handling
  const handleSave = useCallback(() => {
    try {
      const selectedTab = sidebarTabs.find(tab => tab.space === activeTab);
      if (!selectedTab) return;

      const updateAction = chatActions[`update${selectedTab.component}`];
      if (updateAction) {
        updateAction(selectedTab.data);
        handleSidebarClose();
      }
    } catch (error) {
      console.error('Error saving data:', error);
      // Add error handling UI feedback here
    }
  }, [sidebarTabs, activeTab, chatActions, handleSidebarClose]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      {/* -- SIDEBAR SECTION ICON BUTTONS -- */}
      <SidebarTabs
        tab={activeTab}
        setTab={setActiveTab}
        handleSidebarOpen={handleSidebarOpen}
        isXs={isXs}
        isSidebarOpen={isSidebarOpen}
        isValidApiKey={isValidApiKey || profile.openai.apiKey ? true : false}
        isAuthenticated={isAuthenticated}
        isMobile={isMobile}
        sideBarWidthRef={sideBarWidthRef}
        dataList={sidebarTabs}
      />
      <Fade in={isSidebarOpen && activeTab !== null}>
        <Drawer
          anchor="left"
          open={isSidebarOpen && activeTab !== null}
          onClose={handleSidebarClose}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              color: '#fff',
              padding: '10px',
              background: '#000',
              width: drawerWidth,
              maxWidth: '450px',
              borderRight: '1px solid #333',
              transform:
                isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'none',
              transition: 'transform 1.3s ease-in-out',
              // transition: 'transform 0.3s ease-in-out',
              // transform: isSidebarOpen ? 'none' : 'translateX(-100%)', // Only hide when `isSidebarOpen` is false
            },
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box
            sx={{ padding: '16px', height: '100%', boxSizing: 'border-box' }}
          >
            <div
              style={{
                transform: isSidebarOpen ? 'none' : 'translateX(-100%)', // Only hide when `isSidebarOpen` is false
                // transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'none',
                transition: 'transform 0.3s ease-in-out',
                color: '#fff',
                display: 'flex',
                fontFamily: 'Inter, Arial, sans-serif',
                borderRadius: '14px',
                maxHeight: 'calc(100% - 16px)',
              }}
            >
              {/* -- SIDEBAR DRAWER -- */}
              <SidebarContent
                tab={activeTab}
                user={user}
                workspaces={workspaces}
                folders={folders}
                files={files}
                chatSessions={chatSessions}
                assistants={assistants}
                prompts={prompts}
                dataList={sidebarTabs}
                onSave={handleSave}
                onCancel={handleSidebarClose}
                buttonRef={buttonRef}
              />
            </div>
          </Box>
        </Drawer>
      </Fade>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingLeft: 2,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: isSidebarOpen && !isMobile ? drawerWidth : 0,
        }}
      >
        <Outlet
          context={{
            workspaceId,
            sessionId,
            toggleSidebar: handleSidebarToggle,
            isSidebarOpen,
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatLayout;

// export const ChatLayout = () => {
//   const { workspaceId, sessionId } = useParams();
//   const { theme } = useMode();
//   const navigate = useNavigate();
//   const isXs = useMediaQuery(theme.breakpoints.down('xs'));
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isMd = useMediaQuery(theme.breakpoints.down('md'));
//   const [tab, setTab] = useState(null);
//   const {
//     state: { user, isAuthenticated, profile },
//   } = useUserStore();
//   const {
//     state: {
//       apiKey,
//       chatSessions,
//       workspaces,
//       prompts,
//       files,
//       assistants,
//       selectedWorkspace,
//     },
//     actions: {
//       updateWorkspace,
//       updateChatSession,
//       updateAssistant,
//       updatePrompt,
//       updateFile,
//       updateUser,
//     },
//   } = useChatStore();
//   const {
//     state: { isSidebarOpen },
//     actions: { setSidebarOpen },
//   } = useAppStore();

//   const drawerWidth = isMobile ? '100vw' : isMd ? '350px' : '450px';
//   const handleDrawerToggle = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };
//   const handleSidebarOpen = useCallback(
//     index => {
//       setTab(index);
//       setSidebarOpen(true);
//     },
//     [setSidebarOpen]
//   );
//   const handleSidebarClose = useCallback(() => {
//     setSidebarOpen(false);
//     setTab(null); // Reset the tab when closing
//   }, [setSidebarOpen]);
//   const SIDEBAR_TABS = useMemo(
//     () => [
//       {
//         id: 0,
//         space: 'workspace',
//         component: 'Workspace',
//         icon: <SettingsIcon />,
//         onClick: () => handleSidebarOpen(0),
//         data: workspaces,
//       },
//       {
//         id: 1,
//         space: 'chatSessions',
//         component: 'ChatSession',
//         icon: <ChatIcon />,
//         onClick: () => handleSidebarOpen(1),
//         data: chatSessions,
//       },
//       {
//         id: 2,
//         space: 'assistants',
//         component: 'Assistants',
//         icon: <AssistantIcon />,
//         onClick: () => handleSidebarOpen(2),
//         data: assistants,
//       },
//       {
//         id: 3,
//         space: 'prompts',
//         component: 'Prompts',
//         icon: <EditIcon />,
//         onClick: () => handleSidebarOpen(3),
//         data: prompts,
//       },
//       {
//         id: 4,
//         space: 'files',
//         component: 'Files',
//         icon: <FilePresentIcon />,
//         onClick: () => handleSidebarOpen(4),
//         data: files,
//       },
//       {
//         id: 5,
//         space: 'user',
//         component: 'User',
//         icon: <AccountCircleRoundedIcon />,
//         onClick: () => handleSidebarOpen(5),
//         data: { ...user, ...profile },
//       },
//       {
//         id: 6,
//         space: 'Home',
//         component: 'Home',
//         icon: <HomeIcon />,
//         onClick: () => navigate('/admin/dashboard'), // Use navigate for the Home icon
//         data: null,
//       },
//     ],
//     [
//       workspaces,
//       chatSessions,
//       assistants,
//       prompts,
//       files,
//       user,
//       navigate,
//       handleSidebarOpen,
//       profile,
//     ]
//   );
//   const onSave = useCallback(() => {
//     const selectedTabData = SIDEBAR_TABS.find(item => item.space === tab);
//     if (!selectedTabData) return;

//     const updateActions = {
//       Workspace: updateWorkspace,
//       ChatSession: updateChatSession,
//       Assistants: updateAssistant,
//       Prompts: updatePrompt,
//       Files: updateFile,
//       User: updateUser,
//     };

//     const updateAction = updateActions[selectedTabData.component];
//     if (updateAction) {
//       updateAction(selectedTabData.data);
//     } else {
//       console.log('No matching component for saving');
//     }
//     handleSidebarClose();
//   }, [
//     SIDEBAR_TABS,
//     updateWorkspace,
//     updateChatSession,
//     updateAssistant,
//     updatePrompt,
//     updateFile,
//     updateUser,
//     handleSidebarClose,
//     tab,
//   ]);

//   const onCancel = useCallback(() => {
//     handleSidebarClose();
//   }, [handleSidebarClose]);

//   useEffect(() => {
//     if (isXs && tab !== null) {
//       setSidebarOpen(true);
//     }
//   }, [isXs, tab, setSidebarOpen]);

//   return (
//     <Box sx={{ display: 'flex', minHeight: '100vh' }}>
//       <CssBaseline />

//       {/* Sidebar Drawer with Enhanced Animations and Responsiveness */}
//       <Slide
//         direction="right"
//         in={isSidebarOpen && tab !== null}
//         mountOnEnter
//         unmountOnExit
//       >
//         <Drawer
//           anchor="left"
//           open={isSidebarOpen && tab !== null}
//           onClose={handleSidebarClose}
//           ModalProps={{
//             keepMounted: true, // Better open performance on mobile
//           }}
//           PaperProps={{
//             sx: {
//               color: '#fff',
//               padding: '10px',
//               background: '#000',
//               flexShrink: 0,
//               width: drawerWidth, // Dynamic width based on screen size
//               maxWidth: isMd ? '350px' : '450px', // Ensure it doesn't exceed maxWidth
//               borderRight: '1px solid #333',
// transition: theme.transitions.create(['width', 'transform'], {
//   easing: theme.transitions.easing.sharp,
//   duration: theme.transitions.duration.standard,
// }),
//             },
//           }}
//           sx={{
//             '& .MuiDrawer-paper': {
//               width: drawerWidth,
//               boxSizing: 'border-box',
//             },
//           }}
//         >
//           <ChatSidebar
//             workspaceId={workspaceId}
//             onOpen={handleSidebarOpen}
//             onClose={handleSidebarClose}
//             onSave={onSave}
//             onCancel={onCancel}
//             tab={tab}
//             tabs={SIDEBAR_TABS}
//           />
//         </Drawer>
//       </Slide>

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           transition: theme.transitions.create(['margin', 'width'], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.leavingScreen,
//           }),
//           marginLeft: isSidebarOpen && !isMobile ? `${drawerWidth}px` : 0,
//         }}
//       >
//         <Outlet
//           context={{
//             workspaceId,
//             sessionId,
//             toggleSidebar: handleDrawerToggle,
//             isSidebarOpen,
//           }}
//         />
//       </Box>
//     </Box>
//   );
// };

// export default ChatLayout;

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
