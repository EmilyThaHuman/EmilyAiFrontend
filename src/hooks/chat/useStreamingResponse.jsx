import { useState, useEffect, useRef } from 'react';

const useStreamingResponse = apiUrl => {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messageRef = useRef([]); // Use ref to accumulate messages without triggering re-renders

  const handleStreamResponse = useCallback(async payload => {
    setIsStreaming(true);

    try {
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

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          const chunkText = decoder.decode(value, { stream: true });
          handleChunkUpdate(chunkText);
        }
      }

      handleCompletion();
    } catch (error) {
      console.error('Stream error:', error);
      handleError(error);
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const handleChunkUpdate = chunkText => {
    // Assume each chunk is separated by newlines for simplicity
    const newMessages = chunkText.split('\n\n').filter(Boolean);
    messageRef.current = [...messageRef.current, ...newMessages];
    setMessages([...messageRef.current]);
  };

  const handleCompletion = () => {
    setMessages(prev => [...prev, '[Stream complete]']);
  };

  const handleError = error => {
    setMessages(prev => [...prev, `[Error: ${error.message}]`]);
  };

  return {
    messages,
    isStreaming,
    handleStreamResponse,
  };
};

export default useStreamingResponse;
