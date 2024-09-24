/* eslint-disable no-constant-condition */
import { createParser } from 'eventsource-parser';
import { uniqueId } from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useChatStore, useUserStore } from 'contexts';
import { cleanUpText, preprocessMarkdown, safeParse } from 'utils/format';
import { useTipTapEditor } from './useTipTapEditor';

function parseToMarkdown(jsonString) {
  const data = JSON.parse(jsonString);

  const { text, formatting, codeBlocks } = data.message.content;

  let markdownText = text;

  formatting.reverse().forEach(fmt => {
    if (fmt.type === 'header') {
      const headerMarker = '#'.repeat(fmt.level) + ' ';
      markdownText =
        markdownText.slice(0, fmt.start) +
        headerMarker +
        markdownText.slice(fmt.start, fmt.end) +
        '\n' +
        markdownText.slice(fmt.end);
    } else if (fmt.type === 'bold') {
      markdownText =
        markdownText.slice(0, fmt.start) +
        '**' +
        markdownText.slice(fmt.start, fmt.end) +
        '**' +
        markdownText.slice(fmt.end);
    }
  });

  // Replace code blocks
  codeBlocks.reverse().forEach(block => {
    const codeBlock = `\`\`\`${block.language}\n${block.code}\n\`\`\``;
    markdownText =
      markdownText.slice(0, block.start) +
      codeBlock +
      markdownText.slice(block.end);
  });

  return markdownText;
}
export const useChatHandler = () => {
  const controllerRef = useRef(null);

  const {
    state: {
      apiKey,
      userInput,
      sessionHeader,
      sessionId,
      workspaceId,
      isRegenerating,
      workspaces,
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
      createNewChatSession,
      setSelectedChatSession,
      setChatFileItems,
      setFirstTokenReceived,
      setChatFiles,
      setChatImages,
      setNewMessageFiles,
      setNewMessageImages,
      setShowFilesDisplay,
      setIsPromptPickerOpen,
      setIsFilePickerOpen,
      setSelectedTools,
      setToolInUse,
      setIsRegenerating,
      setWorkspaces,
      setSelectedWorkspace,
      syncChatMessages,
      setChatMessages,
    },
  } = useChatStore();

  const userId = sessionStorage.getItem('userId');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0); // Initialize message counter
  const initialMessagesRef = useRef([]);

  const { insertContentAndSync, clearInput } = useTipTapEditor(userInput);

  const fetchMessageStream = useCallback(async payload => {
    const response = await fetch('http://localhost:3001/api/chat/v1/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(payload),
      signal: payload.signal,
    });

    if (!response.ok) {
      const result = await response.text();
      throw new Error(`API error: ${result}`);
    }

    return new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop();

          for (const line of lines) {
            if (line.trim() === 'data: [DONE]') {
              controller.close();
              return;
            }
            if (line.startsWith('data: ')) {
              try {
                const jsonData = JSON.parse(line.slice(6));
                if (jsonData.type === 'markdown' && jsonData.content) {
                  controller.enqueue({ content: jsonData.content });
                }
              } catch (error) {
                console.error('Error parsing chunk:', error);
              }
            }
          }
        }

        if (buffer.trim()) {
          try {
            const jsonData = JSON.parse(buffer.slice(6));
            if (jsonData.type === 'markdown' && jsonData.content) {
              controller.enqueue({ content: jsonData.content });
            }
          } catch (error) {
            console.error('Error parsing final buffer:', error);
          }
        }

        controller.close();
      },
    });
  }, []);

  const handleSendMessage = useCallback(
    async content => {
      if (!userId) {
        setError('Please login to continue');
        toast.error('Please login to continue');
        return;
      }

      if (!content.trim()) {
        setError('Please enter your message.');
        toast.error('Please enter your message.');
        return;
      }

      setError('');
      setLoading(true);
      setIsStreaming(true);

      const userMessage = { role: 'user', content: content.trim() };
      const initialMessages = [...chatMessages, userMessage];
      setChatMessages(initialMessages);

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

      let currentMessages = [...initialMessages];

      // let assistantMessage = {
      //   role: 'assistant',
      //   content: '',
      //   isStreaming: true,
      // };

      // let currentMessages = [...initialMessages, assistantMessage];
      // const assistantMessageIndex = currentMessages.length - 1;
      // setChatMessages(currentMessages);
      // setStreamingMessageIndex(assistantMessageIndex);

      try {
        const stream = await fetchMessageStream(payload);
        const reader = stream.getReader();

        let accumulatedContent = '';
        let assistantMessageIndex = null; // Delay assistant message addition

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (value && value.content) {
            accumulatedContent += value.content;

            if (assistantMessageIndex === null) {
              let assistantMessage = {
                role: 'assistant',
                content: '',
                isStreaming: true,
              };
              currentMessages = [...currentMessages, assistantMessage];
              assistantMessageIndex = currentMessages.length - 1;
              setStreamingMessageIndex(assistantMessageIndex);
            }

            const updatedMessages = [...currentMessages];
            updatedMessages[assistantMessageIndex] = {
              ...updatedMessages[assistantMessageIndex],
              content: accumulatedContent,
              isStreaming: true,
            };

            setChatMessages(updatedMessages);
          }
        }

        // Finalize the assistant message when streaming is complete
        if (assistantMessageIndex !== null) {
          const finalMessages = [...currentMessages];
          finalMessages[assistantMessageIndex] = {
            ...finalMessages[assistantMessageIndex],
            content: parseToMarkdown(
              finalMessages[assistantMessageIndex].content
            ),
            isStreaming: false,
          };
          setChatMessages(finalMessages);
        }
      } catch (error) {
        if (controllerRef.current.signal.aborted) {
          toast.error('Request aborted');
        } else {
          console.error('Error:', error);
          toast.error('An error occurred while sending the message.');
          setError('An error occurred while sending the message.');
        }
      } finally {
        setIsStreaming(false);
        setLoading(false);
        setMessageCount(prev => prev + 1);
        setIsMessagesUpdated(false);
      }
    },
    [
      userId,
      chatMessages,
      sessionId,
      workspaceId,
      isRegenerating,
      messageCount,
      clearInput,
      fetchMessageStream,
      setChatMessages,
      setError,
      setIsMessagesUpdated,
      setIsStreaming,
      setLoading,
      setMessageCount,
      setStreamingMessageIndex,
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
//     //       if (event.type === 'event') {
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
