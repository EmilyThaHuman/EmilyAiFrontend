import { Close } from '@mui/icons-material';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { ChatApiService } from 'api/Ai';
import { useUserStore } from 'contexts/UserProvider';

import MessageCodeBlock from './CodeBlock';

export const MessageMarkdownMemoized = memo(
  function MessageMarkdownMemoized(props) {
    return <ReactMarkdown {...props} />;
  }
);

const StyledBox = styled(Box)(({ theme }) => ({
  '& .prose': {
    minWidth: '100%',
    color: theme.palette.text.primary,
    '& p': {
      marginBottom: theme.spacing(2),
      '&:last-child': {
        marginBottom: 0,
      },
    },
    '& pre': {
      padding: 0,
    },
  },
}));

export const MessageMarkdown = ({ content }) => {
  return (
    <StyledBox>
      <MessageMarkdownMemoized
        className="prose"
        remarkPlugins={[remarkGfm, remarkMath]}
        components={{
          p({ children }) {
            return <Typography paragraph>{children}</Typography>;
          },
          img({ node, ...props }) {
            return <Box component="img" sx={{ maxWidth: '67%' }} {...props} />;
          },
          code({ node, className, children, ...props }) {
            const childArray = React.Children.toArray(children);
            const firstChild = childArray[0];
            const firstChildAsString = React.isValidElement(firstChild)
              ? firstChild.props.children
              : firstChild;

            if (firstChildAsString === '▍') {
              return (
                <Box
                  component="span"
                  sx={{
                    mt: 1,
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    cursor: 'default',
                  }}
                >
                  ▍
                </Box>
              );
            }

            if (typeof firstChildAsString === 'string') {
              childArray[0] = firstChildAsString.replace('`▍`', '▍');
            }

            const match = /language-(\w+)/.exec(className || '');

            if (
              typeof firstChildAsString === 'string' &&
              !firstChildAsString.includes('\n')
            ) {
              return (
                <Typography component="code" className={className} {...props}>
                  {childArray}
                </Typography>
              );
            }

            return (
              <MessageCodeBlock
                key={Math.random()}
                language={(match && match[1]) || ''}
                value={String(childArray).replace(/\n$/, '')}
                {...props}
              />
            );
          },
        }}
      >
        {content}
      </MessageMarkdownMemoized>
    </StyledBox>
  );
};

export const Chat = () => {
  const {
    state: { user },
    actions: { setUserProfile },
  } = useUserStore();
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!userInput.trim()) {
      setError('Please enter a message.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const prompt = userInput;
      const apiKey = user.profile.openai.apiKey;
      if (!apiKey) {
        setError('API key is missing.');
        setIsLoading(false);
        return;
      }
      const apiResponse = await ChatApiService.generateText(prompt, apiKey);
      setResponse(apiResponse);
    } catch (err) {
      setError('Error generating response. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="chat-interface">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2),
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">Test Chat UI</Typography>
            {/* <IconButton onClick={onClose} aria-label="Close Test Chat UI">
              <Close />
            </IconButton> */}
          </Box>
          <Box
            sx={{
              mt: 2,
              mb: 2,
              height: '300px',
              overflowY: 'auto',
              backgroundColor: theme.palette.grey[100],
              padding: theme.spacing(2),
              borderRadius: theme.shape.borderRadius,
            }}
          >
            {userInput && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Prompt Request:
                </Typography>
                <MessageMarkdown content={userInput} />
              </Box>
            )}
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <MessageMarkdown content={response} />
              </motion.div>
            )}
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter your message..."
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                disabled={isLoading}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
                disabled={isLoading}
                startIcon={isLoading && <CircularProgress size={20} />}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </Box>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Chat;
