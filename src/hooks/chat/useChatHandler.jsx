/* eslint-disable no-constant-condition */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useChatStore } from 'contexts';
import { useTipTapEditor } from './useTipTapEditor';

const logError = (message, error) => {
  console.error(`${message}:`, error);
  toast.error(message);
};

export const useChatHandler = () => {
  const controllerRef = useRef(null);

  const {
    state: {
      userInput,
      sessionId,
      workspaceId,
      isRegenerating,
      isStreaming,
      chatMessages,
    },
    actions: { setIsStreaming, setIsRegenerating, setChatMessages },
  } = useChatStore();
  const { insertContentAndSync, clearInput } = useTipTapEditor(userInput);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0); // Initialize message counter
  const [messages, setMessages] = useState(chatMessages);
  const [isMessagesSync, setIsMessagesSync] = useState(true);
  // const [stream, setStream] = useState('');
  // const callback = useCallback(
  //   chunk => setStream(currStream => currStream + chunk),
  //   []
  // );
  const fetchMessageStream = useCallback(async payload => {
    try {
      console.log('Fetching message stream with payload:', payload);
      const response = await fetch('http://localhost:3001/api/chat/v1/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${await response.text()}`);
      }

      return response.body.pipeThrough(new TextDecoderStream()).pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            chunk.split('\n').forEach(line => {
              if (line.startsWith('data: ')) {
                const jsonString = line.slice(6);
                try {
                  const jsonData = JSON.parse(jsonString);
                  if (jsonData.content) {
                    controller.enqueue(jsonData.content);
                  }
                } catch (error) {
                  // console.log('Accumulating data:', jsonString);
                  controller.enqueue(jsonString);
                }
              }
            });
          },
        })
      );
    } catch (error) {
      logError('Error fetching message stream', error);
      throw error;
    }
  }, []);

  const handleSendMessage = useCallback(
    async content => {
      if (!sessionStorage.getItem('userId')) {
        logError('Please login to continue', new Error('User not logged in'));
        return;
      }
      if (!content.trim()) {
        logError('Please enter your message', new Error('Empty message'));
        return;
      }

      setLoading(true);
      setIsStreaming(true);

      insertContentAndSync(content);
      const initialMessages = [
        ...chatMessages,
        { role: 'user', content: content.trim() },
      ];
      setMessages(initialMessages);

      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();

      const payload = {
        sessionId:
          sessionId || sessionStorage.getItem('sessionId') || 'id not provided',
        workspaceId:
          workspaceId ||
          sessionStorage.getItem('workspaceId') ||
          'id not provided',
        prompt: content.trim() || 'No prompt provided',
        userId: sessionStorage.getItem('userId') || 'id not provided',
        clientApiKey: sessionStorage.getItem('apiKey') || 'key not provided',
        role: 'user',
        regenerate: isRegenerating,
        signal: controllerRef.current.signal,
        length: messageCount,
      };

      clearInput();

      try {
        console.log('Sending message with payload:', payload);
        const stream = await fetchMessageStream(payload);
        const reader = stream.getReader();

        let assistantMessage = {
          role: 'assistant',
          content: '',
          isStreaming: true,
        };

        setMessages(prev => [...prev, assistantMessage]);
        let localAccumulatedData = ''; // Local variable for accumulation

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          localAccumulatedData += value; // Accumulate data in the local variable
          // console.log('Accumulated data:', localAccumulatedData);
          try {
            const jsonData = JSON.parse(localAccumulatedData);

            if (jsonData && jsonData.content) {
              setMessages(prev => {
                const updated = [...prev];
                const lastMessage = updated[updated.length - 1];
                lastMessage.content = jsonData.content;
                return updated;
              });
              localAccumulatedData = ''; // Reset localAccumulatedData after successful parse
            }
          } catch (parseError) {
            console.log('Accumulating data:', localAccumulatedData);
          }
          // setMessages(prev => {
          //   const updated = [...prev];
          //   const lastMessage = updated[updated.length - 1];
          //   if (value && typeof value === 'object') {
          //     lastMessage.content = convertToMarkdown(value);
          //   } else {
          //     console.error('Received invalid value:', value);
          //     lastMessage.content = 'Error: Received invalid data';
          //   }
          //   return updated;
          // });
          // setMessages(prev => {
          //   const updated = [...prev];
          //   updated[updated.length - 1].content += value;
          //   return updated;
          // });
        }
        if (localAccumulatedData) {
          try {
            const jsonData = JSON.parse(localAccumulatedData);
            if (jsonData === '[DONE]') {
              setLoading(false);
              return;
            }
            if (jsonData && jsonData.content) {
              setMessages(prev => {
                const updated = [...prev];
                const lastMessage = updated[updated.length - 1];
                lastMessage.content = jsonData.content;
                return updated;
              });
            }
          } catch (parseError) {
            console.error('Error parsing final accumulated data:', parseError);
          }
        }

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].isStreaming = false;
          return updated;
        });
        setIsMessagesSync(false);
        console.log('Message stream completed successfully');
      } catch (error) {
        if (controllerRef.current.signal.aborted) {
          logError('Request aborted', error);
        } else {
          logError('An error occurred while sending the message', error);
        }
      } finally {
        setIsStreaming(false);
        setLoading(false);
        setMessageCount(prev => prev + 1);
      }
    },
    [
      setIsStreaming,
      insertContentAndSync,
      chatMessages,
      sessionId,
      workspaceId,
      isRegenerating,
      messageCount,
      clearInput,
      fetchMessageStream,
    ]
  );
  useEffect(() => {
    if (!isMessagesSync) {
      // setMessages(prevMessages => [...prevMessages, newMessage]);
      setChatMessages(messages);
      setIsMessagesSync(true);
    }
  }, [isMessagesSync, messages, setChatMessages]);

  const handleRegenerateResponse = useCallback(async () => {
    setIsRegenerating(true);
    const lastUserMessage =
      chatMessages[chatMessages.length - 2]?.content || '';
    insertContentAndSync(lastUserMessage);
    await handleSendMessage();
  }, [
    handleSendMessage,
    insertContentAndSync,
    chatMessages,
    setIsRegenerating,
  ]);

  const handleStop = useCallback(() => {
    if (controllerRef.current) controllerRef.current.abort();
    setIsStreaming(false);
  }, [setIsStreaming]);

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  return useMemo(
    () => ({
      messages: chatMessages,
      chatError: error,
      chatLoading: loading,
      chatStreaming: isStreaming,
      messageCount, // Return messageCount to access it outside
      controllerRef,
      clearInput,
      handleSendMessage,
      handleRegenerateResponse,
      handleStop,
    }),
    [
      chatMessages,
      error,
      loading,
      isStreaming,
      messageCount,
      controllerRef,
      clearInput,
      handleSendMessage,
      handleRegenerateResponse,
      handleStop,
    ]
  );
};

export default useChatHandler;
