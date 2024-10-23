// src/components/BasePromptGenerator.jsx
import { Refresh, Clear, PlayArrow } from '@mui/icons-material';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  CircularProgress,
  useTheme,
  Grow,
} from '@mui/material';
import React, { useState } from 'react';

import { generatePrompt } from 'api/Ai/chat-hosted/openai';
import { useUserStore } from 'contexts/UserProvider';

import GenerateButton from './GenerateButton';
import SystemInstructions from './SystemInstructions';

// ApiKeyInput.jsx
export const ApiKeyInput = ({ onSubmit }) => {
  const [apiKeyInput, setApiKeyInput] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(apiKeyInput);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Set OpenAI API Key
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: 2 }}
      >
        <TextField
          label="API Key"
          variant="outlined"
          fullWidth
          value={apiKeyInput}
          onChange={e => setApiKeyInput(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Paper>
  );
};

export const BasePromptGenerator = ({
  promptTemplate,
  generatorTitle,
  onTest,
}) => {
  const {
    state: { user, isAuthenticated },
  } = useUserStore();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [userInput, setUserInput] = React.useState('');
  const [generatedInstructions, setGeneratedInstructions] = React.useState('');
  const [apiKey, setApiKey] = React.useState(user.profile.openai.apiKey || '');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [animateComponents, setAnimateComponents] = React.useState(false);
  const theme = useTheme();

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Please set your OpenAI API key first.');
      return;
    }
    if (!userInput.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setIsExpanded(true);
    setAnimateComponents(true);
    try {
      const prompt = promptTemplate.replace('{userInput}', userInput);
      const instructions = await generatePrompt(prompt, apiKey);
      setGeneratedInstructions(instructions);
    } catch (err) {
      setError('Error generating instructions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUserInput('');
    setGeneratedInstructions('');
    setIsExpanded(false);
    setError(null);
    setAnimateComponents(false);
  };

  const handleRegenerate = async () => {
    if (userInput) {
      await handleGenerate();
    }
  };

  const handleSetApiKey = key => {
    setApiKey(key);
    setError(null);
  };

  const handleTest = () => {
    if (onTest) {
      onTest(promptTemplate, userInput, generatedInstructions);
    }
  };

  return (
    <Box
      component={Grow}
      in
      timeout={500}
      sx={{
        maxWidth: '800px',
        margin: 'auto',
        mt: theme.spacing(4),
        position: 'relative',
      }}
    >
      <Typography variant="h5" gutterBottom>
        {generatorTitle}
      </Typography>
      <ApiKeyInput onSubmit={handleSetApiKey} />
      {error && (
        <Typography color="error" sx={{ mb: theme.spacing(2) }}>
          {error}
        </Typography>
      )}
      {generatedInstructions && (
        <Box
          sx={{
            mb: theme.spacing(2),
            display: 'flex',
            justifyContent: 'flex-end',
            gap: theme.spacing(1),
          }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<Clear />}
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Refresh />}
            onClick={handleRegenerate}
          >
            Regenerate
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<PlayArrow />}
            onClick={handleTest}
          >
            Test
          </Button>
        </Box>
      )}
      {/* Animated Container */}
      <Grow in={animateComponents} timeout={500}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
          }}
        >
          <SystemInstructions instructions={generatedInstructions} />
          <Paper
            elevation={3}
            sx={{ p: theme.spacing(2), display: 'flex', alignItems: 'center' }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your prompt..."
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              sx={{ mr: theme.spacing(2) }}
            />
            <GenerateButton
              onClick={handleGenerate}
              isLoading={isLoading}
              text={isLoading ? 'Generating...' : 'Generate'}
            />
          </Paper>
        </Box>
      </Grow>
    </Box>
  );
};

export default BasePromptGenerator;
