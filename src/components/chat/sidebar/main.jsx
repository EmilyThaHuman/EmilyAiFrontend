import { Box, Drawer, useMediaQuery } from '@mui/material';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AccountCircleRoundedIcon,
  AiIcon,
  AssistantIcon,
  ChatIcon,
  EditIcon,
  FilePresentIcon,
  FingerprintIcon,
  HomeIcon,
  KeyIcon,
  SettingsIcon,
} from 'assets/humanIcons';
import { useAppStore, useChatStore, useUserStore } from 'contexts';
import { useMode } from 'hooks';

import SidebarContent from './SidebarContent';
import SidebarTabs from './SidebarTabs';

export const ChatSidebar = () => {
  const { theme } = useMode();
  const navigate = useNavigate();
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
  const folders = selectedWorkspace.folders;
  // -- --
  const sideBarWidthRef = useRef(null);
  const buttonRef = useRef(null);
  const isValidApiKey = Boolean(apiKey);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen size is mobile
  const isXs = useMediaQuery(theme.breakpoints.down('xs')); // Check if the screen size is mobile
  const isMd = useMediaQuery(theme.breakpoints.down('md')); // New md media query
  // -- --
  const [tab, setTab] = useState(null);

  useEffect(() => {
    if (isXs && tab !== null) {
      setSidebarOpen(true);
    }
  }, [isXs, tab, setSidebarOpen]);

  const handleSidebarOpen = useCallback(
    index => {
      setTab(index);
      setSidebarOpen(true);
    },
    [setSidebarOpen]
  );

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
    setTab(null); // Reset the tab when closing
  }, [setSidebarOpen]);

  const SIDEBAR_TABS = useMemo(
    () => [
      {
        id: 0,
        space: 'workspace',
        component: 'Workspace',
        icon: <SettingsIcon />,
        onClick: () => handleSidebarOpen(0),
        data: workspaces,
      },
      {
        id: 1,
        space: 'chatSessions',
        component: 'ChatSession',
        icon: <ChatIcon />,
        onClick: () => handleSidebarOpen(1),
        data: chatSessions,
      },
      {
        id: 2,
        space: 'assistants',
        component: 'Assistants',
        icon: <AssistantIcon />,
        onClick: () => handleSidebarOpen(2),
        data: assistants,
      },
      {
        id: 3,
        space: 'prompts',
        component: 'Prompts',
        icon: <EditIcon />,
        onClick: () => handleSidebarOpen(3),
        data: prompts,
      },
      {
        id: 4,
        space: 'files',
        component: 'Files',
        icon: <FilePresentIcon />,
        onClick: () => handleSidebarOpen(4),
        data: files,
      },
      {
        id: 5,
        space: 'user',
        component: 'User',
        icon: <AccountCircleRoundedIcon />,
        onClick: () => handleSidebarOpen(5),
        data: { ...user, ...profile },
      },
      {
        id: 6,
        space: 'Home',
        component: 'Home',
        icon: <HomeIcon />,
        onClick: () => navigate('/admin/dashboard'), // Use navigate for the Home icon
        data: null,
      },
    ],
    [
      workspaces,
      chatSessions,
      assistants,
      prompts,
      files,
      user,
      navigate,
      handleSidebarOpen,
      profile,
    ]
  );

  const onSave = useCallback(() => {
    const selectedTabData = SIDEBAR_TABS.find(item => item.space === tab);
    if (!selectedTabData) return;

    const updateActions = {
      Workspace: updateWorkspace,
      ChatSession: updateChatSession,
      Assistants: updateAssistant,
      Prompts: updatePrompt,
      Files: updateFile,
      User: updateUser,
    };

    const updateAction = updateActions[selectedTabData.component];
    if (updateAction) {
      updateAction(selectedTabData.data);
    } else {
      console.log('No matching component for saving');
    }
    handleSidebarClose();
  }, [
    SIDEBAR_TABS,
    updateWorkspace,
    updateChatSession,
    updateAssistant,
    updatePrompt,
    updateFile,
    updateUser,
    handleSidebarClose,
    tab,
  ]);

  const onCancel = useCallback(() => {
    handleSidebarClose();
  }, [handleSidebarClose]);

  return (
    <Box
      sx={{
        padding: '4px',
        maxHeight: 'calc(100% - 16px)',
        flexGrow: 1,
      }}
    >
      <div
        style={{
          transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'none',
          transition: 'transform 0.3s ease-in-out',
          color: '#fff',
          display: 'flex',
          fontFamily: 'Inter, Arial, sans-serif',
          borderRadius: '14px',
          maxHeight: 'calc(100% - 16px)',
        }}
      >
        {/* -- SIDEBAR SECTION ICON BUTTONS -- */}
        <SidebarTabs
          tab={tab}
          handleSidebarOpen={handleSidebarOpen}
          isXs={isXs}
          isSidebarOpen={isSidebarOpen}
          isValidApiKey={isValidApiKey || profile.openai.apiKey ? true : false}
          isAuthenticated={isAuthenticated}
          isMobile={isMobile}
          sideBarWidthRef={sideBarWidthRef}
          theme={theme}
          dataList={SIDEBAR_TABS}
        />

        {/* -- SIDEBAR DRAWER -- */}
        <Drawer
          anchor="left"
          open={tab !== null}
          onClose={handleSidebarClose}
          PaperProps={{
            sx: {
              color: '#fff',
              padding: '10px',
              background: '#000',
              maxWidth: isMd ? '350px' : '450px', // Set maxWidth based on md media query
              width: isMobile ? '100vw' : isMd ? '350px' : '450px', // Adjust width based on screen size
              borderRight: '1px solid #333',
              transform:
                isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'none',
              transition: 'transform 1.3s ease-in-out',
            },
          }}
        >
          <SidebarContent
            tab={tab}
            user={user}
            workspaces={workspaces}
            folders={folders}
            files={files}
            chatSessions={chatSessions}
            assistants={assistants}
            prompts={prompts}
            dataList={SIDEBAR_TABS}
            onSave={onSave}
            onCancel={onCancel}
            buttonRef={buttonRef}
          />
        </Drawer>
      </div>
    </Box>
  );
};

export const DefaultTab = () => <div style={{ color: 'white' }}></div>;

export default ChatSidebar;
