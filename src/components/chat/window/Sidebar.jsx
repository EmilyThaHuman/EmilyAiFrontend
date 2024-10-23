import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Button,
  IconButton,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import React from 'react';

import { useChat } from '@/contexts/ChatContext';
import { useChats } from '@/hooks/useChats';

export default function Sidebar({ onClose }) {
  const { chats, isLoadingChats } = useChats();
  const { currentChat, setCurrentChat } = useChat();

  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: '#212121',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* New Chat Button */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
          sx={{
            justifyContent: 'flex-start',
            backgroundColor: '#424242',
            '&:hover': { backgroundColor: '#616161' },
          }}
          onClick={() => {
            // Handle new chat
            onClose();
          }}
        >
          New Chat
        </Button>
      </Box>

      {/* Chat List (Scrollable Area) */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
        <List>
          {isLoadingChats ? (
            <Typography sx={{ textAlign: 'center', py: 4, color: 'gray' }}>
              Loading chats...
            </Typography>
          ) : (
            chats?.map(chat => (
              <ListItem
                key={chat.id}
                button
                onClick={() => {
                  setCurrentChat(chat);
                  onClose();
                }}
                sx={{
                  backgroundColor:
                    currentChat?.id === chat.id ? '#424242' : 'transparent',
                  '&:hover': { backgroundColor: '#616161' },
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={chat.title}
                  secondary={format(new Date(chat.updatedAt), 'MMM d, yyyy')}
                  primaryTypographyProps={{ noWrap: true }}
                  secondaryTypographyProps={{
                    sx: { color: 'gray', fontSize: '0.75rem' },
                  }}
                />
              </ListItem>
            ))
          )}
        </List>
      </Box>

      {/* Settings Button */}
      <Divider sx={{ backgroundColor: '#424242' }} />
      <Box sx={{ p: 2 }}>
        <Button
          variant="text"
          fullWidth
          startIcon={<SettingsIcon />}
          sx={{
            justifyContent: 'flex-start',
            color: '#b0bec5',
            '&:hover': { backgroundColor: '#616161' },
          }}
        >
          Settings
        </Button>
      </Box>
    </Box>
  );
}
