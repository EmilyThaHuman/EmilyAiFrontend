/* eslint-disable no-constant-condition */
import { toast } from '@/services/toastService';
import { createParser } from 'eventsource-parser';

import { apiUtils } from '@/lib/apiUtils';

export const chatApi = {
  getStreamCompletion: async function fetchMessageStream({
    sessionId,
    workspaceId,
    regenerate,
    prompt,
    userId,
    clientApiKey,
    role = 'assistant',
    signal,
    count,
    // filePath,
  }) {
    let response;

    try {
      response = await fetch('http://localhost:3001/api/chat/v1/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          sessionId,
          workspaceId,
          regenerate,
          prompt,
          userId,
          clientApiKey,
          role,
          count,
        }),
        signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request aborted:', error.message);
      } else if (error instanceof Error) {
        console.error('Error reading stream data:', error.message);
      } else {
        console.error('An unexpected error occurred');
      }
      return;
    }

    const encoder = new TextEncoder('utf-8');
    const decoder = new TextDecoder('utf-8');

    if (response.statusText !== 'OK') {
      const err = await response.json();
      throw new Error(`Error reading stream data: ${err.error}`);
    }

    if (signal.aborted) {
      console.log('Request aborted');
      return; // Early return if the fetch was aborted
    }

    if (response.status !== 200) {
      const result = await response.text();
      throw new Error(`OpenAI API returned an error: ${result}`);
    }
    // let buffer = '';

    return new ReadableStream({
      async start(controller) {
        const onParse = event => {
          if (event.type === 'event') {
            const data = event.data;
            if (data === '[DONE]') {
              try {
                controller.close();
              } catch (error) {
                console.warn('Stream already closed:', error);
              }
              return;
            }
            // try {
            //   const json = JSON.parse(data);
            //   console.log('Received message:', json);

            //   if (json.content) {
            //     let innerContent;
            //     try {
            //       innerContent = JSON.parse(json.content);
            //     } catch (e) {
            //       innerContent = json.content; // If not JSON, use as-is
            //     }
            //     console.log('Parsed content:', innerContent);

            //     if (innerContent && typeof innerContent === 'string') {
            //       const queue = encoder.encode(innerContent);
            //       controller.enqueue(queue);
            //     } else {
            //       console.warn('Invalid content format:', innerContent);
            //     }
            //   } else {
            //     console.warn('No content in message:', json);
            //     const queue = encoder.encode(JSON.stringify(json));
            //     controller.enqueue(queue);
            //   }
            // } catch (e) {
            //   console.error('Error parsing message:', e);
            //   controller.error(e);
            // }
            try {
              const json = JSON.parse(data);
              const text = json;
              console.log('TEXT: ', text);
              const queue = encoder.encode(JSON.stringify(text));
              // console.log('received queue', queue);
              controller.enqueue(queue);
            } catch (e) {
              controller.error(e);
            }
          }
        };

        const parser = createParser(onParse);
        console.log('Started reading stream');
        for await (const chunk of response.body) {
          parser.feed(decoder.decode(chunk, { stream: true }));
        }
      },
    });
  },
  // **New Method for Streaming Assistant Responses**
  sendMessageStream: async (sessionId, userMessage, onMessageChunk, signal) => {
    const response = await fetch(
      `/api/chat/sessions/${sessionId}/message-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include any necessary authorization headers
        },
        body: JSON.stringify({ message: userMessage }),
        signal, // Attach the abort signal
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;
    let accumulatedMessage = '';

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        accumulatedMessage += chunk;
        if (onMessageChunk) {
          onMessageChunk(chunk);
        }
      }
    }

    return accumulatedMessage;
  },
  getChatSessionMessages: async () => {
    const sessionId = sessionStorage.getItem('sessionId');
    try {
      const data = await apiUtils.get(
        `/chat/sessions/${encodeURIComponent(sessionId)}/messages`
      );
      return data.messages;
    } catch (error) {
      console.error(`Error fetching messages for chat session with id:`, error);
      throw error;
    }
  },
  getChatSessionByChatSessionId: async (workspaceId, sessionId) => {
    try {
      const data = await apiUtils.get(
        `/chat/workspaces/${workspaceId}/chatSessions/${sessionId}`
      );
      console.log('Chat session fetched:', data);
      return data;
    } catch (error) {
      console.error(
        `Error fetching chat session with id ${sessionId} in workspace ${workspaceId}:`,
        error
      );
      throw error;
    }
  },
  getAll: async () => {
    try {
      const data = await apiUtils.get('/chat/sessions/users');
      return data;
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      throw error;
    }
  },
  generateChatTitle: prompt => {
    try {
      const data = apiUtils.post(
        '/chat/sessions/generate-title',
        JSON.stringify({
          prompt,
        })
      );
      return data;
    } catch (error) {
      console.error('Error generating chat title:', error);
      throw error;
    }
  },
  createChatSession: async ({
    title,
    prompt,
    selectedComponent,
    temperature,
    useGPT4,
    sessionId,
    workspaceId,
    regenerate,
    userId,
    clientApiKey,
    newSession,
  }) => {
    try {
      console.log('Creating chat session with data:', {
        title,
        prompt,
        selectedComponent,
        temperature,
        useGPT4,
        sessionId,
        workspaceId,
        regenerate,
        userId,
        clientApiKey,
        newSession,
      });
      const data = await apiUtils.post(
        '/chat/sessions/create-session',
        JSON.stringify({
          title,
          prompt,
          selectedComponent,
          temperature,
          useGPT4,
          sessionId,
          workspaceId,
          regenerate,
          userId,
          clientApiKey,
          newSession,
        })
      );
      return data;
    } catch (error) {
      toast.error('Error creating chat session:', error);
      console.error(`Error fetching chat session with id ${sessionId}:`, error);
      throw error;
    }
  },
  getChatSession: async sessionId => {
    try {
      const data = await apiUtils.get(`/chat/sessions/${sessionId}`);
      return data;
    } catch (error) {
      console.error(`Error fetching chat session with id ${sessionId}:`, error);
      throw error;
    }
  },
  create: async sessionData => {
    try {
      const data = await apiUtils.post('/chat/sessions/create', sessionData);
      return data;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  },
  update: async (sessionId, sessionData) => {
    try {
      const data = await apiUtils.put(
        `/chat/sessions/${sessionId}`,
        sessionData,
        {
          'Content-Type': 'application/json',
        }
      );
      return data;
    } catch (error) {
      console.error(`Error updating chat session with id ${sessionId}:`, error);
      throw error;
    }
  },
  updateMessages: async chatMessages => {
    try {
      const data = await apiUtils.put(
        `/chat/sessions/${encodeURIComponent(sessionStorage.getItem('sessionId'))}/messages`,
        {
          messages: chatMessages,
        },
        {
          'Content-Type': 'application/json',
        }
      );
      return data;
    } catch (error) {
      console.error(
        `Error updating chat session with id ${encodeURIComponent(sessionStorage.getItem('sessionId'))}:`,
        error
      );
      throw error;
    }
  },
  delete: async sessionId => {
    try {
      const data = await apiUtils.delete(`/chat/sessions/${sessionId}`);
      return data;
    } catch (error) {
      console.error(`Error deleting chat session with id ${sessionId}:`, error);
      throw error;
    }
  },
  rename: async (sessionId, name) => {
    try {
      const data = await apiUtils.put(
        `/chat/sessions/session/${sessionId}/topic`,
        { topic: name }
      );
      return data;
    } catch (error) {
      console.error(`Error renaming chat session with id ${sessionId}:`, error);
      throw error;
    }
  },
  saveMessage: async (sessionId, messages) => {
    try {
      const data = await apiUtils.post(
        `/chat/sessions/${sessionId}/messages/save`,
        {
          messages: messages.map(message => ({
            content: message.content,
            role: message.role,
          })),
        },
        {
          'Content-Type': 'application/json',
        }
      );
      return data;
    } catch (error) {
      console.error(
        `Error saving message for chat session with id ${sessionId}:`,
        error
      );
      throw error;
    }
  },
  clearMessages: async sessionId => {
    try {
      const data = await apiUtils.delete(
        `/chat/messages/sessions/${sessionId}`
      );
      return data;
    } catch (error) {
      console.error(
        `Error clearing messages for chat session with id ${sessionId}:`,
        error
      );
      throw error;
    }
  },
};

export default chatApi;
