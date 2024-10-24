import { Box } from '@mui/material';
import React from 'react';

import { StyledButton } from 'components/chat/styled';
import { TextFieldSection } from 'components/themed';
import { useChatStore } from 'contexts/ChatProvider';
export const SessionSettings = () => {
  const {
    state: { apiKey },
    actions: { setApiKey },
  } = useChatStore();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '1rem',
      }}
    >
      <TextFieldSection
        label="API Key"
        placeholder="API Key"
        value={apiKey}
        onChange={setApiKey}
        variant="darkMode"
        fullWidth
      />
      <StyledButton variant="outlined">Save Settings</StyledButton>
    </Box>
  );
};

export default SessionSettings;
