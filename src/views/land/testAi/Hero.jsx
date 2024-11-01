import { motion } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

import { useMode } from 'hooks/app';

import ChatInput from './ChatInput';

export const Hero = () => {
  const { theme } = useMode();
  const [text] = useTypewriter({
    words: [
      'Create a responsive navbar',
      'Design a product card with hover effects',
      'Implement a dark mode toggle',
      'Build an animated loading spinner',
      'Refactor a class component to a functional one',
      'Style a form with Tailwind CSS',
      'Optimize React rendering with useMemo',
      'Add drag and drop functionality',
      'Create a multi-step form wizard',
      'Implement infinite scrolling',
    ],
    loop: 0,
    typeSpeed: 70,
    deleteSpeed: 50,
    delaySpeed: 1000,
  });

  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-5xl font-bold mb-6"
      >
        Ai Testing
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xl mb-8 h-20"
      >
        {text}
        <Cursor cursorStyle="_" />
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="w-full max-w-3xl"
      >
        <ChatInput />
      </motion.div>
    </div>
  );
};

export default Hero;
