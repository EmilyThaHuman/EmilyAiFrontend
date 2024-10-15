/* eslint-disable no-constant-condition */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

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
    actions: {
      setIsStreaming,
      setIsRegenerating,
      setChatMessages,
      setChatMessage,
    },
  } = useChatStore();
  const { insertContentAndSync, clearInput } = useTipTapEditor(userInput);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0); // Initialize message counter
  // const [messages, setMessages] = useState(chatMessages);
  const [isMessagesSync, setIsMessagesSync] = useState(true);

  // Synchronize local messages with the store
  useEffect(() => {
    if (!isMessagesSync) {
      // setChatMessages(chatMessages);
      setIsMessagesSync(true);
    }
  }, [isMessagesSync]);
  const handleSendMessage = useCallback(
    async (content, isNewSession = false) => {
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
      const userMessage = {
        _id: uuidv4(),
        role: 'user',
        content: content.trim(),
      };

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
        newSession: isNewSession,
      };

      clearInput();

      try {
        console.log('Sending message with payload:', payload);
        const response = await fetch(
          'http://localhost:3001/api/chat/v1/stream',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.body) {
          throw new Error('ReadableStream not supported in this browser.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        // Helper to extract markdown blocks
        const extractMarkdownBlocks = text => {
          const markdownPattern =
            /(?:#+\s.*|[*_-]{3,}|```[\s\S]+```|>.*|\*\*[^*]+\*\*)/gm;
          let matches = [];
          let match;
          while ((match = markdownPattern.exec(text)) !== null) {
            matches.push(match[0]);
          }
          return matches;
        };

        // Initialize new message in the chat
        const newMessage = {
          _id: 'streaming',
          role: 'assistant',
          content: '',
          isStreaming: true,
          isComplete: false,
        };

        // Set initial message with streaming indicator
        setChatMessage(newMessage);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          let boundary = buffer.indexOf('\n\n');
          while (boundary !== -1) {
            const chunk = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);

            if (chunk.startsWith('data:')) {
              const jsonStr = chunk.replace(/^data:\s*/, '');
              if (jsonStr === '[DONE]') {
                // Mark message as complete when the stream ends

                setChatMessage({
                  _id: 'streaming',
                  content: '',
                  isComplete: true,
                  role: 'assistant',
                });
                return;
              }

              try {
                const data = JSON.parse(jsonStr);

                if (data.type === 'message') {
                  const content = data.content;
                  const markdownBlocks = extractMarkdownBlocks(content);

                  // If markdown blocks are found, update the message content
                  if (markdownBlocks.length > 0) {
                    setChatMessage({
                      _id: 'streaming',
                      content: markdownBlocks.join('\n\n'),
                      isComplete: false,
                      role: 'assistant',
                    });
                  }
                } else if (data.type === 'function_call') {
                  // Handle function calls if needed
                } else if (data.type === 'usage') {
                  // Optionally handle usage data
                  console.log('Usage:', data.usage);
                }
              } catch (err) {
                console.error('Error parsing JSON:', err);
              }
            }

            boundary = buffer.indexOf('\n\n');
          }
        }

        // Final update to mark the message as completed

        setChatMessage({
          _id: 'streaming',
          content: '',
          isComplete: true,
          role: 'assistant',
        });

        setIsMessagesSync(false);
      } catch (error) {
        if (controllerRef.current.signal.aborted) {
          logError('Request aborted', error);
        } else {
          logError('An error occurred while sending the message', error);
          const errorMessage = {
            id: uuidv4(),
            sender: 'assistant',
            content: 'An error occurred while generating the response.',
            timestamp: new Date(),
          };
          setChatMessage(errorMessage);
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
      sessionId,
      workspaceId,
      isRegenerating,
      messageCount,
      clearInput,
      setChatMessage,
    ]
  );

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
      error,
      loading,
      isStreaming,
      messageCount,
      clearInput,
      handleSendMessage,
      handleRegenerateResponse,
      handleStop,
    ]
  );
};

export default useChatHandler;

// const [stream, setStream] = useState('');
// const callback = useCallback(
//   chunk => setStream(currStream => currStream + chunk),
//   []
// );

// const fetchMessageStream = useCallback(async payload => {
//   try {
//     console.log('Fetching message stream with payload:', payload);
// const response = await fetch('http://localhost:3001/api/chat/v1/stream', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
//   },
//   body: JSON.stringify(payload),
// });

// if (!response.ok) {
//   throw new Error(`API error: ${await response.text()}`);
// }

//     return response.body.pipeThrough(new TextDecoderStream()).pipeThrough(
//       new TransformStream({
//         transform(chunk, controller) {
//           chunk.split('\n').forEach(line => {
//             if (line.startsWith('data: ')) {
//               const jsonString = line.slice(6);
//               try {
//                 const jsonData = JSON.parse(jsonString);
//                 if (jsonData.content) {
//                   controller.enqueue(jsonData.content);
//                 }
//               } catch (error) {
//                 // console.log('Accumulating data:', jsonString);
//                 controller.enqueue(jsonString);
//               }
//             }
//           });
//         },
//       })
//     );
//   } catch (error) {
//     logError('Error fetching message stream', error);
//     throw error;
//   }
// }, []);
// const handleSendMessage = useCallback(
//   async content => {
//     if (!sessionStorage.getItem('userId')) {
//       logError('Please login to continue', new Error('User not logged in'));
//       return;
//     }
//     if (!content.trim()) {
//       logError('Please enter your message', new Error('Empty message'));
//       return;
//     }

//     setLoading(true);
//     setIsStreaming(true);

//     insertContentAndSync(content);
//     const userMessage = [{ role: 'user', content: content.trim() }];

//     // setMessages(initialMessages);
//     setMessages(prev => [...prev, userMessage]);

//     if (controllerRef.current) {
//       controllerRef.current.abort();
//     }
//     controllerRef.current = new AbortController();

//     const payload = {
//       sessionId:
//         sessionId || sessionStorage.getItem('sessionId') || 'id not provided',
//       workspaceId:
//         workspaceId ||
//         sessionStorage.getItem('workspaceId') ||
//         'id not provided',
//       prompt: content.trim() || 'No prompt provided',
//       userId: sessionStorage.getItem('userId') || 'id not provided',
//       clientApiKey: sessionStorage.getItem('apiKey') || 'key not provided',
//       role: 'user',
//       regenerate: isRegenerating,
//       signal: controllerRef.current.signal,
//       length: messageCount,
//     };

//     clearInput();

//     try {
//       console.log('Sending message with payload:', payload);
//       const stream = await fetchMessageStream(payload);
//       const reader = stream.getReader();

//       let assistantMessage = {
//         role: 'assistant',
//         content: '',
//         isStreaming: true,
//       };

//       setMessages(prev => [...prev, assistantMessage]);

//       let localAccumulatedData = ''; // Local variable for accumulation

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         localAccumulatedData += value; // Accumulate data in the local variable
//         // console.log('Accumulated data:', localAccumulatedData);
//         try {
//           const jsonData = JSON.parse(localAccumulatedData);

//           if (jsonData && jsonData.content) {
//             setMessages(prev => {
//               const updated = [...prev];
//               const lastMessage = updated[updated.length - 1];
//               lastMessage.content = jsonData.content;
//               return updated;
//             });
//             localAccumulatedData = ''; // Reset localAccumulatedData after successful parse
//           }
//         } catch (parseError) {
//           const completedData = attemptCompleteJSON(localAccumulatedData);
//           if (completedData && completedData.content) {
//             const completedMarkdownContent = completedData.content;
//             // const completedMarkdownContent = processMarkdown(
//             //   completedData.content
//             // );
//             setMessages(prev => {
//               const updated = [...prev];
//               const lastMessage = updated[updated.length - 1];
//               lastMessage.content = completedMarkdownContent;
//               return updated;
//             });
//             localAccumulatedData = ''; // Reset after successful parse
//           } else {
//             console.log('Accumulating data:', localAccumulatedData);
//           }
//         }
//         // setMessages(prev => {
//         //   const updated = [...prev];
//         //   const lastMessage = updated[updated.length - 1];
//         //   if (value && typeof value === 'object') {
//         //     lastMessage.content = convertToMarkdown(value);
//         //   } else {
//         //     console.error('Received invalid value:', value);
//         //     lastMessage.content = 'Error: Received invalid data';
//         //   }
//         //   return updated;
//         // });
//         // setMessages(prev => {
//         //   const updated = [...prev];
//         //   updated[updated.length - 1].content += value;
//         //   return updated;
//         // });
//       }
//       if (localAccumulatedData) {
//         try {
//           const jsonData = JSON.parse(localAccumulatedData);
//           if (jsonData === '[DONE]') {
//             setLoading(false);
//             return;
//           }
//           if (jsonData && jsonData.content) {
//             setMessages(prev => {
//               const updated = [...prev];
//               const lastMessage = updated[updated.length - 1];
//               lastMessage.content = jsonData.content;
//               return updated;
//             });
//           }
//         } catch (parseError) {
//           console.error('Error parsing final accumulated data:', parseError);
//         }
//       }

// setMessages(prev => {
//   const updated = [...prev];
//   updated[updated.length - 1].isStreaming = false;
//   return updated;
// });
// setIsMessagesSync(false);
//       console.log('Message stream completed successfully');
//     } catch (error) {
//       if (controllerRef.current.signal.aborted) {
//         logError('Request aborted', error);
//       } else {
//         logError('An error occurred while sending the message', error);
//         const errorMessage = {
//           id: uuidv4(),
//           sender: 'assistant',
//           content: 'An error occurred while generating the response.',
//           timestamp: new Date(),
//         };
//         setMessages(prev => [...prev, errorMessage]);
//       }
//     } finally {
//       setIsStreaming(false);
//       setLoading(false);
//       setMessageCount(prev => prev + 1);
//     }
//   },
//   [
//     setIsStreaming,
//     insertContentAndSync,
//     sessionId,
//     workspaceId,
//     isRegenerating,
//     messageCount,
//     clearInput,
//     fetchMessageStream,
//   ]
// );
