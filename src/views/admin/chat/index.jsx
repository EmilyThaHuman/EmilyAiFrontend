// MainChat.js
'use client';
/* eslint-disable no-constant-condition */
import { Box, CircularProgress } from '@mui/material';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { ChatHeader, MessageInput } from 'components/chat';
import { MessageBox } from 'components/chat/messages';
import { CODE_PROMPT_OPTIONS } from 'config/data-configs';
import { useChatStore } from 'contexts/ChatProvider';
import { useChatHandler, useMenu } from 'hooks';
import 'styles/ChatStyles.css';

export const MainChat = () => {
  const navigate = useNavigate();
  const { chatSession } = useLoaderData(); // Loaded via chatSessionLoader
  const {
    state: { userInput, isStreaming, chatLoading, chatDisabled },
    actions: {
      setSessionId,
      setChatMessages,
      /* --- add server-side file population here --- */
    },
  } = useChatStore();

  const chatContainerRef = useRef(null);
  const { controllerRef, handleSendMessage } = useChatHandler();

  // Initialize chat session data
  useEffect(() => {
    if (chatSession) {
      setSessionId(chatSession._id);
      const transformedMessages = transformMessages(chatSession.messages || []);
      setChatMessages(transformedMessages);
    } else {
      // Handle missing chatSession, possibly navigate back or show an error
      navigate('/admin/workspaces'); // Adjust the path as needed
    }
  }, [chatSession, setSessionId, setChatMessages, navigate]);

  const transformMessages = messages => {
    return messages.map(message => {
      if (typeof message === 'string') {
        return {
          _id: message,
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

  const areMessagesEqual = (messages1, messages2) => {
    if (messages1?.length !== messages2?.length) return false;

    for (let i = 0; i < messages1.length; i++) {
      if (messages1[i]?._id !== messages2[i]?._id) return false;
    }

    return true;
  };

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

  /* --- Function to handle the positioning of the prompts dialog --- */
  useLayoutEffect(() => {
    if (promptsMenu.isOpen && sidebarItemRef.current && dialogRef.current) {
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

  /* --- Cleanup on component unmount --- */
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [controllerRef]);

  return (
    <Box
      id="chat-view-container"
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
      {/* --- CHAT HEADER --- */}
      <ChatHeader />

      {/* --- CHAT MESSAGE SCROLL AREA --- */}
      <Box
        ref={chatContainerRef}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        {chatSession &&
        chatSession.messages &&
        chatSession.messages.length > 0 ? (
          <MessageBox
            handlePromptSelect={handlePromptSelect}
            codePromptOptions={CODE_PROMPT_OPTIONS}
          />
        ) : (
          <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
            <h3>No messages yet, try one of these prompts:</h3>
            <MessageBox
              handlePromptSelect={handlePromptSelect}
              codePromptOptions={CODE_PROMPT_OPTIONS}
            />
            {chatLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* --- CHAT INPUT --- */}
      <Box
        sx={{
          mt: 'auto', // Ensure it stays at the bottom
          width: '100%',
          backgroundColor: '#26242C',
          borderTop: '1px solid #444',
        }}
      >
        <MessageInput
          disabled={chatDisabled || chatLoading || isStreaming || false}
        />
      </Box>
    </Box>
  );
};

export default MainChat;
