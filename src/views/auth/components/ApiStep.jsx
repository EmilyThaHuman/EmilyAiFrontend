import { TextField, Box, Typography } from '@mui/material';
import React from 'react';

export const APIStep = ({ profileData, setProfileData }) => {
  const handleInputChange = (key, value) => {
    setProfileData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'black',
          color: 'white',
          p: 4,
          mt: 4,
          mb: 2,
          borderRadius: 2,
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="OpenAI API Key"
          type="password"
          value={profileData.openaiApiKey}
          onChange={e => handleInputChange('openaiApiKey', e.target.value)}
          margin="normal"
        />
      </Box>

      <Box ml={2} mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="OpenAI Organization ID (optional)"
          type="password"
          value={profileData.openaiOrgId}
          onChange={e => handleInputChange('openaiOrgId', e.target.value)}
          margin="normal"
        />
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Anthropic API Key"
        type="password"
        value={profileData.anthropicApiKey}
        onChange={e => handleInputChange('anthropicApiKey', e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Google Gemini API Key"
        type="password"
        value={profileData.googleGeminiApiKey}
        onChange={e => handleInputChange('googleGeminiApiKey', e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Mistral API Key"
        type="password"
        value={profileData.mistralApiKey}
        onChange={e => handleInputChange('mistralApiKey', e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Groq API Key"
        type="password"
        value={profileData.groqApiKey}
        onChange={e => handleInputChange('groqApiKey', e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Perplexity API Key"
        type="password"
        value={profileData.perplexityApiKey}
        onChange={e => handleInputChange('perplexityApiKey', e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        variant="outlined"
        placeholder="OpenRouter API Key"
        type="password"
        value={profileData.openrouterApiKey}
        onChange={e => handleInputChange('openrouterApiKey', e.target.value)}
        margin="normal"
      />

      <Box mt={2}>
        <Typography variant="body2">
          Note: API keys are required to use the respective AI features.
        </Typography>
      </Box>
    </>
  );
};

export default APIStep;
