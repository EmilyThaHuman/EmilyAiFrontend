// src/components/TestChatUI.jsx
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
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { generatePrompt } from 'api/Ai/chat-hosted/openai';

export const TestChatUI = ({ promptTemplate, initialPrompt, onClose }) => {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!userInput.trim()) {
      setError('Please enter a message.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const prompt = promptTemplate.replace('{userInput}', userInput);
      const apiKey = localStorage.getItem('openai_api_key'); // Assuming you store API key in localStorage
      if (!apiKey) {
        setError('API key is missing.');
        setIsLoading(false);
        return;
      }
      const apiResponse = await generatePrompt(prompt, apiKey);
      setResponse(apiResponse);
    } catch (err) {
      setError('Error generating response. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          <IconButton onClick={onClose} aria-label="Close Test Chat UI">
            <Close />
          </IconButton>
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
          {initialPrompt && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Prompt Request:
              </Typography>
              <ReactMarkdown>{initialPrompt}</ReactMarkdown>
            </Box>
          )}
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ReactMarkdown>{response}</ReactMarkdown>
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
  );
};

export default TestChatUI;
