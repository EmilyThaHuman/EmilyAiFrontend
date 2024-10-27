// api/Ai.js
/* eslint-disable no-constant-condition */
const REEDAI_ENDPOINT = 'http://localhost:3001';
const HOSTED_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted`;
const GEN_TEXT_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/generate-text`;
const GEN_TEXT_STREAM_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/generate-text-stream`;
const GEN_CHAT_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/chat-completion`;
const GEN_CHAT_STREAM_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/chat-completion-stream`;
const RAG_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/rag`;

export class ChatApiService {
  // TEXT Response
  static async generateText(prompt, apiKey) {
    const response = await fetch(GEN_TEXT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate text');
    }

    const data = await response.json();
    return data.result;
  }

  static async streamTextGeneration(prompt, apiKey, onData) {
    const response = await fetch(GEN_TEXT_STREAM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok || !response.body) {
      throw new Error('Failed to stream text generation');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let text = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      text += decoder.decode(value, { stream: true });
      onData(text);
    }

    return text;
  }

  // CHAT Response
  static async chatCompletion(messages, apiKey) {
    const response = await fetch(GEN_CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error('Failed to complete chat');
    }

    const data = await response.json();
    return data.result;
  }

  static async streamChatCompletion(messages, apiKey, onData) {
    const response = await fetch(GEN_CHAT_STREAM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok || !response.body) {
      throw new Error('Failed to stream chat completion');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let text = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      text += decoder.decode(value, { stream: true });
      onData(text);
    }

    return text;
  }

  // RAG Response
  static async ragQuery(query, vector, apiKey) {
    const response = await fetch(RAG_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query, vector }),
    });

    if (!response.ok) {
      throw new Error('Failed to perform RAG query');
    }

    const data = await response.json();
    return data.result;
  }
}

export default ChatApiService;
