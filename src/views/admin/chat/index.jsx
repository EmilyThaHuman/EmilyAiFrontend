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

      const messagesHaveChanged = !areMessagesEqual(
        selectedChatSession.messages,
        transformedMessages
      );

      if (messagesHaveChanged) {
        setSelectedChatSession({
          ...selectedChatSession,
          messages: transformedMessages,
        });
      }
    } else if (workspace) {
      navigate(
        `/admin/workspaces/${workspace._id}/chat/${sessionStorage.getItem('sessionId')}`
      );
    }
  }, [selectedChatSession, workspace, navigate, setSelectedChatSession]);

  const areMessagesEqual = (messages1, messages2) => {
    if (messages1.length !== messages2.length) return false;

    for (let i = 0; i < messages1.length; i++) {
      if (messages1[i]._id !== messages2[i]._id) return false;
    }

    return true;
  };

  // useEffect(() => {
  //   if (workspace) {
  //     /* --- [WORKSPACE LOADER] Sets initial workspace data --- */
  //     const { chatSessions, assistants, prompts, tools } = workspace;
  //     setWorkspaceId(workspace._id);
  //     setSelectedWorkspace(workspace);
  //     setFolders(workspace.folders);
  //     setHomeWorkSpace(workspace);
  //     setChatSessions(chatSessions);
  //     if (chatSessions.length > 0) {
  //       setSessionId(chatSessions[0]._id);
  //       setSelectedChatSession(chatSessions[0]);
  //       // setFolders(chatSessions[0].folders);
  //     }
  //     setAssistants(assistants);
  //     setPrompts(prompts);
  //     setTools(tools);

  //     /* --- [CHATSESSION LOADER] Handles chatMessages --- */
  //     if (!selectedChatSession) {
  //       navigate(
  //         `/admin/workspaces/${workspace._id}/chat/${sessionStorage.getItem('sessionId')}`
  //       );
  //       return; // Exit early to prevent further execution
  //     }

  //     if (selectedChatSession) {
  //       console.log('chatSession', selectedChatSession);
  //       console.log(
  //         'chatSession messages',
  //         JSON.stringify(selectedChatSession.messages)
  //       );

  //       // Function to transform messages
  //       const transformMessages = messages => {
  //         return messages.map(message => {
  //           if (typeof message === 'string') {
  //             // If message is a string, convert it to an object with a unique _id
  //             return {
  //               _id: uuidv4(),
  //               content: '', // Assuming 'content' is a field; adjust as necessary
  //               role: '', // Add other necessary fields with empty strings
  //               isUserMessage: false,
  //               // ... add other fields as needed
  //             };
  //           } else if (typeof message === 'object' && message !== null) {
  //             // If message is an object, retain _id and set other fields to empty strings
  //             return {
  //               _id: message._id || uuidv4(), // Use existing _id or generate a new one
  //               content: '',
  //               role: '',
  //               isUserMessage: false,
  //               // ... reset other fields as needed
  //             };
  //           } else {
  //             // Handle unexpected message types if necessary
  //             return {
  //               _id: uuidv4(),
  //               content: '',
  //               role: '',
  //               isUserMessage: false,
  //               // ... add other fields as needed
  //             };
  //           }
  //         });
  //       };

  //       // Transform the messages
  //       const transformedMessages = transformMessages(
  //         selectedChatSession.messages || []
  //       );

  //       // Update the selected chat session with transformed messages
  //       setSelectedChatSession({
  //         ...selectedChatSession,
  //         messages: transformedMessages,
  //       });

  //       // If you have a separate setChatMessages function, set it here as well
  //       // setChatMessages(transformedMessages);
  //     }
  //   }
  // }, [
  //   workspace,
  //   setWorkspaceId,
  //   setSelectedWorkspace,
  //   setChatSessions,
  //   setAssistants,
  //   setPrompts,
  //   setTools,
  //   setSessionId,
  //   setFolders,
  //   setSelectedChatSession,
  //   selectedChatSession,
  //   navigate,
  //   setHomeWorkSpace,
  // ]);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [marginLeft, setMarginLeft] = useState(isMobile ? '0px' : '50px');

  useEffect(() => {
    setMarginLeft(isMobile ? '0px' : '50px');
  }, [isMobile, isSidebarOpen]);

  const promptsMenu = useMenu();
  const dialogRef = useRef(null);
  const sidebarItemRef = useRef(null);

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
        height: '100%', // Fill the available height
        transition: 'width 0.3s ease-in-out',
      }}
    >
      <Paper
        theme={theme}
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          my: 'auto',
          ml: 'auto',
          borderRadius: '14px',
          overflow: 'hidden',
        }}
      >
        <Box
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
            boxSizing: 'border-box',
          }}
        >
    // <Box
    //   id="chat-view-container"
    //   sx={{
    //     marginLeft: marginLeft, // Use the marginLeft state variable
    //     display: 'flex',
    //     // marginTop: '-30px',
    //     flexDirection: 'column',
    //     maxWidth: !isMobile ? 'calc(100% - 24px)' : null,
    //     maxHeight: '100vh',
    //     height: '100vh',
    //     flexGrow: 1,
    //     // height: '100vh', // Ensure it fills the viewport height
    //     transition: 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out', // Smooth transition
    //   }}
    // >
    //   <Box
    //     id="chat-header-container"
    //     sx={{
    //       display: 'flex',
    //       flexDirection: 'column',
    //       // height: '100vh',
    //       width: '100%', // Ensure width is 100%
    //     }}
    //   >
    //     <Paper
    //       theme={theme}
    //       elevation={3}
    //       sx={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //         height: 'calc(100vh - 8px)',
    //         width: `calc(100% - 20px)`,
    //         my: 'auto',
    //         ml: 'auto',
    //         [theme.breakpoints.down('sm')]: {
    //           height: '100vh',
    //           width: '100%',
    //         },
    //       }}
    //     >
    //       <Box
    //         theme={theme}
    //         ref={chatContainerRef}
    //         component={Grid}
    //         item
    //         xs={12}
    //         sx={{
    //           display: 'flex',
    //           flexDirection: 'column',
    //           backgroundColor: '#1C1C1C',
    //           width: '100%',
    //           height: '100%',
    //           borderRadius: '14px',
    //           overflow: 'auto', // Allow scrolling
    //           flexGrow: 1,
    //           boxSizing: 'border-box',
    //           // overflow: 'hidden', // Prevent entire container from scrolling
    //         }}
    //       >
            <ChatHeader />
            <Box sx={{ textAlign: 'center', margin: '20px' }}>
              <h3>No messages yet, try one of these prompts:</h3>
              {limitedPrompts.map((prompt, index) => (
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
              <MessageBox />
              {chatLoading && (
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
                isSubmitting={chatLoading}
                setIsSubmitting={setChatLoading}
                onStop={handleStop}
                onRegenerate={handleRegenerateResponse}
                onChange={insertContentAndSync}
                // disabled={chatLoading}
                // onSend={handleSendMessage}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
  );
};

export default MainChat;
