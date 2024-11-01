import { Box, Typography, Button } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { OpenAISVG } from 'assets/humanIcons';
import { useMode } from 'hooks/app';

/**
 * Renders the default authentication page for ReedAi LLM.
 * This component displays a logo, title, and a button to start chatting.
 * It also clears local and session storage, and sets up a data population checklist.
 * @returns {JSX.Element} A React component representing the default authentication page.
 */
export const AuthDefault = () => {
  const { theme } = useMode();
  localStorage.clear();
  sessionStorage.clear();
  sessionStorage.setItem(
    'dataPopulationChecklist',
    JSON.stringify({
      user: 'false',
      workspaces: 'false',
      chatSessions: 'false',
      folders: 'false',
      prompts: 'false',
      assistants: 'false',
      tools: 'false',
    })
  );

  return (
    <Box
      display="flex"
      height="100vh"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box>
        <OpenAISVG theme={theme === 'dark' ? 'dark' : 'light'} scale={0.3} />
      </Box>

      <Typography variant="h4" fontWeight="bold" marginTop={2}>
        ReedAi LLM
      </Typography>

      {/* <NavLink href="/login" passHref> */}
      <NavLink to="/auth/sign-in">
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            mt: 2,
            width: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Start Chatting
          <ArrowRight style={{ marginLeft: '8px' }} size={20} />
        </Button>
      </NavLink>
    </Box>
  );
};

export default AuthDefault;
