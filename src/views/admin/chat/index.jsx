'use client';
import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { settingsApi, workspacesApi } from '@/api';
import { deduplicateArray } from '@/utils';
import { ChatHeader } from 'components/chat/ChatHeader';
import { useChatStore } from 'contexts/ChatProvider';

export const ChatLayout = () => {
  const workspaceId = useParams().workspaceId;
  // const { chatSession } = useLoaderData(); // Loaded via workspaceLoader
  const navigate = useNavigate();

  const {
    // state: { selectedWorkspace, selectedChatSession },
    // actions: { setSessionId, setChatMessages },
    state: { selectedPreset, presets, selectedWorkspace, selectedChatSession },
    actions: { setSelectedPreset, setPresets, setChatMessages },
  } = useChatStore();

  const sessionId = sessionStorage.getItem('sessionId');

  const transformMessages = messages =>
    messages.map(message =>
      typeof message === 'string'
        ? {
            _id: message,
            content: message,
            role: 'user',
            isUserMessage: true,
          }
        : { ...message, isUserMessage: message.role === 'user' }
    );

  useEffect(() => {
    const fetchData = async () => {
      const isValidWorkspace = selectedWorkspace && selectedWorkspace._id;
      const isValidChatSession = selectedChatSession && selectedChatSession._id;
      const isActiveWorkspacePath = location.pathname.startsWith(
        `/admin/workspaces/${selectedWorkspace._id}`
      );
      const isActiveChatPath = location.pathname.startsWith(
        `/admin/workspaces/${selectedWorkspace._id}/chat/${selectedChatSession._id}`
      );
      const hasPresetBeenSet = selectedPreset && selectedPreset.name;

      if (
        isActiveWorkspacePath &&
        isActiveChatPath &&
        isValidWorkspace &&
        isValidChatSession &&
        !hasPresetBeenSet
      ) {
        try {
          // const messages = transformMessages(chatSession.messages);
          // setChatMessages(messages);
          const presetsData = await workspacesApi.getWorkspacePresets(
            selectedWorkspace._id
          );
          // const presetsData = await settingsApi.getAllPresetsByWorkspaceId(
          //   selectedWorkspace._id
          // );
          const filtedPresets = deduplicateArray(presetsData);
          setPresets(filtedPresets);
          setSelectedPreset(filtedPresets[0]);
        } catch (error) {
          console.error('Error fetching presets:', error);
        }
      } else {
        console.log('Invalid workspace or chat session');
      }
    };

    fetchData();
  }, [
    selectedWorkspace,
    selectedChatSession,
    setPresets,
    setSelectedPreset,
    selectedPreset,
  ]);

  return (
    <Box
      id="chat-layout-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease-in-out',
        flex: 1,
        p: 4,
        height: '100%', // Take full viewport height
        backgroundColor: '#1C1C1C',
        borderRadius: '14px',
      }}
    >
      {/* Chat Header */}
      <ChatHeader />
      {/* Outlet for Chat Interface */}
      <Outlet />
    </Box>
  );
};

export default ChatLayout;
