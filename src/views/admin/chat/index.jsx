'use client';
import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { ChatHeader } from 'components/chat/ChatHeader';
import { useChatStore } from 'contexts/ChatProvider';

export const ChatLayout = () => {
  const workspaceId = useParams().workspaceId;
  // const { chatSession } = useLoaderData(); // Loaded via workspaceLoader
  const navigate = useNavigate();

  const {
    state: { selectedWorkspace, selectedChatSession },
    actions: { setSessionId, setChatMessages },
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
