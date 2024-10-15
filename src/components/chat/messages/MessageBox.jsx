import { Box, Container } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { lazy, Suspense, useMemo } from 'react';

import { useChatStore } from 'contexts/ChatProvider';
import { useMode } from 'hooks/app';

import 'styles/MarkdownBlockStyles.css';
import { UserMessage, AssistantMessage } from './MessagesMemoized';
import { ChatLoader } from '../ChatLoader';

export const MessageBox = React.memo(props => {
  const { theme } = useMode();
  const {
    state: { chatMessages },
  } = useChatStore();
  const messagesStartRef = useMemo(() => React.createRef(), []);
  const messagesEndRef = useMemo(() => React.createRef(), []);
  const groupedMessages = useMemo(() => {
    return chatMessages?.reduce((acc, message, index) => {
      if (index % 2 === 0) {
        acc.push([message, chatMessages[index + 1]].filter(Boolean));
      }
      return acc;
    }, []);
  }, [chatMessages]);

  return (
    <Box
      // onScroll={handleScroll}
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        padding: theme.spacing(2),
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    >
      <div ref={messagesStartRef} />

      <AnimatePresence>
        {groupedMessages.map((group, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: group[0]?.role === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
              width: '100%',
              maxWidth: '100%',
              mx: 'auto',
            }}
          >
            {group.map((message, subIndex) => (
              <>
                <Box
                  key={subIndex}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: { xs: '10px', sm: '15px', md: '20px' },
                    height: '100%',
                    maxWidth: '100%',
                    flexGrow: 1,
                  }}
                >
                  {message.role === 'user' ? (
                    <UserMessage message={message} />
                  ) : (
                    <AssistantMessage message={message} />
                  )}
                </Box>
                {message.isStreaming && <ChatLoader />}
              </>
            ))}
          </Box>
        ))}
      </AnimatePresence>

      <div ref={messagesEndRef} />
      {/* <div ref={messagesStartRef} /> */}
      {/* {chatMessages?.length > 0 ? (
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 3,
            width: '90%',
            maxWidth: '90%',
            mx: 'auto',
          }}
        >
          <Container
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              p: 3,
              width: '90%',
              maxWidth: '90%',
              mx: 'auto',
            }}
          > */}
      {/* </Container> */}
      {/* // </Container> */}
      {/* // ) : (
      //   <></>
      // )} */}
    </Box>
  );
});

MessageBox.displayName = 'MessageBox';

MessageBox.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string,
      role: PropTypes.string,
    })
  ).isRequired,
};

export default MessageBox;
