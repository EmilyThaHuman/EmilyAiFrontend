import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import MessageContent from './MessageContent'; // Ensure this component is compatible with MUI

/**
 * MessageList Component
 *
 * @param {Object} props
 * @param {Array} props.messages - Array of message objects
 * @param {boolean} [props.isLoading] - Indicates if a message is being loaded
 * @param {string} [props.streamingMessageId] - ID of the message currently streaming
 */
export function MessageList({ messages, isLoading, streamingMessageId }) {
  return (
    <motion.div
      initial={false}
      // You can add animation variants here if needed
      style={{
        maxWidth: '48rem',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {messages.map((message, index) => (
        <Box
          key={message.id || index}
          display="flex"
          justifyContent={message.role === 'user' ? 'flex-end' : 'flex-start'}
          width="100%"
        >
          <MessageContent
            message={message}
            isStreaming={streamingMessageId === message.id}
          />
        </Box>
      ))}

      {isLoading && (
        <Box display="flex" justifyContent="flex-start">
          <Box
            sx={{
              maxWidth: '80%',
              borderRadius: 1,
              px: 2,
              py: 1,
              backgroundColor: 'grey.200',
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              // Dark mode support
              '@media (prefers-color-scheme: dark)': {
                backgroundColor: 'grey.800',
              },
            }}
          >
            <CircularProgress size={20} />
            <Typography variant="body2" color="textSecondary">
              Typing...
            </Typography>
          </Box>
        </Box>
      )}
    </motion.div>
  );
}

export default MessageList;
