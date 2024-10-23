import { Box, Typography, Chip, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

import CodePreview from './CodePreview'; // Ensure this component is compatible with MUI
import FilePreview from './FilePreview'; // Ensure this component is compatible with MUI

/**
 * MessageContent Component
 *
 * @param {Object} props
 * @param {Object} props.message - The message object containing content, role, and files.
 * @param {boolean} [props.isStreaming] - Indicates if the message is currently streaming.
 */
export function MessageContent({ message, isStreaming }) {
  const theme = useTheme();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{
          maxWidth: '80%',
          borderRadius: theme.shape.borderRadius * 2, // Rounded-lg equivalent
          padding: theme.spacing(1, 2), // px-4 py-2
          backgroundColor:
            message.role === 'user'
              ? theme.palette.grey[800]
              : theme.palette.grey[900],
          color: theme.palette.common.white,
          border:
            message.role !== 'user'
              ? `1px solid ${theme.palette.grey[700]}`
              : 'none',
          margin: theme.spacing(1, 0),
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : 'typescript';
              const codeString = String(children).replace(/\n$/, '');

              if (!inline) {
                return (
                  <Box sx={{ my: 2 }}>
                    <SyntaxHighlighter
                      language={language}
                      style={oneDark}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        borderRadius: theme.shape.borderRadius,
                        background: '#1a1b26',
                        padding: theme.spacing(2),
                        fontSize: '0.875rem',
                      }}
                      {...props}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                    <CodePreview code={codeString} language={language} />
                  </Box>
                );
              } else {
                return (
                  <Box
                    component="code"
                    sx={{
                      backgroundColor: theme.palette.grey[800],
                      padding: '0.25rem 0.5rem',
                      borderRadius: theme.shape.borderRadius,
                      fontFamily: 'Monospace',
                      fontSize: '0.875rem',
                    }}
                    {...props}
                  >
                    {children}
                  </Box>
                );
              }
            },
          }}
        >
          {message.content}
        </ReactMarkdown>

        {isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
            style={{ display: 'inline-block', marginLeft: theme.spacing(0.5) }}
          >
            ▊
          </motion.div>
        )}

        {message.files && message.files.length > 0 && (
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            {message.files.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                onRemove={() => {}} // Read-only in chat
              />
            ))}
          </Box>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default MessageContent;
