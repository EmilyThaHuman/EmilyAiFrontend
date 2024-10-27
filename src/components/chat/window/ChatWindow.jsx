import { Box, Card, Typography } from '@mui/material';
import React, { useState } from 'react';

import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageList from './MessageList';

import { useChat } from '@/contexts/ChatContext';
import { useChats } from '@/hooks/useChats';

// Define the code prompt options
const codePromptOptions = [
  {
    title: 'Explain Code',
    description: 'Get a detailed explanation of your code',
    prompt:
      'Please explain this code in detail:\n```\n// Paste your code here\n```',
  },
  {
    title: 'Debug Code',
    description: 'Find and fix issues in your code',
    prompt:
      'Please help me debug this code and identify potential issues:\n```\n// Paste your code here\n```',
  },
  {
    title: 'Optimize Code',
    description: 'Get suggestions for code optimization',
    prompt:
      'Please suggest optimizations for this code:\n```\n// Paste your code here\n```',
  },
  {
    title: 'Convert Code',
    description: 'Convert code between languages',
    prompt:
      'Please convert this code from [source language] to [target language]:\n```\n// Paste your code here\n```',
  },
];

export default function ChatWindow() {
  const { currentChat } = useChat();
  const { addNewMessage } = useChats();
  const [streamingMessageId, setStreamingMessageId] = useState();

  // Handle message submission
  const handleSubmit = async (content, files) => {
    if (!currentChat) return;

    // Create and add user message
    const messageId = crypto.randomUUID();
    const userMessage = {
      id: messageId,
      role: 'user',
      content,
      files: files.length > 0 ? [...files] : undefined,
    };
    addNewMessage({ chatId: currentChat.id, message: userMessage });

    // Create and add initial assistant message
    const responseId = crypto.randomUUID();
    const initialResponse = {
      id: responseId,
      role: 'assistant',
      content: '',
    };
    addNewMessage({ chatId: currentChat.id, message: initialResponse });
    setStreamingMessageId(responseId);

    // Simulate streaming response
    const response =
      "This is a simulated response. The OpenAI API integration will be implemented here.\n\n```typescript\nconst example = () => {\n  console.log('Hello, World!');\n};\n```";
    let streamedContent = '';

    for (let i = 0; i < response.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      streamedContent += response[i];
      addNewMessage({
        chatId: currentChat.id,
        message: { ...initialResponse, content: streamedContent },
      });
    }

    setStreamingMessageId(undefined);
  };

  // Handle prompt selection from codePromptOptions
  const handlePromptSelect = prompt => {
    handleSubmit(prompt, []);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'black',
        color: 'white',
      }}
    >
      {/* Chat Header */}
      <ChatHeader
        title={currentChat?.title || 'New Chat'}
        onTitleChange={newTitle => {
          console.log('Title changed:', newTitle);
        }}
      />

      {/* Scrollable Area */}
      <Box sx={{ flex: 1, p: 4, overflowY: 'auto' }}>
        {!currentChat?.messages.length ? (
          // Display code prompt options when no messages are present
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                maxWidth: '56rem', // Equivalent to max-w-4xl in Tailwind
                width: '100%',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2, // Equivalent to gap-4 (16px)
                p: 4,
              }}
            >
              {codePromptOptions.map((option, index) => (
                <Card
                  key={index}
                  onClick={() => handlePromptSelect(option.prompt)}
                  sx={{
                    p: 2, // Equivalent to p-4 (16px)
                    cursor: 'pointer',
                    backgroundColor: '#2D3748', // Tailwind's bg-gray-800
                    color: 'white',
                    border: '1px solid #4A5568', // Tailwind's border-gray-700
                    '&:hover': {
                      backgroundColor: '#1A202C', // Tailwind's bg-gray-900
                    },
                    transition: 'background-color 0.3s',
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>
        ) : (
          // Display the list of messages when available
          <MessageList
            messages={currentChat.messages}
            streamingMessageId={streamingMessageId}
          />
        )}
      </Box>

      {/* Chat Input */}
      <ChatInput onSubmit={handleSubmit} />
    </Box>
  );
}
