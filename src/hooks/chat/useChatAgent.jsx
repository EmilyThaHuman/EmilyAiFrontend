import { useChat } from 'ai/react';
import { useState, useCallback } from 'react';

import { analyzeUserSentiment, getDeviceContext } from './tools';

const useChatAgent = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { messages, append } = useChat({
    api: '/api/chat',
    onResponse: res => setResponse(res),
    onError: err => setError(err.message),
  });

  const runAgent = useCallback(
    async input => {
      setLoading(true);
      setError(null);
      try {
        const deviceContext = await getDeviceContext();
        const sentiment = await analyzeUserSentiment(input);
        // Agent logic continues here...
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  return { response, error, loading, messages, runAgent };
};

export default useChatAgent;
