import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa';

import { AiIcon } from 'assets/humanIcons';
import { useMode } from 'hooks';
import { convertToMarkdown } from 'utils/format';

import { ChatBubbleAvatarWrapper } from '../styled';
import { MessageOptions } from './MessageOptions';
import { RenderContent } from './RenderContent';

// animationVariants.js
export const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const MotionBox = motion(Box);

export const ChatBubble = ({ message, sender }) => {
  const { theme } = useMode();
  const bubbleRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState('90%');

  useEffect(() => {
    if (bubbleRef.current) {
      setMaxWidth(`${bubbleRef.current.clientWidth}px`);
    }
  }, []);

  const avatarStyle = {
    width: 40,
    height: 40,
    marginRight: sender === 'assistant' ? 2 : 0,
    marginLeft: sender === 'user' ? 2 : 0,
    backgroundColor:
      sender === 'user'
        ? theme.palette.primary.main
        : theme.palette.secondary.main,
  };

  const icon = sender === 'user' ? <FaUser /> : <AiIcon />;

  return (
    <MotionBox
      ref={bubbleRef}
      sender={sender}
      theme={theme}
      sx={{
        width: '100%',
        backgroundColor: sender === 'user' ? '#26242C' : '#26242C',
        padding: '10px',
        margin: '10px',
        borderRadius: '12px',
      }}
    >
      <ChatBubbleAvatarWrapper sx={avatarStyle} theme={theme} sender={sender}>
        {icon}
      </ChatBubbleAvatarWrapper>
      <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        // className="chat-message"
        className={`chat-message-${sender}`}
      >
        <div className={`message-content-${sender}`}>
          <RenderContent
            content={message.content}
            // content={convertToMarkdown(message.content)}
            maxWidth={maxWidth}
            sender={sender}
          />
        </div>
        {sender === 'assistant' && (
          <MessageOptions
            message={message}
            onRegenerate={() => {
              const messages = JSON.parse(localStorage.getItem('chatMessages'));
              const mostRecentPrompt = messages[messages.length - 1].content;
              console.log(`Regenerating message: ${mostRecentPrompt}`);
            }}
          />
        )}
      </motion.div>
    </MotionBox>
  );
};

export default React.memo(ChatBubble);
