import { Box, Portal, useMediaQuery } from '@mui/material';
import { Outlet, useParams } from 'react-router-dom';
import { ChatSidebar } from 'components/chat/sidebar';

// =========================================================
// [ChatLayout] | This code provides the chat layout for the app
// =========================================================
export const ChatLayout = props => {
  const { workspaceId, sessionId } = useParams();

  return (
    <Box
      id="chat-layout-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        height: '100vh',
        width: '100%',
        minWidth: '100vw',
        // overflow: 'hidden',
      }}
    >
      <>
        <Portal>
          <ChatSidebar workspaceId={workspaceId} />
        </Portal>

        <Outlet context={{ workspaceId, sessionId }} />
      </>
    </Box>
  );
};

export default ChatLayout;
