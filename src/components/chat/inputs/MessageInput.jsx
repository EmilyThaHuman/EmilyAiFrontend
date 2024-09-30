import { Box, Card, CardActions, CardContent, IconButton } from '@mui/material';
import { EditorContent } from '@tiptap/react';
import PropTypes from 'prop-types';
import React, { useCallback, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SendIcon, StopCircleIcon } from 'assets/humanIcons';
import { DarkIconBox } from 'assets/humanIcons/utils';
import { useChatStore } from 'contexts';
import {
  useChatHandler,
  useChatHistoryHandler,
  useDialog,
  useMode,
  useTipTapEditor,
} from 'hooks';
import { FileDisplay, FileUploadButton } from '../files';
import {
  ChatMessageActionsContainer,
  ChatMessageEditorContentsContainer,
} from '../styled';
import { ToolDial } from './ToolDial';

export const MessageInput = React.memo(
  ({
    disabled,
    isSubmitting,
    setIsSubmitting,
    inputContent,
    onSend,
    onRegenerate,
    onChange,
    onStop,
  }) => {
    const apiKeyDialog = useDialog();
    const chatStore = useChatStore();
    const { theme } = useMode();
    const messageInputRef = useRef(null); // Create a ref
    const {
      state: { showFilesDisplay, isFirstMessage, chatFiles, chatMessages },
      actions: { setShowFilesDisplay, setChatMessages },
    } = chatStore;
    const {
      setNewMessageContentToNextUserMessage,
      setNewMessageContentToPreviousUserMessage,
    } = useChatHistoryHandler();
    const { editor, insertContentAndSync } = useTipTapEditor(
      isFirstMessage ? 'begin session' : 'continue session'
    );
    const { handleSendMessage } = useChatHandler();
    const handleSendMessageWrapper = useCallback(async () => {
      if (!sessionStorage.getItem('apiKey')) {
        apiKeyDialog.handleOpen();
        return;
      }

      if (disabled) {
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
    }, [disabled, editor, setIsSubmitting, apiKeyDialog, handleSendMessage]);

    const handleIconButtonClick = useCallback(
      async e => {
        if (!sessionStorage.getItem('apiKey')) {
          console.log('No API Key');
          apiKeyDialog.handleOpen();
        } else if (disabled) {
          console.log('Already Sending');
        } else {
          console.log('Sending');
          setIsSubmitting(true);
          await handleSendMessageWrapper();
        }
      },
      [apiKeyDialog, disabled, handleSendMessageWrapper, setIsSubmitting]
    );

    return (
      <Card
        ref={messageInputRef} // Attach ref to Card
        sx={{
          backgroundColor: '#26242C',
          borderRadius: 2,
          mt: 2,
          mb: 2,
        }}
      >
        {/* <CardActions> */}
        <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1, zIndex: 1000 }}>
          <ToolDial containerRef={messageInputRef} />{' '}
          {/* Pass ref to ToolDial */}
        </Box>
        {/* </CardActions> */}
        <CardActions
          sx={{
            backgroundColor: '#26242C',
            borderTop: '1px solid #444',
            display: 'flex',
            flexDirection: 'column',
            p: 1,
          }}
        >
          {!showFilesDisplay || chatFiles?.length === 0 ? null : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <FileDisplay files={chatFiles} hidden={!showFilesDisplay} />
            </Box>
          )}
          {/* <ChatMessageActionsContainer>
            <ToolDial />
          </ChatMessageActionsContainer> */}
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
                      {!disabled ? (
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
      </Card>
    );
  }
);

MessageInput.displayName = 'MessageInput';

MessageInput.propTypes = {
  disabled: PropTypes.bool.isRequired,
  editorRef: PropTypes.object,
  onSend: PropTypes.func.isRequired,
  onChange: PropTypes.func,
};

export default MessageInput;