import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import { StyledButton } from 'components/chat/styled';
import PromptForm from './prompt-form';

export const AddPrompt = ({ onSave }) => {
  const [promptData, setPromptData] = useState({
    name: '',
    content: '',
    role: '',
    description: '',
  });

  const handleSave = () => {
    onSave(promptData);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '1rem',
      }}
    >
      <PromptForm promptData={promptData} setPromptData={setPromptData} />
      <StyledButton
        variant="outlined"
        onClick={handleSave}
        sx={{ mt: 2, marginRight: '10px' }}
      >
        Save Prompt
      </StyledButton>
    </Box>
  );
};

export default AddPrompt;
