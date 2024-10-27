import { format } from 'date-fns';
import { useEffect, useState, useRef } from 'react';

import { useChatStore } from 'contexts';

export const useChatStream = () => {
  const controllerRef = useRef(null);
  const {
    state: { sessionId, workspaceId, selectedChatSession },
    actions: { addChatMessage },
  } = useChatStore();
  const [streamBuffer, setStreamBuffer] = useState('');
  const [textLines, setTextLines] = useState([]);
  const [content, setContent] = useState('');
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let accumulatedText = '';
  let done = false;
  let started = false;
  let ended = false;
  // const [streamBuffer, setStreamBuffer] = useState(
  //   typeof content === 'string' ? content : ''
  // );
  const streamChunks = [];
  const getChatPayload = () => {
    const userMessage = {
      _id: format(new Date(), 'yyyy-MM-dd').toString(),
      role: 'user',
      content: content.trim(),
      timestamp: format(new Date(), 'yyyy-MM-dd').toString(),
      userId: sessionStorage.getItem('userId') || 'id not provided',
      sessionId:
        sessionId || sessionStorage.getItem('sessionId') || 'id not provided',
      workspaceId:
        workspaceId ||
        sessionStorage.getItem('workspaceId') ||
        'id not provided',
    };
    addChatMessage(userMessage);

    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();

    const payload = {
      message: userMessage,
      clientApiKey: sessionStorage.getItem('apiKey') || 'key not provided',
      regenerate: false,
      newSession: selectedChatSession.messages.length === 0 ? true : false,
    };
    return payload;
  };
  const getResponse = async payload => {
    try {
      console.log('Sending message with payload:', payload);
      const response = await fetch('http://localhost:3001/api/chat/v1/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(payload),
        signal: controllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error fetching message stream:', error);
    }
  };
  const decodeChunk = chunk => {
    const decodedChunk = decoder.decode(chunk, { stream: true });
    return decodedChunk;
  };
  const addChunk = chunk => {
    streamChunks.push(chunk);
  };
  const updateBuffer = chunk => {
    setStreamBuffer(prevBuffer => prevBuffer + chunk);
  };
  const getBufferedTextWords = () => {
    return streamBuffer.split('\n');
  };
  const getBufferedTextLines = () => {
    let lines = streamBuffer.split('\n\n');
    lines.pop();
    setTextLines(lines);
    return lines;
  };
  const getBufferedTextLineData = lines => {
    for (let line of lines) {
      if (line.startsWith('data: ')) {
        const jsonData = line.slice(6);
        const data = JSON.parse(jsonData);
        console.log('Data:', data);
        return data;
      }
    }
  };
  const getContentFromData = dataStr => {
    try {
      const dataObj = JSON.parse(dataStr);
      if (dataObj.type === 'token' && dataObj.content) {
        const tokenContent = dataObj.content;

        if (!started) {
          if (tokenContent.includes('#')) {
            started = true;
            // Start accumulating from the first '#' character
            const index = tokenContent.indexOf('#');
            const startContent = tokenContent.substring(index);
            setContent(prevContent => prevContent + startContent);
          }
        } else {
          setContent(prevContent => prevContent + tokenContent);
        }
      }
    } catch (e) {
      console.error('Failed to parse JSON:', e);
    }
  };
  const getStreamableText = () => {
    return streamBuffer;
  };

  return {
    streamChunks,
    addChunk,
    updateBuffer,
    getStreamableText,
    content,
    setContent,
  };
};

export default useChatStream;
