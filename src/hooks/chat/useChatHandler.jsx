/* eslint-disable no-constant-condition */
import { createParser } from 'eventsource-parser';
import { uniqueId } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useChatStore, useUserStore } from 'contexts';
import { cleanUpText, preprocessMarkdown, safeParse } from 'utils/format';
import { useTipTapEditor } from './useTipTapEditor';
const logError = (message, error) => {
  console.error(`${message}:`, error);
  toast.error(message);
};
function convertToMarkdown(jsonContent) {
  if (
    !jsonContent ||
    typeof jsonContent !== 'object' ||
    typeof jsonContent.content !== 'string'
  ) {
    console.error('Invalid input to convertToMarkdown:', jsonContent);
    return ''; // Return an empty string or some default value
  }
  let markdown = jsonContent.content;

  // Remove duplicate words and phrases
  markdown = markdown.replace(/(\b\w+\b)\s+\1/g, '$1');

  // Remove extra backslashes and quotation marks
  markdown = markdown.replace(/\\n/g, '\n').replace(/\\"/g, '"');

  // Remove extra spaces
  markdown = markdown.replace(/\s+/g, ' ');

  // Fix code block syntax
  markdown = markdown
    .replace(/```jsx/g, '```jsx\n')
    .replace(/```\n\n/g, '```\n');

  // Fix headers
  markdown = markdown.replace(/#+\s*([^#\n]+)/g, (match, p1) => {
    const level = match.trim().split('#').length - 1;
    return `${'#'.repeat(level)} ${p1.trim()}`;
  });

  // Fix list items
  markdown = markdown.replace(/(-\s*[^\n]+)/g, '\n$1');

  // Add newlines before and after code blocks
  markdown = markdown.replace(/(```[^`]+```)/g, '\n$1\n');

  // Remove any remaining backslashes
  markdown = markdown.replace(/\\/g, '');

  return markdown.trim();
}
export const useChatHandler = () => {
  const controllerRef = useRef(null);

  const {
    state: {
      userInput,
      sessionHeader,
      sessionId,
      workspaceId,
      isRegenerating,
      streamingMessageIndex,
      isStreaming,
      chatMessages,
    },
    actions: {
      setSessionId,
      setSessionHeader,
      setUserInput,
      setIsMessagesUpdated,
      setFirstMessageReceived,
      setStreamingMessageIndex,
      setIsStreaming,
      setIsRegenerating,
      setChatMessages,
    },
  } = useChatStore();

  const userId = sessionStorage.getItem('userId');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0); // Initialize message counter
  const [messages, setMessages] = useState(chatMessages);
  // const [accumulatedData, setAccumulatedData] = useState('');

  const [stream, setStream] = useState('');
  const initialMessagesRef = useRef([]);
  const [isMessagesSync, setIsMessagesSync] = useState(true);

  const callback = useCallback(
    chunk => setStream(currStream => currStream + chunk),
    []
  );
  const handleError = useCallback(error => {
    console.error('Error:', error);
    toast.error('An error occurred. Please try again.');
    setError('An error occurred while processing your request.');
  }, []);
  const handleMessageStream = useCallback(
    async stream => {
      const reader = stream.getReader();
      let assistantMessage = {
        role: 'assistant',
        content: '',
        isStreaming: true,
      };
      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content += value;
          return updated;
        });
      }
    },
    [setMessages]
  );
  const { insertContentAndSync, clearInput } = useTipTapEditor(userInput);
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
                  // console.log('Received JSON data:', jsonData);
                  if (jsonData.content) {
                    controller.enqueue(jsonData.content);
                  }
                } catch (error) {
                  console.log('Accumulating data:', jsonString);
                  // If it's not valid JSON, enqueue it as is
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
      if (!userId) {
        logError('Please login to continue', new Error('User not logged in'));
        return;
      }

      if (!content.trim()) {
        logError('Please enter your message', new Error('Empty message'));
        return;
      }

      setLoading(true);
      setIsStreaming(true);

      const userMessage = { role: 'user', content: content.trim() };
      const initialMessages = [...chatMessages, userMessage];
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
        userId: userId || 'id not provided',
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
          console.log('Accumulated data:', localAccumulatedData);
          try {
            const jsonData = JSON.parse(localAccumulatedData);
            console.log('Received JSON data:', jsonData);

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
            // If it's not valid JSON yet, continue accumulating
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
        // Handle any remaining data
        // Handle any remaining accumulated data
        if (localAccumulatedData) {
          try {
            const jsonData = JSON.parse(localAccumulatedData);
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
      userId,
      setIsStreaming,
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
// const decoder = new TextDecoder('utf-8');
// let buffer = '';
// let asstMsg = '';

// while (true) {
//   const { value, done } = await reader.read();
//   if (done) break;

//   buffer += decoder.decode(value, { stream: true });

//   let boundary;
//   while ((boundary = buffer.indexOf('\n\n')) !== -1) {
//     const chunk = buffer.slice(0, boundary);
//     buffer = buffer.slice(boundary + 2);

//     if (chunk.startsWith('data: ')) {
//       const jsonData = chunk.slice(6);
//       if (jsonData === '[DONE]') {
//         console.log('Stream complete');
//         break;
//       }

//       try {
//         const data = JSON.parse(jsonData);
//         if (data.content) {
//           asstMsg += data.content;
//           const updatedMessages = [...currentMessages];
//           updatedMessages[assistantMessageIndex] = {
//             ...updatedMessages[assistantMessageIndex],
//             content: asstMsg,
//             isStreaming: true,
//           };
//           setChatMessages(updatedMessages);
//         }
//       } catch (error) {
//         console.error('Error parsing JSON:', error);
//       }
//     }
//   }
// }

// Final update after stream ends
// const handleProcessResponse = useCallback(async response => {
//   const reader = response.body.getReader();
//   const decoder = new TextDecoder();
//   let buffer = '';

//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;

//     buffer += decoder.decode(value, { stream: true });
//     const lines = buffer.split('\n');
//     buffer = lines.pop();

//     for (const line of lines) {
//       if (line.trim()) {
//         try {
//           const jsonData = JSON.parse(line);
//           processJsonData(jsonData);
//         } catch (error) {
//           console.error('Error parsing JSON:', error);
//         }
//       }
//     }
//   }
// }, []);

// function processJsonData(data) {
//   console.log('Received JSON data:', data);
//   // Process the JSON data as needed
// }

// const handleSendMessage = useCallback(
//   async content => {
//     if (!userId) {
//       setError('Please login to continue');
//       toast.error('Please login to continue');
//       return;
//     }

//     if (!content.trim()) {
//       setError('Please enter your message.');
//       toast.error('Please enter your message.');
//       return;
//     }

//     setError('');
//     setLoading(true);
//     setIsStreaming(true);

//     const userMessage = { role: 'user', content: content.trim() };
//     let initialMessages = [...chatMessages, userMessage];
//     setChatMessages(initialMessages);

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
//       userId: userId || 'id not provided',
//       clientApiKey: sessionStorage.getItem('apiKey') || 'key not provided',
//       role: 'user',
//       regenerate: isRegenerating,
//       signal: controllerRef.current.signal,
//       length: messageCount,
//     };

//     clearInput();

//     // const decoder = new TextDecoder('utf-8');
//     let assistantMessage = {
//       role: 'assistant',
//       content: '',
//       isStreaming: true,
//     };
//     // Add assistant message to chat
//     let currentMessages = [...initialMessages, assistantMessage];
//     const assistantMessageIndex = currentMessages.length - 1; // Get index for streaming
//     setChatMessages(currentMessages); // Directly setting without function
//     setStreamingMessageIndex(assistantMessageIndex);
//     try {
//       const response = await fetchMessageStream(payload);
//       const reader = response.body.getReader();
//       const decoder = new TextDecoder('utf-8');
//       let buffer = '';

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         buffer += decoder.decode(value, { stream: true });

//         // Process complete JSON objects
//         let boundary;
//         while ((boundary = buffer.indexOf('\n\n')) !== -1) {
//           const chunk = buffer.slice(0, boundary);
//           buffer = buffer.slice(boundary + 2);

//           if (chunk.startsWith('data: ')) {
//             const jsonData = chunk.slice(6);
//             if (jsonData === '[DONE]') {
//               console.log('Stream complete');
//               return;
//             }

//             try {
//               const data = JSON.parse(jsonData);
//               if (data.content) {
//                 outputElement.textContent += data.content;
//                 if (content) {
//                   buffer += content;
//                   console.log('BUFFER:', buffer);
//                   const updatedMessages = [...currentMessages];
//                   updatedMessages[assistantMessageIndex] = {
//                     ...updatedMessages[assistantMessageIndex],
//                     content: data,
//                     isStreaming: true,
//                   };
//                   setChatMessages(updatedMessages);
//                 }
//               }
//             } catch (error) {
//               console.error('Error parsing JSON:', error);
//             }
//           }
//         }
//       }
//       // while (true) {
//       //   const { done, value } = await reader.read();
//       //   if (done) break;

//       //   const chunk = decoder.decode(value);
//       //   const lines = chunk.split('\n\n');

//       //   for (const line of lines) {
//       //     if (line.startsWith('data: ')) {
//       //       const data = line.slice(6);
//       //       if (data === '[DONE]') break;

//       //       try {
//       //         const { content } = JSON.parse(data);
//       // if (content) {
//       //   buffer += content;
//       //   console.log('BUFFER:', buffer);
//       //   const updatedMessages = [...currentMessages];
//       //   updatedMessages[assistantMessageIndex] = {
//       //     ...updatedMessages[assistantMessageIndex],
//       //     content: buffer,
//       //     isStreaming: true,
//       //   };
//       //   setChatMessages(updatedMessages);
//       // }
//       //       } catch (error) {
//       //         console.error('Error parsing JSON:', error);
//       //       }
//       //     }
//       //   }
//       // }
//       // let accumulatedContent = '';
//       // while (true) {
//       //   const { done, value } = await reader.read();
//       //   if (done) break;

//       //   buffer += decoder.decode(value, { stream: true });
//       // console.log('BUFFER:', buffer);
//       // const updatedMessages = [...currentMessages];
//       // updatedMessages[assistantMessageIndex] = {
//       //   ...updatedMessages[assistantMessageIndex],
//       //   content: buffer,
//       //   isStreaming: true,
//       // };
//       //   // Check if we've reached the "content" field
//       //   if (!contentStarted) {
//       //     const contentStart = buffer.indexOf('"content":');
//       //     if (contentStart !== -1) {
//       //       contentStarted = true;
//       //       buffer = buffer.slice(contentStart + 10); // +10 to skip '"content":'
//       //       // Remove leading whitespace and first quote if present
//       //       buffer = buffer.trimLeft.replace(/^"/, '');
//       //     }
//       //   }
//       //   if (contentStarted) {
//       //     // Process content in chunks
//       //     while (true) {
//       //       console.log('BUFFER MAIN:', buffer);
//       //       const updatedMessages = [...currentMessages];
//       //       updatedMessages[assistantMessageIndex] = {
//       //         ...updatedMessages[assistantMessageIndex],
//       //         content: buffer,
//       //         isStreaming: true,
//       //       };
//       //       const quoteIndex = buffer.indexOf('"');
//       //       if (quoteIndex === -1) {
//       //         // No closing quote found, append entire buffer
//       //         contentBuffer += buffer;
//       //         console.log('QUOTE INDEX:', contentBuffer);
//       //         const updatedMessages = [...currentMessages];
//       //         updatedMessages[assistantMessageIndex] = {
//       //           ...updatedMessages[assistantMessageIndex],
//       //           content: contentBuffer,
//       //           isStreaming: true,
//       //         };

//       // setChatMessages(updatedMessages);
//       //         buffer = '';
//       //         break;
//       //       } else if (buffer[quoteIndex - 1] !== '\\') {
//       //         // Found unescaped quote, process content up to this point
//       //         contentBuffer += buffer.slice(0, quoteIndex);
//       //         processContent(contentBuffer);
//       //         // if (value && value.content) {
//       //         // accumulatedContent += value.content;
//       //         console.log('CONTENT BUFFER:', contentBuffer);
//       //         const updatedMessages = [...currentMessages];
//       //         updatedMessages[assistantMessageIndex] = {
//       //           ...updatedMessages[assistantMessageIndex],
//       //           content: contentBuffer,
//       //           isStreaming: true,
//       //         };

//       //         setChatMessages(updatedMessages);
//       //         // }
//       //         contentBuffer = '';
//       //         buffer = buffer.slice(quoteIndex + 1);
//       //         contentStarted = false;
//       //         break;
//       //       } else {
//       //         // Found escaped quote, continue searching
//       //         contentBuffer += buffer.slice(0, quoteIndex + 1);
//       //         buffer = buffer.slice(quoteIndex + 1);
//       //       }
//       //     }
//       //   }
//       //   // Process any remaining content
//       //   if (contentBuffer) {
//       //     console.log('Remaining content:', contentBuffer);
//       //     processContent(contentBuffer);
//       //   }

//       //   console.log('Stream complete');

//       //   // if (value && value.content) {
//       //   //   accumulatedContent += value.content;

//       //   //   const updatedMessages = [...currentMessages];
//       //   //   updatedMessages[assistantMessageIndex] = {
//       //   //     ...updatexaccumulatedContent,
//       //   //     isStreaming: true,
//       //   //   };

//       //   //   setChatMessages(updatedMessages);
//       //   // }
//       // }

//       // Final update after stream ends
//       const finalMessages = [...currentMessages];
//       finalMessages[assistantMessageIndex] = {
//         ...finalMessages[assistantMessageIndex],
//         content: preprocessMarkdown(
//           finalMessages[assistantMessageIndex].content
//         ),
//         isStreaming: false,
//       };

//       setChatMessages(finalMessages);
//       setIsStreaming(false);
//       setMessageCount(prev => prev + 1);
//       setIsMessagesUpdated(false);
//       // try {
//       //   const stream = await fetchMessageStream(payload);
//       //   const reader = stream.getReader();

//       //   let accumulatedContent = '';
//       //   while (true) {
//       //     const { done, value } = await reader.read();
//       //     if (done) break;

//       //     // Clean up the chunk of content
//       //     const cleanedChunk = cleanUpText(value);

//       //     // Accumulate the cleaned content
//       //     accumulatedContent += cleanedChunk;

//       //     // Create a new copy of the array and object to avoid mutating frozen objects
//       //     const updatedMessages = [...currentMessages]; // Create new array
//       //     updatedMessages[assistantMessageIndex] = {
//       //       ...updatedMessages[assistantMessageIndex], // Create new object for assistant message
//       //       content: accumulatedContent,
//       //       isStreaming: true,
//       //     };

//       //     setChatMessages(updatedMessages); // Set new array
//       //   }

//       //   // Final update after stream ends
//       //   const finalMessages = [...currentMessages]; // Copy again
//       //   finalMessages[assistantMessageIndex] = {
//       //     ...finalMessages[assistantMessageIndex], // New object for final assistant message
//       //     content: accumulatedContent,
//       //     isStreaming: false,
//       //   };

//       //   setChatMessages(finalMessages); // Set final copy
//       //   setIsStreaming(false);
//       //   setMessageCount(prev => prev + 1);
//       //   setIsMessagesUpdated(false);
//     } catch (error) {
//       if (controllerRef.signal.aborted) {
//         toast.error('Request aborted');
//       } else {
//         console.error('Error:', error);
//         toast.error('An error occurred while sending the message.');
//       }
//       setError('An error occurred while sending the message.');
//       setIsStreaming(false);
//       setLoading(false);
//     } finally {
//       clearInput();
//       setLoading(false);
//       setIsStreaming(false);
//     }
//   },
//   [
//     userId,
//     setIsStreaming,
//     chatMessages,
//     setChatMessages,
//     sessionId,
//     workspaceId,
//     isRegenerating,
//     messageCount,
//     clearInput,
//     fetchMessageStream,
//     setStreamingMessageIndex,
//     setIsMessagesUpdated,
//   ]
// );
// setChatMessages(prevMessages => {
//   const newMessages = [...prevMessages];
//   newMessages[newMessages.length - 1] = assistantMessage;
//   return newMessages;
// });
// eslint-disable-next-line no-constant-condition
// while (true) {
//   const { done, value } = await reader.read();
//   if (done) break;

//   assistantMessage.content += value;

//   setChatMessages(prevMessages => {
//     const newMessages = [...prevMessages];
//     newMessages[newMessages.length - 1] = {
//       ...assistantMessage,
//       isStreaming: true,
//     };
//     return newMessages;
//   });
// }

// const parsedContent = safeParse(
//   assistantMessage.content,
//   assistantMessage.content
// );
// assistantMessage.content = parsedContent.content;

// setChatMessages(prevMessages => {
//   const newMessages = [...prevMessages];
//   newMessages[newMessages.length - 1] = {
//     ...assistantMessage,
//     isStreaming: false,
//   };
//   return newMessages;
// });
// console.log('DATA:', parsedContent);
// assistantMessage.content = parsedContent.content;

// tempMessages[streamingMessageIndex] = {
//   ...assistantMessage,
//   // content: assistantMessage.content,
//   isStreaming: false,
// };
// setChatMessages([...tempMessages]);
// setChatMessages(prevMessages => {
//   const newMessages = [...prevMessages];
//   newMessages[newMessages.length - 1] = {
//     ...assistantMessage,
//     isStreaming: false, // Set isStreaming to false
//   };
//   console.log('Updated messages 2:', newMessages);
//   return newMessages;
// });
// localStorage.setItem('chatMessages', JSON.stringify(currentMessages));

// const fetchMessageStream = useCallback(async payload => {
//   const response = await fetch('http://localhost:3001/api/chat/v1/stream', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
//     },
//     body: JSON.stringify(payload),
//     signal: payload.signal,
//   });

//   if (!response.ok) {
//     const result = await response.text();
//     throw new Error(`API error: ${result}`);
//   }
//   return new ReadableStream({
//     async start(controller) {
//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let buffer = '';

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         buffer += decoder.decode(value, { stream: true });

//         let boundary;
//         while ((boundary = buffer.indexOf('\n\n')) !== -1) {
//           const chunk = buffer.slice(0, boundary);
//           buffer = buffer.slice(boundary + 2);

//           if (chunk.trim()) {
//             try {
//               const parsed = JSON.parse(chunk);
//               if (parsed.type === 'markdown' && parsed.content) {
//                 controller.enqueue({ content: parsed.content });
//               }
//             } catch (error) {
//               console.error('Error parsing chunk:', error);
//             }
//           }
//         }
//       }

//       if (buffer.trim()) {
//         try {
//           const parsed = JSON.parse(buffer);
//           if (parsed.type === 'markdown' && parsed.content) {
//             controller.enqueue({ content: parsed.content });
//           }
//         } catch (error) {
//           console.error('Error parsing final buffer:', error);
//         }
//       }

//       controller.close();
//     },
//     // return new ReadableStream({
//     // async start(controller) {
//     //   let accumulatedData = '';
//     //   const decoder = new TextDecoder();

//     //   for await (const chunk of response.body) {
//     //     accumulatedData += decoder.decode(chunk, { stream: true });

//     //     // Optimistic parsing
//     //     try {
//     //       const jsonObject = JSON.parse(accumulatedData);
//     //       controller.enqueue(jsonObject);
//     //       accumulatedData = ''; // Reset after successful parsing
//     //     } catch (error) {
//     //       // If parsing fails, it might be incomplete JSON. Continue accumulating.
//     //       continue;
//     //     }
//     //   }

//     //   // Handle any remaining data
//     //   if (accumulatedData) {
//     //     try {
//     //       const jsonObject = JSON.parse(accumulatedData);
//     //       controller.enqueue(jsonObject);
//     //     } catch (error) {
//     //       // If parsing fails, extract markdown from the incomplete JSON
//     //       const markdownContent = extractMarkdown(accumulatedData);
//     //       if (markdownContent.length > 0) {
//     //         controller.enqueue({ content: markdownContent.join(' ') });
//     //       }
//     //     }
//     //   }

//     //   controller.close();
//     // },
//     // return new ReadableStream({
//     //   async start(controller) {
//     //     const parser = createParser(event => {
//     //       if (event.tyFpe === 'event') {
//     //         const data = event.data;
//     //         if (data === '[DONE]') {
//     //           controller.close();
//     //           return;
//     //         }
//     //         try {
//     //           const parsedData = data.trim().replace(/(\r\n|\n|\r)/gm, '');
//     //           controller.enqueue(parsedData);
//     //         } catch (e) {
//     //           controller.error(e);
//     //         }
//     //       }
//     //     });

//     //     for await (const chunk of response.body) {
//     //       parser.feed(new TextDecoder().decode(chunk, { stream: true }));
//     //     }
//     //   },
//   });
// }, []);
