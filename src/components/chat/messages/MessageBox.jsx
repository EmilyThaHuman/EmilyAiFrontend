import { Box, Container } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { lazy, Suspense, useMemo } from 'react';

import { useChatStore } from 'contexts/ChatProvider';
import { useMode } from 'hooks/app';

import 'styles/MarkdownBlockStyles.css';
import { UserMessage, AssistantMessage } from './MessagesMemoized';
import { ChatLoader } from '../ChatLoader';

export const MessageBox = React.memo(props => {
  const { theme } = useMode();
  const {
    state: { chatMessages },
  } = useChatStore();
  const messagesStartRef = useMemo(() => React.createRef(), []);
  const messagesEndRef = useMemo(() => React.createRef(), []);
  return (
  <>
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
  </>
  );
  }

  MessageBox.displayName = 'MessageBox';

// MessageBox.propTypes = {
//   messages: PropTypes.arrayOf(
//     PropTypes.shape({
//       content: PropTypes.string,
//       role: PropTypes.string,
//     })
//   ).isRequired,
// };

export default MessageBox;

  // const groupedMessages = useMemo(() => {
  //   return chatMessages?.reduce((acc, message, index) => {
  //     if (index % 2 === 0) {
  //       acc.push([message, chatMessages[index + 1]].filter(Boolean));
  //     }
  //     return acc;
  //   }, []);
  // }, [chatMessages]);

//   return (
//     <Box
//       // onScroll={handleScroll}
//       sx={{
//         flexGrow: 1,
//         overflowY: 'auto',
//         padding: theme.spacing(2),
//         height: '100%',
//         width: '100%',
//         maxWidth: '100%',
//         maxHeight: '100%',
//       }}
//     >
//       <Container
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           p: 3,
//           width: '90%',
//           maxWidth: '90%',
//           mx: 'auto',
//         }}
//       >
//         <Container
//           sx={{
//             position: 'relative',
//             display: 'flex',
//             flexDirection: 'column',
//             p: 3,
//             width: '90%',
//             maxWidth: '90%',
//             mx: 'auto',
//           }}
//         >
//           <div ref={messagesStartRef} />

//           <AnimatePresence>
//             {chatMessages?.map((message, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems:
//                     message[0]?.role === 'user' ? 'flex-end' : 'flex-start',
//                   mb: 2,
//                   width: '100%',
//                   maxWidth: '100%',
//                   mx: 'auto',
//                 }}
//               >
//                 {/* {group.map((message, subIndex) => (
//               <> */}
//                 <Box
//                   key={index}
//                   sx={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     // padding: { xs: '10px', sm: '15px', md: '20px' },
//                     height: '100%',
//                     maxWidth: '100%',
//                     flexGrow: 1,
//                   }}
//                 >
//                   {message.role === 'user' ? (
//                     <UserMessage message={message} />
//                   ) : (
//                     <AssistantMessage message={message} />
//                   )}
//                 </Box>
//                 {message.isStreaming && <ChatLoader />}
//               </Box>
//             ))}
//           </AnimatePresence>

//           <div ref={messagesEndRef} />
//           {/* <div ref={messagesStartRef} /> */}
//           {/* {chatMessages?.length > 0 ? (
//         <Container
//           sx={{
//             display: 'flex',
//             justifyContent: 'center',
//             p: 3,
//             width: '90%',
//             maxWidth: '90%',
//             mx: 'auto',
//           }}
//         >
//           <Container
//             sx={{
//               position: 'relative',
//               display: 'flex',
//               flexDirection: 'column',
//               p: 3,
//               width: '90%',
//               maxWidth: '90%',
//               mx: 'auto',
//             }}
//           > */}
//           {/* </Container> */}
//           {/* // </Container> */}
//           {/* // ) : (
//       //   <></>
//       // )} */}
//         </Container>
//       </Container>
//     </Box>
//   );
// });

// MessageBox.displayName = 'MessageBox';

// // MessageBox.propTypes = {
// //   messages: PropTypes.arrayOf(
// //     PropTypes.shape({
// //       content: PropTypes.string,
// //       role: PropTypes.string,
// //     })
// //   ).isRequired,
// // };

// export default MessageBox;
