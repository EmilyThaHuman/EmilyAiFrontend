import { Box, Card, CardActions, CardContent, IconButton } from '@mui/material';
import { EditorContent } from '@tiptap/react';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import {
  useChatHandler,
  useChatHistoryHandler,
  useDialog,
  useMode,
  useTipTapEditor,
} from '@/hooks';
import { SendIcon, StopCircleIcon } from 'assets/humanIcons';
import { DarkIconBox } from 'assets/humanIcons/utils';
import { useChatStore, useUserStore } from 'contexts';

import { FileDisplay, FileUploadButton } from '../files';
import {
  ChatMessageActionsContainer,
  ChatMessageEditorContentsContainer,
} from '../styled';
import { ToolDial } from './ToolDial';

const getTextFromDataUrl = dataUrl => {
  const base64 = dataUrl.split(',')[1];
  return window.atob(base64);
};

function TextFilePreview({ file }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result;
      setContent(typeof text === 'string' ? text.slice(0, 100) : '');
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <div>
      {content}
      {content.length >= 100 && '...'}
    </div>
  );
}
export const MessageInput = React.memo(({ disabled }) => {
  const apiKeyDialog = useDialog();
  const { theme } = useMode();
  const messageInputRef = useRef(null); // Create a ref
  const {
    state: {
      apiKey,
      showFilesDisplay,
      chatFiles,
      messageFiles,
      selectedChatSession,
      chatDisabled,
    },
    actions: { setShowFilesDisplay, setIsSubmitting },
  } = useChatStore();
  const { editor, insertContentAndSync } = useTipTapEditor(
    selectedChatSession?.messages?.length === 0
      ? 'begin session'
      : 'continue session'
  );
  const { handleSendMessage } = useChatHandler();
  const handleSendMessageWrapper = useCallback(async () => {
    if (!sessionStorage.getItem('apiKey') && !apiKey) {
      apiKeyDialog.handleOpen();
      return;
    }

    if (chatDisabled) {
      console.log('Already Sending');
      return;
    }

    const content = editor.getText();
    insertContentAndSync(content);
    editor.commands.clearContent();

    setIsSubmitting(true);
    try {
      await handleSendMessage(content);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    apiKey,
    chatDisabled,
    editor,
    insertContentAndSync,
    setIsSubmitting,
    apiKeyDialog,
    handleSendMessage,
  ]);

  const handleIconButtonClick = useCallback(
    async e => {
      if (!sessionStorage.getItem('apiKey') && !apiKey) {
        console.log('No API Key');
        apiKeyDialog.handleOpen();
      } else if (chatDisabled) {
        console.log('Already Sending');
      } else {
        console.log('Sending');
        setIsSubmitting(true);
        await handleSendMessageWrapper();
      }
    },
    [
      apiKeyDialog,
      apiKey,
      chatDisabled,
      handleSendMessageWrapper,
      setIsSubmitting,
    ]
  );

  return (
    <Box
      ref={messageInputRef} // Attach ref to Card
      sx={{
        backgroundColor: '#26242C',
        borderRadius: 2,
        p: 2,
        position: 'relative',
        width: '100%',
      }}
    >
      <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1, zIndex: 1000 }}>
        <ToolDial containerRef={messageInputRef} />
      </Box>
      <CardActions
        sx={{
          backgroundColor: '#26242C',
          borderTop: '1px solid #444',
          display: 'flex',
          flexDirection: 'column',
          p: 1,
        }}
      >
        {!showFilesDisplay || messageFiles?.length === 0 ? null : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <AnimatePresence>
              {messageFiles && messageFiles?.length > 0 && (
                <div className="flex flex-row gap-2 absolute bottom-12 px-4 w-full md:w-[500px] md:px-0">
                  {Array.from(messageFiles).map(file =>
                    file.type.startsWith('image') ? (
                      <div key={file.name}>
                        <motion.img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="rounded-md w-16"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{
                            y: -10,
                            scale: 1.1,
                            opacity: 0,
                            transition: { duration: 0.2 },
                          }}
                        />
                      </div>
                    ) : file.type.startsWith('text') ? (
                      <motion.div
                        key={file.name}
                        className="text-[8px] leading-1 w-28 h-16 overflow-hidden text-zinc-500 border p-2 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{
                          y: -10,
                          scale: 1.1,
                          opacity: 0,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <TextFilePreview file={file} />
                      </motion.div>
                    ) : null
                  )}
                </div>
              )}
            </AnimatePresence>
          </Box>
        )}
      </CardActions>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '8px',
          paddingBottom: '8px !important',
        }}
      >
        <ChatMessageActionsContainer>
          <ChatMessageEditorContentsContainer>
            <Box
              sx={{
                alignItems: 'center',
                flexGrow: 1,
              }}
            >
              <IconButton
                onClick={() => setShowFilesDisplay(!showFilesDisplay)}
                sx={{
                  p: 2,
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  my: 'auto',
                  py: 'auto',
                }}
                aria-expanded={showFilesDisplay}
                aria-label={showFilesDisplay ? 'Hide files' : 'Show files'}
              >
                {showFilesDisplay && chatFiles.length > 0 ? (
                  <FaChevronLeft />
                ) : (
                  <FaChevronRight />
                )}
              </IconButton>
            </Box>
            <Box
              sx={{
                px: 2,
                alignItems: 'center',
                flexGrow: 1,
              }}
            >
              <FileUploadButton files={chatFiles} />
            </Box>
            <Box
              sx={{
                px: 2,
                flexGrow: 1,
                display: 'flex',
                width: '100%',
                '& > div': {
                  flexGrow: 1,
                },
                '& > div:nth-of-type(1)': {
                  flexGrow: 1,
                },
              }}
            >
              <EditorContent editor={editor} />
            </Box>
            <Box
              sx={{
                px: 2,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <DarkIconBox
                icon={
                  <IconButton onClick={handleIconButtonClick}>
                    {!chatDisabled ? (
                      <SendIcon
                        style={{
                          color: theme.palette.primary.main,
                          fontSize: 20,
                        }}
                      />
                    ) : (
                      <StopCircleIcon
                        style={{
                          color: theme.palette.primary.main,
                          fontSize: 20,
                        }}
                      />
                    )}
                  </IconButton>
                }
              />
            </Box>
          </ChatMessageEditorContentsContainer>
        </ChatMessageActionsContainer>
      </CardContent>
    </Box>
  );
});

MessageInput.displayName = 'MessageInput';

MessageInput.propTypes = {
  disabled: PropTypes.bool,
};

export default MessageInput;
