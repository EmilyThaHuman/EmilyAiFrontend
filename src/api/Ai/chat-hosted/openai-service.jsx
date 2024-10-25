/* eslint-disable no-constant-condition */
const REEDAI_ENDPOINT = 'http://localhost:3001';
const HOSTED_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted`;
const GEN_TEXT_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/generate-text`;
const GEN_TEXT_STREAM_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/generate-text-stream`;
const GEN_CHAT_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/chat-completion`;
const GEN_CHAT_STREAM_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/chat-completion-stream`;
const RAG_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/rag`;

export class ChatApiService {
  static async generateText(prompt) {
    const response = await fetch(GEN_TEXT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    return data.result;
  }

  static async streamTextGeneration(prompt, onData) {
    const response = await fetch(GEN_TEXT_STREAM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let text = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      text += decoder.decode(value, { stream: true });
      onData(text); // Use callback to update the UI as chunks arrive
    }

    return text;
  }

  static async chatCompletion(messages) {
    const response = await fetch(GEN_CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    return data.result;
  }

  static async streamChatCompletion(messages, onData) {
    const response = await fetch(GEN_CHAT_STREAM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let text = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      text += decoder.decode(value, { stream: true });
      onData(text); // Use callback to update the UI as chunks arrive
    }

    return text;
  }

  static async ragQuery(query, vector) {
    const response = await fetch(RAG_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, vector }),
    });

    const data = await response.json();
    return data.result;
  }
}

export default ChatApiService;
