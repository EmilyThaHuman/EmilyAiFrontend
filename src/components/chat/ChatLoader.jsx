// LoadingIndicator.jsx
import { motion } from 'framer-motion';
import { styled as styled } from 'styled-components';

export const ChatLoader = () => {
  return (
    <motion.div
      className="loading-indicator"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
    >
      <TypingIndicator>
        <span></span>
        <span></span>
        <span></span>
      </TypingIndicator>
    </motion.div>
  );
};

export default ChatLoader;

// Typing Indicator Styled Component
const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;

  span {
    display: block;
    width: 6px;
    height: 6px;
    margin: 0 2px;
    background-color: #555;
    border-radius: 50%;
    animation: typing 1s infinite;
  }

  span:nth-child(2) {
    animation-delay: 0.2s;
  }

  span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0% {
      transform: translateY(0);
      opacity: 0.7;
    }
    50% {
      transform: translateY(-5px);
      opacity: 1;
    }
    100% {
      transform: translateY(0);
      opacity: 0.7;
    }
  }
`;
