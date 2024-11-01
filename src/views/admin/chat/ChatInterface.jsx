'use client';
/* eslint-disable no-constant-condition */
import { Box, CircularProgress } from '@mui/material';
import React, { useEffect, useLayoutEffect, useRef } from 'react';

import { MessageInput, MessageBox } from 'components/chat';
import { CODE_PROMPT_OPTIONS } from 'config/data-configs';
import { useChatStore } from 'contexts/ChatProvider';
import { useChatHandler, useMenu } from 'hooks';
import 'styles/ChatStyles.css';

export const ChatInterface = ({ chatSession }) => {
  const chatContainerRef = useRef(null);
  const { controllerRef, handleSendMessage } = useChatHandler();
  const {
    state: { isStreaming, chatLoading, chatDisabled },
  } = useChatStore();

  const promptsMenu = useMenu();
  const dialogRef = useRef(null);
  const sidebarItemRef = useRef(null);

  useLayoutEffect(() => {
    if (promptsMenu.isOpen && sidebarItemRef.current && dialogRef.current) {
      const sidebarItemRect = sidebarItemRef.current.getBoundingClientRect();
      const dialogRect = dialogRef.current.getBoundingClientRect();
      dialogRef.current.style.left = `${sidebarItemRect.right + 32}px`;
      dialogRef.current.style.top = `${sidebarItemRect.top - dialogRect.height / 2 + sidebarItemRect.height / 2}px`;
    }
  }, [promptsMenu.isOpen]);

  useEffect(() => () => controllerRef.current?.abort(), [controllerRef]);

  const handlePromptSelect = prompt => {
    handleSendMessage({ content: prompt, isNewSession: true });
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Prevent overflow
        marginTop: '20px',
        marginBottom: '20px',
        height: '100%',
      }}
      ref={chatContainerRef}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto', // Allow scrolling for messages
          paddingBottom: '20px', // Add some padding to the bottom
        }}
      >
        {chatSession?.messages?.length > 0 ? (
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
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#26242C',
          borderTop: '1px solid #444',
        }}
      >
        <MessageInput disabled={chatDisabled || chatLoading || isStreaming} />
      </Box>
    </Box>
  );
};

export default ChatInterface;
