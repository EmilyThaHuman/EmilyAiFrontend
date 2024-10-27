// =========================================================
// [ChatLayout] | Centralizes the layout and responsiveness
// =========================================================
import {
  Box,
  Drawer,
  useMediaQuery,
  useTheme,
  CssBaseline,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { userApi } from 'api/user';
import { SidebarContent, SidebarTabs } from 'components';
import { SIDEBAR_CONFIG } from 'config/data-configs/sidebar'; // Move sidebar configuration to separate file
import { useAppStore, useChatStore, useUserStore } from 'contexts/index'; // Consolidated imports
import { useMode } from 'hooks/app';

export const ChatLayout = () => {
  const { workspaceId, sessionId } = useParams();
  const navigate = useNavigate();
  const { theme } = useMode();
  const { isXs, isMobile, isMd, drawerWidth } = useResponsiveDrawer();
  const [activeTab, setActiveTab] = useState(null);
  const {
    state: { user, profile },
  } = useUserStore();
  const {
    state: {
      apiKey,
      chatSessions,
      workspaces,
      prompts,
      folders,
      files,
      assistants,
      selectedWorkspace,
    },
    actions: {
      setFolders,
      setFiles,
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
  // Set folders based on the selected workspace
  useEffect(() => {
    if (selectedWorkspace) {
      setFolders(selectedWorkspace.folders);
    }
  }, [selectedWorkspace, setFolders]);
  // -- --
  const sideBarWidthRef = useRef(null);
  const buttonRef = useRef(null);
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };
  const mainContentVariants = {
    expanded: {
      marginLeft:
        isSidebarOpen && !isMobile ? `${drawerWidth}px` : theme.spacing(2),
      transition: {
        type: 'spring',
        stiffness: 250,
        damping: 25,
        duration: 0.5,
      },
    },
    collapsed: {
      marginLeft: theme.spacing(2),
      transition: {
        type: 'spring',
        stiffness: 250,
        damping: 25,
        duration: 0.5,
      },
    },
  };
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile, setSidebarOpen]);
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
  const sideBarState = useMemo(
    () => ({
      apiKey: profile.defaultApiKey,
      chatSessions: selectedWorkspace.chatSessions,
      workspaces: workspaces,
      prompts: selectedWorkspace.prompts,
      files: selectedWorkspace.files,
      assistants: selectedWorkspace.assistants,
      selectedWorkspace: selectedWorkspace,
    }),
    [profile.defaultApiKey, selectedWorkspace, workspaces]
  );

  // Generate sidebar tabs with dynamic data
  const sidebarTabs = useMemo(
    () =>
      SIDEBAR_CONFIG.map(config => ({
        ...config,
        data: config.getDataFromState?.(sideBarState),
        onClick: () =>
          config.isNavigationTab
            ? navigate(config.navigationPath)
            : handleSidebarOpen(config.space),
      })),
    [sideBarState, navigate, handleSidebarOpen]
  );

  // Step 1: Create the Data Map Function
  const getDataMapFromTabs = sidebarTabs => {
    return sidebarTabs.reduce((acc, tab) => {
      if (tab.space && tab.data !== undefined) {
        acc[tab.space] = tab.data;
      }
      return acc;
    }, {});
  };

  // Step 2: Use the Function to Create the Data Map
  const dataMap = useMemo(() => getDataMapFromTabs(sidebarTabs), [sidebarTabs]);
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
    <Box
      sx={{ display: 'flex', minHeight: '100vh', padding: theme.spacing(1) }}
    >
      <CssBaseline />
      {/* -- SIDEBAR SECTION ICON BUTTONS -- */}
      <SidebarTabs
        tab={activeTab}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        sideBarWidthRef={sideBarWidthRef}
        dataList={sidebarTabs}
      />
      <motion.div
        initial="closed"
        animate={isSidebarOpen && activeTab !== null ? 'open' : 'closed'}
        variants={sidebarVariants}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: drawerWidth,
          background: '#000',
          color: '#fff',
          zIndex: 1200,
          overflow: 'hidden', // Disable any scrolling
        }}
      >
        <Drawer
          anchor="left"
          open={isSidebarOpen && activeTab !== null}
          onClose={handleSidebarClose}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              padding: '10px',
              width: drawerWidth,
              height: '100vh', // Fix the drawer height
              maxWidth: '450px',
              maxHeight: '100vh',
              background: '#000',
              borderRight: '1px solid #333',
              overflow: 'hidden', // Disable any scrolling
            },
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              maxHeight: '100vh',
            },
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              height: '100%',
              maxHeight: '100vh',
            }}
          >
            <div
              style={{
                transform:
                  isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'none',
                transition: 'transform 0.3s ease-in-out',
                color: '#fff',
                display: 'flex',
                fontFamily: 'Inter, Arial, sans-serif',
                borderRadius: '14px',
                maxHeight: 'calc(100% - 16px)',
              }}
            >
              {/* -- SIDEBAR DRAWER CONTENT -- */}
              <SidebarContent
                tab={activeTab}
                user={user}
                workspaces={workspaces}
                folders={folders}
                onSave={handleSave}
                onCancel={handleSidebarClose}
                buttonRef={buttonRef}
                dataList={sidebarTabs}
                dataMap={dataMap}
              />
            </div>
          </Box>
        </Drawer>
      </motion.div>

      {/* -- MAIN CONTENT -- */}
      <motion.main
        initial={isSidebarOpen && !isMobile ? 'expanded' : 'collapsed'}
        animate={isSidebarOpen ? 'expanded' : 'collapsed'}
        variants={mainContentVariants}
        style={{
          flexGrow: 1,
          padding: theme.spacing(2),
          transition: 'margin-left 0.3s ease-in-out',
          overflow: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <Outlet
          context={{
            workspaceId,
            sessionId,
            toggleSidebar: () => setSidebarOpen(prev => !prev),
            isSidebarOpen,
          }}
        />
      </motion.main>
    </Box>
  );
};

export const useResponsiveDrawer = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));

  const drawerWidth = useMemo(() => {
    if (isMobile) return '80vw'; // Slightly less than full width for aesthetics
    if (isMd) return '350px';
    return '450px';
  }, [isMobile, isMd]);

  return {
    isMd,
    isXs,
    isMobile,
    drawerWidth,
  };
};
export default ChatLayout;
