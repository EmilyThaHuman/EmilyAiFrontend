/* eslint-disable no-constant-condition */
import { toast } from '@/services/toastService';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ChatApiService } from 'api/Ai';
import { useChatStore } from 'contexts';

import { useChatStream } from './useChatStream';
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
      setChatMessages,
      setChatError,
      setIsRegenerating,
      setStreamingMessageId,
      addChatMessage,
      appendToChatMessage,
      completeChatMessage,
      markChatMessageError,
    },
  } = useChatStore();

  const { insertContentAndSync, clearInput } = useTipTapEditor(userInput);
  const { setContent } = useChatStream();

  const [messageCount, setMessageCount] = useState(0);
  const [startAccumulating, setStartAccumulating] = useState(false);
  const [streamCompleted, setStreamCompleted] = useState(false);
  const aiMessageRef = useRef(''); // To keep track of AI message content
  const debounceRef = useRef(null); // For debouncing state updates
  const handleSendMessage = useCallback(
    async (content, isNewSession = false) => {
      const trimmedContent = content.trim();
      if (!trimmedContent) return;

      setChatLoading(true);
      setChatStreaming(true);
      insertContentAndSync(trimmedContent);

      const userMessage = {
        _id: uuidv4(),
        role: 'user',
        content: trimmedContent,
        timestamp: format(new Date(), 'yyyy-MM-dd').toString(),
      };
      addChatMessage(userMessage);

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
        prompt: trimmedContent,
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
        const apiKey = sessionStorage.getItem('apiKey') || 'key not provided';
        const assistantMessageId = uuidv4();
        const assistantMessage = {
          _id: assistantMessageId,
          role: 'assistant',
          content: '',
          isStreaming: true,
          isComplete: false,
        };
        setStreamingMessageId(assistantMessageId);
        addChatMessage(assistantMessage);

        await ChatApiService.streamChatCompletion(
          chatMessages
            .filter(msg => msg.role !== 'assistant')
            .map(msg => ({ role: 'user', content: msg.content }))
            .concat({ role: 'user', content: userInput }),
          apiKey,
          chunk => {
            aiMessageRef.current += chunk;

            // Update the assistant message in the Redux store
            appendToChatMessage({
              _id: assistantMessageId,
              content: aiMessageRef.current,
            });
          }
        );

        // Mark the message as complete after streaming
        completeChatMessage({
          _id: assistantMessageId,
          content: aiMessageRef.current,
        });
      } catch (error) {
        if (controllerRef.current.signal.aborted) {
          logError('Request aborted', error);
        } else {
          logError('An error occurred while sending the message', error);
          markChatMessageError({
            _id: uuidv4(),
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
      chatMessages,
      userInput,
      setStreamingMessageId,
      appendToChatMessage,
      completeChatMessage,
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
// const handleSendMessage = useCallback(
//   async (content, isNewSession = false) => {
//     if (content.trim() === '') return;

//     setChatLoading(true);
//     setChatStreaming(true);

//     insertContentAndSync(content);

//     const userMessage = {
//       _id: uuidv4(),
//       role: 'user',
//       content: content.trim(),
//       timestamp: format(new Date(), 'yyyy-MM-dd').toString(),
//     };
//     addChatMessage(userMessage);

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
//       length: messageCount,
//       newSession: isNewSession,
//     };

//     clearInput();

//     try {
//       console.log('Sending message with payload:', payload);
//       const response = await fetch(
//         'http://localhost:3001/api/chat/v1/stream',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
//           },
//           body: JSON.stringify(payload),
//           signal: controllerRef.current.signal,
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to send message');
//       }

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder('utf-8');
//       let buffer = '';
//       let done = false;

//       const assistantMessageId = uuidv4();
//       const assistantMessage = {
//         _id: assistantMessageId,
//         role: 'assistant',
//         content: '',
//         isStreaming: true,
//         isComplete: false,
//       };
//       setStreamingMessageId(assistantMessageId);
//       addChatMessage(assistantMessage);

//       while (!done) {
//         const { value, done: readerDone } = await reader.read();
//         done = readerDone;

//         const chunk = decoder.decode(value || new Uint8Array(), {
//           stream: true,
//         });
//         buffer += chunk;

//         let boundary = buffer.indexOf('\n\n');
//         while (boundary !== -1) {
//           const line = buffer.substring(0, boundary);
//           buffer = buffer.substring(boundary + 2);
//           boundary = buffer.indexOf('\n\n');

//           if (line.startsWith('data: ')) {
//             const dataStr = line.substring(6).trim();
//             try {
//               // Sanitize control characters
//               const sanitizedDataStr = dataStr.replace(
//                 // eslint-disable-next-line no-control-regex
//                 /[\u0000-\u001F\u007F]/g,
//                 c => '\\u' + ('000' + c.charCodeAt(0).toString(16)).slice(-4)
//               );
//               const dataObj = JSON.parse(sanitizedDataStr);

//               if (dataObj.type === 'token' && dataObj.content) {
//                 // Check if we should start accumulating
//                 if (!startAccumulating) {
//                   const indexOfHash = dataObj.content.indexOf('#');
//                   if (indexOfHash !== -1) {
//                     setStartAccumulating(true);
//                     const contentFromHash =
//                       dataObj.content.substring(indexOfHash);
//                     appendToChatMessage({
//                       _id: assistantMessageId,
//                       content: contentFromHash,
//                       isStreaming: true,
//                     });
//                   }
//                 } else {
//                   // Already started accumulating
//                   appendToChatMessage({
//                     _id: assistantMessageId,
//                     content: dataObj.content,
//                     isStreaming: true,
//                   });
//                 }
//               } else if (dataObj.type === 'markdown' && dataObj.content) {
//                 // Handle the final markdown content
//                 setStreamCompleted(true);
//                 completeChatMessage({
//                   _id: assistantMessageId,
//                   content: dataObj.content,
//                 });
//               } else if (dataObj.type === '[DONE]') {
//                 // Stream has completed
//                 setStreamCompleted(true);
//                 completeChatMessage({
//                   _id: assistantMessageId,
//                   isStreaming: false,
//                   isComplete: true,
//                 });
//                 break;
//               } else if (dataObj.type === 'error') {
//                 // Handle error from server
//                 logError('Server error', new Error(dataObj.message));
//                 markChatMessageError({
//                   _id: assistantMessageId,
//                   error: dataObj.message,
//                 });
//                 break;
//               }
//             } catch (e) {
//               console.error('Failed to parse JSON:', e, 'Data:', dataStr);
//               logError('An error occurred while processing the message', e);
//               markChatMessageError({
//                 _id: assistantMessageId,
//                 error: e.message,
//               });
//               break;
//             }
//           }
//         }
//       }
//     } catch (error) {
//       if (controllerRef.current.signal.aborted) {
//         logError('Request aborted', error);
//       } else {
//         logError('An error occurred while sending the message', error);
//         markChatMessageError({
//           _id: uuidv4(),
//           error: error.message,
//         });
//       }
//     } finally {
//       setChatStreaming(false);
//       setChatLoading(false);
//       setMessageCount(prev => prev + 1);
//     }
//   },
//   [
//     setChatLoading,
//     setChatStreaming,
//     insertContentAndSync,
//     addChatMessage,
//     sessionId,
//     workspaceId,
//     isRegenerating,
//     messageCount,
//     clearInput,
//     setStreamingMessageId,
//     appendToChatMessage,
//     completeChatMessage,
//     startAccumulating,
//     setStreamCompleted,
//     markChatMessageError,
//   ]
// );
// for (let line of lines) {
//   fullLines.push(line);
//   if (line.startsWith('data: ')) {
//     const dataStr = line.slice(6);
//     fullParsedLines.push(JSON.parse(dataStr));
//     if (dataStr === '[DONE]') {
//       setChatStreaming(false);
//       break;
//     }
//     // Replace unescaped control characters
//     const sanitizedDataStr = dataStr.replace(
//       // eslint-disable-next-line no-control-regex
//       /[\u0000-\u001F\u007F]/g,
//       c =>
//         '\\u' + ('000' + c.charCodeAt(0).toString(16)).slice(-4)
//     );

//     // Parse the sanitized string
//     const dataObj = JSON.parse(sanitizedDataStr);
//     if (dataObj.type === 'token' && dataObj.content) {
//       if (!startAccumulating) {
//         const indexOfHash = dataObj.content.indexOf('#');
//         if (indexOfHash !== -1) {
//           setStartAccumulating(true);
//           const contentFromHash =
//             dataObj.content.substring(indexOfHash);
//           setContent(
//             prevContent => prevContent + contentFromHash
//           );
//           continue;
//         } else {
//           continue;
//         }
//       }

//       // If already started accumulating, append the content
//       if (startAccumulating) {
//         setContent(prevContent => prevContent + dataObj.content);
//       }
//     } else if (dataObj.type === 'markdown' && dataObj.content) {
//       // Handle the final markdown content
//       setStreamCompleted(true);
//       setContent(dataObj.content);
//       // Optionally break out of the loop if the stream ends here
//       if (done) break;
//     } else if (dataObj.type === '[DONE]') {
//       // Stream has completed
//       setStreamCompleted(true);
//       break;
//     }
//     handleServerEvent(dataObj, newMessage._id);
//   }
// }
// }
// }

//   setChatStreaming(false);
//   setIsMessagesSync(false);
// } catch (error) {
//   if (controllerRef.current.signal.aborted) {
//     logError('Request aborted', error);
//   }
//   else {
//     logError('An error occurred while sending the message', error);
//     markChatMessageError({
//       _id: `assistant-${Date.now()}`, // Or use another identifier
//       error: error.message,
//     });
//   }
// } finally {
//   setChatStreaming(false);
//   setChatLoading(false);
//   setMessageCount(prev => prev + 1);
// }

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
