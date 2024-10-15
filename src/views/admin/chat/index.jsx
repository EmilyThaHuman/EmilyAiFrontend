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
import { useActionData, useParams } from 'react-router-dom';

import { ChatHeader, MessageInput } from 'components/chat';
import { MessageBox } from 'components/chat/messages';
import { RANDOM_PROMPTS } from 'config/data-configs';
import { useAppStore } from 'contexts/AppProvider';
import { useChatStore } from 'contexts/ChatProvider';
import {
  useChatHandler,
  useChatScroll,
  useChatSessionHandler,
  useMenu,
  useMode,
  useTipTapEditor,
} from 'hooks';
import 'styles/ChatStyles.css';

export const MainChat = () => {
  const { theme } = useMode();
  const {
    state: { isSidebarOpen },
  } = useAppStore();
  const params = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [marginLeft, setMarginLeft] = useState(isMobile ? '0px' : '50px');

  useEffect(() => {
    setMarginLeft(isMobile ? '0px' : '50px');
  }, [isMobile, isSidebarOpen]);

  const {
    state: { userInput, sessionId, chatMessages, isStreaming },
  } = useChatStore();

  const { insertContentAndSync } = useTipTapEditor(userInput);
  const {
    // messages,
    chatError,
    chatLoading,
    controllerRef,
    handleSendMessage,
    handleRegenerateResponse,
    handleStop,
  } = useChatHandler();
  const { handleGetSession, handleCreateNewSession } = useChatSessionHandler();
  const promptsMenu = useMenu();
  const dialogRef = useRef(null);
  const sidebarItemRef = useRef(null);
  const { chatContainerRef } = useChatScroll();
  const { scrollToBottom, setIsAtBottom } = useChatScroll();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const initializeSession = useCallback(async () => {
    if ((!chatMessages || chatMessages.length === 0) && sessionId) {
      await handleGetSession();
    }
  }, [sessionId, chatMessages, handleGetSession]);

  useEffect(() => {
    initializeSession();
  }, []);

  /* --- fn() to handle the scroll to bottom --- */
  useEffect(() => {
    const fetchData = async () => {
      await handleGetSession();
      scrollToBottom();
      setIsAtBottom(true);
    };

    if (!chatLoading && !isStreaming && !chatError) {
      console.log(
        `[CHAT_PARAMS][${JSON.stringify({
          workspace: params?.workspaceId,
          chat: params?.sessionId,
          model: params?.modelId,
        })}]`
      );
      fetchData();
    }
  }, [
    params?.workspaceId,
    params?.sessionId,
    params?.modelId,
    handleGetSession,
    scrollToBottom,
    setIsAtBottom,
    chatLoading,
    chatError,
    isStreaming,
  ]);

  /* --- fn() to handle the chat abort option --- */
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
        flexGrow: 1,
        marginLeft: marginLeft, // Use the marginLeft state variable
        display: 'flex',
        flexDirection: 'column',
        maxWidth: !isMobile ? 'calc(100% - 24px)' : null,
        transition: 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out', // Smooth transition
      }}
    >
      <Box
        id="chat-header-container"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100%', // Ensure width is 100%
        }}
      >
        <Paper
          theme={theme}
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 8px)',
            width: `calc(100% - 20px)`,
            my: 'auto',
            ml: 'auto',
            [theme.breakpoints.down('sm')]: {
              height: '100vh',
              width: '100%',
            },
          }}
        >
          <Box
            theme={theme}
            ref={chatContainerRef}
            component={Grid}
            item
            xs={12}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#1C1C1C',
              width: '100%',
              height: '100%',
              borderRadius: '14px',
              overflow: 'auto', // Allow scrolling
              flexGrow: 1,
            }}
          >
            <ChatHeader />
            <Box sx={{ textAlign: 'center', margin: '20px' }}>
              <h3>No messages yet, try one of these prompts:</h3>
              {RANDOM_PROMPTS.map((prompt, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    padding: '10px',
                    margin: '10px',
                    cursor: 'pointer',
                  }}
                  onClick={e => {
                    e.preventDefault();
                    // e.stopPropagation();
                    // handleContentChange(prompt);
                    handleSendMessage();
                  }}
                >
                  {prompt}
                </Paper>
              ))}
            </Box>
            {isSubmitting && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress />
              </Box>
            )}
            {chatLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress />
              </Box>
            )}
            <MessageInput
              disabled={chatLoading || isStreaming || false}
              onSend={handleSendMessage}
              inputContent={userInput}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              onStop={handleStop}
              onRegenerate={handleRegenerateResponse}
              onChange={insertContentAndSync}
              // disabled={chatLoading}
              // onSend={handleSendMessage}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default MainChat;
