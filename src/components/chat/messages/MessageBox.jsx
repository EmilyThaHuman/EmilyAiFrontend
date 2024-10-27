import { Box, Card, Typography } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useMemo, useRef } from 'react';

import { useChatStore } from 'contexts/ChatProvider';
import { useMode } from 'hooks/app';

import { UserMessage, AssistantMessage } from './MessagesMemoized';
import { ChatLoader } from '../ChatLoader';
import MessageList from './MessageList'; // Assuming you have this component

import 'styles/MarkdownBlockStyles.css';

export const MessageBox = React.memo(
  ({ handlePromptSelect, codePromptOptions }) => {
    const { theme } = useMode();
    const {
      state: { chatMessages, isChatLoading, streamingMessageId },
    } = useChatStore();

    return (
      <>
        <AnimatePresence>
          {!chatMessages?.length ? (
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
                  maxWidth: '56rem',
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 2,
                  p: 4,
                }}
              >
                {codePromptOptions.map((option, index) => (
                  <Card
                    key={index}
                    onClick={() => handlePromptSelect(option.prompt)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
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
            <MessageList
              messages={chatMessages}
              isLoading={isChatLoading}
              streamingMessageId={streamingMessageId}
            />
          )}
        </AnimatePresence>
      </>
    );
  }
);

MessageBox.displayName = 'MessageBox';

MessageBox.propTypes = {
  handlePromptSelect: PropTypes.func.isRequired,
  codePromptOptions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      prompt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

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
