/* eslint-disable no-case-declarations */
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useRef, useState } from 'react';

import { ChatApiService } from 'api/Ai';
import { useUserStore } from 'contexts/UserProvider';

import { MessageMarkdown } from './MessageMarkdown';
import Dialog from '../../Dialog';

const RESPONSE_TYPES = {
  TEXT: 'TEXT',
  TEXT_STREAM: 'TEXT_STREAM',
  CHAT: 'CHAT',
  CHAT_STREAM: 'CHAT_STREAM',
  RAG: 'RAG',
};

export const Chat = ({ onClose }) => {
  const {
    state: { user },
    actions: { setUserProfile },
  } = useUserStore();
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]); // To store chat history
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false); // State for Dialog
  const [responseType, setResponseType] = useState(RESPONSE_TYPES.TEXT);
  const aiMessageRef = useRef(''); // To keep track of AI message content
  const debounceRef = useRef(null); // For debouncing state updates

  // Handle opening the dialog
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  // Handle closing the dialog
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!userInput.trim()) {
      setError('Please enter a message.');
      return;
    }

    // Add user message to chat history
    const newMessage = { sender: 'user', content: userInput };
    setMessages(prev => [...prev, newMessage]);

    setIsLoading(true);
    setError(null);
    setUserInput('');

    try {
      const apiKey = user.profile.openai.apiKey;
      if (!apiKey) {
        setError('API key is missing.');
        setIsLoading(false);
        return;
      }

      let apiResponse = '';

      switch (responseType) {
        case RESPONSE_TYPES.TEXT:
          // Handle standard text response
          apiResponse = await ChatApiService.generateText(userInput, apiKey);
          setMessages(prev => [
            ...prev,
            { sender: 'ai', content: apiResponse },
          ]);
          break;

        case RESPONSE_TYPES.TEXT_STREAM:
          // Handle streamed text response
          setMessages(prev => [...prev, { sender: 'ai', content: '' }]);
          await ChatApiService.streamTextGeneration(
            userInput,
            apiKey,
            chunk => {
              // Log the chunk for debugging
              console.log('Received chunk:', chunk, typeof chunk);

              let text = '';
              if (typeof chunk === 'string') {
                text = chunk;
              } else if (Array.isArray(chunk)) {
                text = chunk.join('');
              } else if (typeof chunk === 'object') {
                text = Object.values(chunk).join('');
              } else {
                text = String(chunk);
              }

              aiMessageRef.current += text;

              // Debounce the state update to prevent excessive re-renders
              clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => {
                setMessages(prev => {
                  const updated = [...prev];
                  const lastIndex = updated.length - 1;
                  if (
                    updated[lastIndex] &&
                    updated[lastIndex].sender === 'ai'
                  ) {
                    // Create a new object to trigger re-render
                    updated[lastIndex] = {
                      ...updated[lastIndex],
                      content: aiMessageRef.current,
                    };
                  }
                  return updated;
                });
              }, 100); // Adjust the delay as needed
            }
          );
          break;

        case RESPONSE_TYPES.CHAT:
          // Handle standard chat response with context
          const chatMessages = messages
            .filter(msg => msg.sender !== 'ai')
            .map(msg => ({ role: 'user', content: msg.content }));
          chatMessages.push({ role: 'user', content: userInput });
          apiResponse = await ChatApiService.chatCompletion(
            chatMessages,
            apiKey
          );
          setMessages(prev => [
            ...prev,
            { sender: 'ai', content: apiResponse },
          ]);
          break;

        case RESPONSE_TYPES.CHAT_STREAM:
          // Handle streamed chat response with context
          setMessages(prev => [...prev, { sender: 'ai', content: '' }]);
          const chatStreamMessages = messages
            .filter(msg => msg.sender !== 'ai')
            .map(msg => ({ role: 'user', content: msg.content }));
          chatStreamMessages.push({ role: 'user', content: userInput });
          await ChatApiService.streamChatCompletion(
            chatStreamMessages,
            apiKey,
            chunk => {
              // Optionally log each chunk for debugging
              console.log('Received chunk:', chunk);

              aiMessageRef.current += chunk;
              // Debounce the state update to prevent excessive re-renders
              clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => {
                setMessages(prev => {
                  const updated = [...prev];
                  const lastIndex = updated.length - 1;
                  if (
                    updated[lastIndex] &&
                    updated[lastIndex].sender === 'ai'
                  ) {
                    // Create a new object to trigger re-render
                    updated[lastIndex] = {
                      ...updated[lastIndex],
                      content: aiMessageRef.current,
                    };
                  }
                  return updated;
                });
              }, 100); // Adjust the delay as needed
            }
          );
          break;

        case RESPONSE_TYPES.RAG:
          // Handle RAG response
          // Derive the vector based on your application logic
          const vector = 'mocked-vector-data';
          apiResponse = await ChatApiService.ragQuery(
            userInput,
            vector,
            apiKey
          );
          setMessages(prev => [
            ...prev,
            { sender: 'ai', content: apiResponse },
          ]);
          break;

        default:
          throw new Error('Unsupported response type');
      }
    } catch (err) {
      setError('Error generating response. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponseTypeChange = event => {
    setResponseType(event.target.value);
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
            <Typography variant="h6">Advanced Chat UI</Typography>
            <IconButton onClick={onClose} aria-label="Close Test Chat UI">
              <Close />
            </IconButton>
          </Box>

          {/* Dropdown Menu for Response Types */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="response-type-label">Response Type</InputLabel>
              <Select
                labelId="response-type-label"
                value={responseType}
                onChange={handleResponseTypeChange}
                label="Response Type"
              >
                {Object.values(RESPONSE_TYPES).map(type => (
                  <MenuItem key={type} value={type}>
                    {type.replace('_', ' ').toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Message Display Area */}
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
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      textAlign: msg.sender === 'user' ? 'right' : 'left',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color={msg.sender === 'user' ? 'primary' : 'secondary'}
                    >
                      {msg.sender === 'user' ? 'You' : 'AI'}
                    </Typography>
                    <MessageMarkdown content={msg.content} />
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading &&
              (responseType.endsWith('STREAM') ||
                responseType === RESPONSE_TYPES.RAG) && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Generating response...
                  </Typography>
                </Box>
              )}
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>

          {/* Input Form */}
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

      {/* Settings Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>
        {/* Settings Content */}
        <Box>
          <Typography variant="body1" gutterBottom>
            Configure your chat settings below:
          </Typography>
          {/* Example Setting: Toggle Dark Mode */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Enable Dark Mode
            </Typography>
            <Button variant="contained" color="secondary">
              Toggle
            </Button>
          </Box>
          {/* Add more settings as needed */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleDialogClose}
          >
            Save Changes
          </Button>
        </Box>
      </Dialog>
    </div>
  );
};

export default Chat;
