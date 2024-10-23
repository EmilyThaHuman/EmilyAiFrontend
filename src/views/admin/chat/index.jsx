'use client';
/* eslint-disable no-constant-condition */
// =========================================================
// [CHAT BOT] | React Chatbot
// =========================================================
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  useMediaQuery,
} from '@mui/material';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { ChatHeader, MessageInput } from 'components/chat';
import { MessageBox } from 'components/chat/messages';
import { RANDOM_PROMPTS } from 'config/data-configs';
import { useAppStore } from 'contexts/AppProvider';
import { useChatStore } from 'contexts/ChatProvider';
import { useChatHandler, useMenu, useMode, useTipTapEditor } from 'hooks';
import 'styles/ChatStyles.css';
const codePromptOptions = [
  {
    title: 'Explain Code',
    description: 'Get a detailed explanation of your code',
    prompt:
      'Please explain this code in detail:\n```\n// Paste your code here\n```',
  },
  {
    title: 'Debug Code',
    description: 'Find and fix issues in your code',
    prompt:
      'Please help me debug this code and identify potential issues:\n```\n// Paste your code here\n```',
  },
  {
    title: 'Optimize Code',
    description: 'Get suggestions for code optimization',
    prompt:
      'Please suggest optimizations for this code:\n```\n// Paste your code here\n```',
  },
  {
    title: 'Convert Code',
    description: 'Convert code between languages',
    prompt:
      'Please convert this code from [source language] to [target language]:\n```\n// Paste your code here\n```',
  },
];

export const MainChat = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { workspace } = useLoaderData(); // This is the workspace object returned from your loader
  const { theme } = useMode();
  const {
    state: { isSidebarOpen },
  } = useAppStore();
  const {
    state: { userInput, isStreaming, selectedChatSession, chatLoading },
    actions: {
      setWorkspaceId,
      setHomeWorkSpace,
      setSelectedWorkspace,
      setChatSessions,
      setSessionId,
      setSelectedChatSession,
      setAssistants,
      setFolders,
      setChatLoading,
      setChatMessages,
      /* --- add server-side file population here --- */
      setPrompts,
      setTools,
    },
  } = useChatStore();
  const chatContainerRef = useRef(null);
  const { insertContentAndSync } = useTipTapEditor(userInput);
  const {
    // messages,
    controllerRef,
    handleSendMessage,
    handleRegenerateResponse,
    handleStop,
  } = useChatHandler();

  // First useEffect for workspace initialization
  useEffect(() => {
    if (workspace) {
      const { chatSessions, assistants, prompts, tools } = workspace;

      setWorkspaceId(workspace._id);
      setSelectedWorkspace(workspace);
      setFolders(workspace.folders);
      setHomeWorkSpace(workspace);
      setChatSessions(chatSessions);
      setAssistants(assistants);
      setPrompts(prompts);
      setTools(tools);

      if (chatSessions.length > 0) {
        setSessionId(chatSessions[0]._id);
        setSelectedChatSession(chatSessions[0]);
      }
    }
  }, [workspace]);

  // Second useEffect for selectedChatSession
  useEffect(() => {
    if (selectedChatSession) {
      const transformMessages = messages => {
        return messages.map(message => {
          // Transformation logic
          if (typeof message === 'string') {
            return {
              _id: uuidv4(),
              content: message,
              role: 'user',
              isUserMessage: true,
            };
          } else if (typeof message === 'object' && message !== null) {
            return {
              ...message,
              isUserMessage: message.role === 'user',
            };
          } else {
            return {
              _id: uuidv4(),
              content: '',
              role: '',
              isUserMessage: false,
            };
          }
        });
      };

      const transformedMessages = transformMessages(
        selectedChatSession.messages || []
      );
      // setChatMessages(transformedMessages);
      const messagesHaveChanged = !areMessagesEqual(
        selectedChatSession.messages,
        transformedMessages
      );

      if (messagesHaveChanged) {
        setSelectedChatSession({
          ...selectedChatSession,
          messages: transformedMessages,
        });
        setChatMessages(transformedMessages);
      }
    } else if (workspace) {
      navigate(
        `/admin/workspaces/${workspace._id}/chat/${sessionStorage.getItem('sessionId')}`
      );
    }
  }, [
    selectedChatSession,
    workspace,
    navigate,
    setSelectedChatSession,
    setChatMessages,
  ]);

  const areMessagesEqual = (messages1, messages2) => {
    if (messages1?.length !== messages2?.length) return false;

    for (let i = 0; i < messages1.length; i++) {
      if (messages1[i]?._id !== messages2[i]?._id) return false;
    }

    return true;
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [marginLeft, setMarginLeft] = useState(isMobile ? '0px' : '50px');

  useEffect(() => {
    setMarginLeft(isMobile ? '0px' : '50px');
  }, [isMobile, isSidebarOpen]);

  const promptsMenu = useMenu();
  const dialogRef = useRef(null);
  const sidebarItemRef = useRef(null);

  const handlePromptSelect = prompt => {
    console.log('Selected prompt:', prompt);
    handleSendMessage({
      content: prompt,
      isNewSession: true,
    });
  };

  /* --- fn() to handle the focus of the chat input --- */
  useLayoutEffect(() => {
    if (promptsMenu.isOpen && sidebarItemRef.current) {
      const sidebarItemRect = sidebarItemRef.current.getBoundingClientRect();
      const dialogRect = dialogRef.current.getBoundingClientRect();

      const leftPosition = sidebarItemRect.right + 32;
      const topPosition =
        sidebarItemRect.top -
        dialogRect.height / 2 +
        sidebarItemRect.height / 2;

      dialogRef.current.style.left = `${leftPosition}px`;
      dialogRef.current.style.top = `${topPosition}px`;
    }
  }, [promptsMenu.isOpen]);
  /* -- */

  /* --- fn() to handle the chat abort option --- */
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [controllerRef]);

  const limitedPrompts = RANDOM_PROMPTS.slice(0, 5);

  return (
    <Box
      id="chat-view-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // height: '100%', // Fill the available height
        transition: 'width 0.3s ease-in-out',
        flex: 1,
        p: 4,
        height: '100vh', // Take full viewport height

        overflowY: 'hidden',
        backgroundColor: '#1C1C1C',
        borderRadius: '14px',
      }}
    >
      {/* Chat header */}
      <ChatHeader />
      {/* Chat messages container with scrollable area */}
      <Box
        ref={chatContainerRef}
        sx={{
          flexGrow: 1, // This makes the messages area take up remaining space
          overflowY: 'auto',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        {/* Replace this with your actual messages rendering logic */}
        {selectedChatSession && selectedChatSession?.messages?.length > 0 ? (
          <MessageBox
            handlePromptSelect={handlePromptSelect}
            codePromptOptions={codePromptOptions}
          />
        ) : (
          <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
            <h3>No messages yet, try one of these prompts:</h3>
            <MessageBox
              handlePromptSelect={handlePromptSelect}
              codePromptOptions={codePromptOptions}
            />
            {chatLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Chat input */}
      <Box
        sx={{
          mt: 'auto', // Ensure it stays at the bottom
          width: '100%',
          backgroundColor: '#26242C',
          borderTop: '1px solid #444',
        }}
      >
        <MessageInput
          disabled={chatLoading || isStreaming || false}
          onSend={handleSendMessage}
          inputContent={userInput}
          isSubmitting={chatLoading}
          setIsSubmitting={setChatLoading}
          onStop={handleStop}
          onRegenerate={handleRegenerateResponse}
          onChange={insertContentAndSync}
          // disabled={chatLoading}
          // onSend={handleSendMessage}
        />
      </Box>
      {/* </Box> */}
      {/* </Box>
      </Paper> */}
    </Box>
  );
};

export default MainChat;
