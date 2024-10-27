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

  // useEffect(() => {
  //   if (!selectedChatSession) {
  //     const defaultSession = {
  //       _id: 'default',
  //       messages: [],
  //       title: 'New Chat',
  //     };
  //     setSessionId(defaultSession._id);
  //     setChatMessages([]);
  //   } else {
  //     setSessionId(selectedChatSession._id);
  //     const transformedMessages = transformMessages(
  //       selectedChatSession.messages || []
  //     );
  //     setChatMessages(transformedMessages);
  //   }
  // }, [selectedChatSession, setSessionId, setChatMessages]);

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

  // useEffect(() => {
  //   const isValidSessionId =
  //     sessionId && typeof sessionId === 'string' && sessionId.trim() !== '';
  //   const isValidSelectedWorkspace = selectedWorkspace && selectedWorkspace._id;
  //   const isValidSelectedChatSession =
  //     selectedChatSession && selectedChatSession._id;
  //   const isChatPath = location.pathname.startsWith('/admin/chat'); // Adjust based on your routing
  //   const isActiveChatPath = location.pathname.startsWith(
  //     `/admin/workspaces/${selectedWorkspace._id}/chat/${sessionId}`
  //   );

  //   if (
  //     !isActiveChatPath &&
  //     isValidSessionId &&
  //     isValidSelectedWorkspace &&
  //     isValidSelectedChatSession &&
  //     isChatPath
  //   ) {
  //     // All conditions are met, perform any necessary actions
  //     // For example, navigate to a specific chat route if needed
  //     navigate(`/admin/workspaces/${selectedWorkspace._id}/chat/${sessionId}`, {
  //       replace: true,
  //     });
  //     // If no navigation is required, you can omit this part
  //   } else {
  //     // Logging each condition that is not satisfied
  //     if (!isValidSessionId) {
  //       console.warn(
  //         `Invalid Session ID: ${
  //           sessionId
  //             ? `Session ID is invalid or empty. Session ID: "${sessionId}"`
  //             : 'No session ID found.'
  //         }`
  //       );
  //     }

  //     if (!isValidSelectedWorkspace) {
  //       console.warn(
  //         `Invalid Selected Workspace: ${
  //           selectedWorkspace
  //             ? `Workspace ID is missing or invalid. Workspace: ${JSON.stringify(selectedWorkspace)}`
  //             : 'No workspace selected.'
  //         }`
  //       );
  //     }

  //     if (!isValidSelectedChatSession) {
  //       console.warn(
  //         `Invalid Selected Chat Session: ${
  //           selectedChatSession
  //             ? `Chat Session ID is missing or invalid. Chat Session: ${JSON.stringify(selectedChatSession)}`
  //             : 'No chat session selected.'
  //         }`
  //       );
  //     }

  //     if (!isChatPath) {
  //       console.warn(
  //         `Invalid Pathname: Expected a chat path starting with '/admin/chat' but found '${location.pathname}'.`
  //       );
  //     }
  //   }
  // }, [sessionId, selectedWorkspace, selectedChatSession, navigate]);

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
