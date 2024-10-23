/* eslint-disable no-constant-condition */
import { format } from 'date-fns';
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
    state: { userInput, sessionId, workspaceId, isRegenerating, chatMessages },
    actions: {
      setChatStreaming,
      setChatLoading,
      setChatError,
      setIsRegenerating,
      setStreamingMessageIndex,
      setStreamingMessageId,
      setChatMessages,
      markChatMessageError,
      // setChatMessage,
      addChatMessage,
      appendToChatMessage,
      completeChatMessage,
    },
  } = useChatStore();
  const { insertContentAndSync, clearInput } = useTipTapEditor(userInput);
  const [messageCount, setMessageCount] = useState(0);
  const [isMessagesSync, setIsMessagesSync] = useState(true);

  useEffect(() => {
    if (!isMessagesSync) {
      setIsMessagesSync(true);
    }
  }, [isMessagesSync]);

  const handleToken = useCallback(
    (token, assistantMessageId) => {
      console.log('Received token:', token);
      let parsedToken = token;

      appendToChatMessage({
        role: 'assistant',
        content: parsedToken,
        _id: assistantMessageId,
        isStreaming: true,
        isComplete: false,
      });
    },
    [appendToChatMessage]
  );

  const handleServerEvent = useCallback(
    (data, assistantMessageId) => {
      switch (data.type) {
        case 'token':
          handleToken(data.content, assistantMessageId);
          break;
        case 'run_start':
          console.log('Run started');
          break;
        case 'run_end':
          setChatStreaming(false);
          console.log('Run ended', data.final_output);
          completeChatMessage({
            _id: assistantMessageId,
            content: data.final_output,
          });
          break;
        case 'error':
          console.error('Server error:', data.message);
          setChatStreaming(false);
          setChatError(data.message);
          break;
        default:
          break;
      }
    },
    [handleToken, setChatStreaming, completeChatMessage, setChatError]
  );

  const handleSendMessage = useCallback(
    async (content, isNewSession = false) => {
      if (content.trim() === '') return;

      setChatLoading(true);
      setChatStreaming(true);

      insertContentAndSync(content);

      const userMessage = {
        _id: uuidv4(),
        role: 'user',
        content: content.trim(),
        timestamp: format(new Date(), 'yyyy-MM-dd').toString(),
      };
      addChatMessage(userMessage);
      // setChatMessage(userMessage);

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
            signal: controllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;
        let buffer = '';
        let fullResponse = '';
        const fullLines = [];
        const fullParsedLines = [];

        const assistantMessageId = Date.now().toString();

        let newMessage = {
          _id: assistantMessageId,
          role: 'assistant',
          content: '',
          isStreaming: true,
          isComplete: false,
        };

        // setChatMessage(newMessage);
        const streamingMessageIndex = chatMessages.length;
        setStreamingMessageIndex(streamingMessageIndex);
        setStreamingMessageId(assistantMessageId);
        addChatMessage(newMessage);
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            if (buffer.includes('[DONE]')) {
              done = true;
            }
            fullResponse += chunk;
            // Process the buffer for complete messages
            let lines = buffer.split('\n\n');
            buffer = lines.pop(); // Keep incomplete line in buffer

            for (let line of lines) {
              fullLines.push(line);
              if (line.startsWith('data: ')) {
                const jsonData = line.slice(6);
                fullParsedLines.push(JSON.parse(jsonData));
                if (jsonData === '[DONE]') {
                  setChatStreaming(false);
                  break;
                }
                const data = JSON.parse(jsonData);
                handleServerEvent(data, newMessage._id);
              }
            }
            // }
          }
        }
        // setChatMessage({
        //   _id: 'streaming',
        //   content: '',
        //   isComplete: true,
        //   role: 'assistant',
        // });
        setChatStreaming(false);
        setIsMessagesSync(false);
      } catch (error) {
        if (controllerRef.current.signal.aborted) {
          logError('Request aborted', error);
        } else {
          logError('An error occurred while sending the message', error);
          markChatMessageError({
            _id: `assistant-${Date.now()}`, // Or use another identifier
            error: error.message,
          });
        }
      } finally {
        setChatStreaming(false);
        setChatLoading(false);
        setMessageCount(prev => prev + 1);
      }
    },
    [
      setChatLoading,
      setChatStreaming,
      insertContentAndSync,
      addChatMessage,
      sessionId,
      workspaceId,
      isRegenerating,
      messageCount,
      clearInput,
      chatMessages.length,
      setStreamingMessageIndex,
      setStreamingMessageId,
      handleServerEvent,
      markChatMessageError,
    ]
  );

  const handleRegenerateResponse = useCallback(async () => {
    setIsRegenerating(true);
    const lastUserMessage =
      chatMessages[chatMessages?.length - 2]?.content || '';
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
    setChatStreaming(false);
  }, [setChatStreaming]);

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  return useMemo(
    () => ({
      messageCount,
      controllerRef,
      clearInput,
      handleSendMessage,
      handleRegenerateResponse,
      handleStop,
    }),
    [
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

//     setChatLoading(true);
//     setChatStreaming(true);

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
//             setChatLoading(false);
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
//       setChatStreaming(false);
//       setChatLoading(false);
//       setMessageCount(prev => prev + 1);
//     }
//   },
//   [
//     setChatStreaming,
//     insertContentAndSync,
//     sessionId,
//     workspaceId,
//     isRegenerating,
//     messageCount,
//     clearInput,
//     fetchMessageStream,
//   ]
// );
