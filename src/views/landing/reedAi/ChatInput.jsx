import { Send } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/themed/RadixUi/button';
import { Textarea } from '@/components/themed/RadixUi/textarea';

/**
 * Renders a chat input component with a textarea for message input and a submit button.
 * @returns {JSX.Element} A form containing a textarea for message input and a submit button.
 */
export const ChatInput = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Message sent:', message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto relative">
      <Textarea
        placeholder="Describe your React component or ask for assistance..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        className="w-full bg-white bg-opacity-10 text-white placeholder-gray-400 border-gray-700 h-36 resize-none pr-12"
      />
      <Button
        type="submit"
        className="absolute right-2 bottom-2 bg-white text-black hover:bg-gray-200"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
