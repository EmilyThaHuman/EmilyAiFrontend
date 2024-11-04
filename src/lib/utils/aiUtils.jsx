import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createVertex } from '@ai-sdk/google-vertex';
import { createMistral } from '@ai-sdk/mistral';
import { createOpenAI } from '@ai-sdk/openai';
import { DeepPartial } from 'ai';
import { createOllama } from 'ollama-ai-provider';
import PropTypes from 'prop-types';
import { FragmentSchema } from './schema';
import { ExecutionResult } from './types';

/**
 * @typedef {Object} MessageText
 * @property {'text'} type - Type identifier for text messages
 * @property {string} text - The text content
 */

/**
 * @typedef {Object} MessageCode
 * @property {'code'} type - Type identifier for code messages
 * @property {string} text - The code content
 */

/**
 * @typedef {Object} MessageImage
 * @property {'image'} type - Type identifier for image messages
 * @property {string} image - The image content
 */

/**
 * @typedef {Object} Message
 * @property {'assistant' | 'user'} role - The role of the message sender
 * @property {Array<MessageText | MessageCode | MessageImage>} content - Array of message content
 * @property {DeepPartial<FragmentSchema>} [object] - Optional fragment schema
 * @property {ExecutionResult} [result] - Optional execution result
 */

/**
 * Converts messages to AI SDK format
 * @param {Message[]} messages - Array of messages to convert
 * @returns {Array<{role: string, content: Array<MessageText | MessageImage>}>}
 */
export function toAISDKMessages(messages) {
  return messages.map(message => ({
    role: message.role,
    content: message.content.map(content => {
      if (content.type === 'code') {
        return {
          type: 'text',
          text: content.text,
        };
      }
      return content;
    }),
  }));
}

/**
 * Converts files to base64 encoded image messages
 * @param {File[]} files - Array of files to convert
 * @returns {Promise<string[]>} Array of base64 encoded image strings
 */
export async function toMessageImage(files) {
  if (files.length === 0) {
    return [];
  }
  return Promise.all(
    files.map(async file => {
      const base64 = Buffer.from(await file.arrayBuffer()).toString('base64');
      return `data:${file.type};base64,${base64}`;
    })
  );
}

/**
 * @param {Object} model - The LLM model configuration
 * @param {string} model.id - Model identifier
 * @param {string} model.name - Model name
 * @param {string} model.provider - Provider name
 * @param {string} model.providerId - Provider identifier
 * @param {Object} config - Configuration options
 * @param {string} [config.model] - Model name
 * @param {string} [config.apiKey] - API key
 * @param {string} [config.baseURL] - Base URL
 * @param {number} [config.temperature] - Temperature
 * @param {number} [config.topP] - Top P
 * @param {number} [config.topK] - Top K
 * @param {number} [config.frequencyPenalty] - Frequency penalty
 * @param {number} [config.presencePenalty] - Presence penalty
 * @param {number} [config.maxTokens] - Maximum tokens
 */
export function getModelClient(model, config) {
  const { id: modelNameString, providerId } = model;
  const { apiKey, baseURL } = config;

  const providerConfigs = {
    anthropic: () => createAnthropic({ apiKey, baseURL })(modelNameString),
    openai: () => createOpenAI({ apiKey, baseURL })(modelNameString),
    google: () =>
      createGoogleGenerativeAI({ apiKey, baseURL })(modelNameString),
    mistral: () => createMistral({ apiKey, baseURL })(modelNameString),
    groq: () =>
      createOpenAI({
        apiKey: apiKey || process.env.GROQ_API_KEY,
        baseURL: baseURL || 'https://api.groq.com/openai/v1',
      })(modelNameString),
    togetherai: () =>
      createOpenAI({
        apiKey: apiKey || process.env.TOGETHER_API_KEY,
        baseURL: baseURL || 'https://api.together.xyz/v1',
      })(modelNameString),
    ollama: () => createOllama({ baseURL })(modelNameString),
    fireworks: () =>
      createOpenAI({
        apiKey: apiKey || process.env.FIREWORKS_API_KEY,
        baseURL: baseURL || 'https://api.fireworks.ai/inference/v1',
      })(modelNameString),
    vertex: () =>
      createVertex({
        googleAuthOptions: {
          credentials: JSON.parse(
            process.env.GOOGLE_VERTEX_CREDENTIALS || '{}'
          ),
        },
      })(modelNameString),
    xai: () =>
      createOpenAI({
        apiKey: apiKey || process.env.XAI_API_KEY,
        baseURL: baseURL || 'https://api.x.ai/v1',
      })(modelNameString),
  };

  const createClient = providerConfigs[providerId];
  if (!createClient) {
    throw new Error(`Unsupported provider: ${providerId}`);
  }
  return createClient();
}

/**
 * Get default mode for a given model
 * @param {Object} model - The LLM model configuration
 * @param {string} model.id - Model identifier
 * @param {string} model.providerId - Provider identifier
 * @returns {string} The default mode
 */
export function getDefaultMode(model) {
  const { id: modelNameString, providerId } = model;
  // monkey patch fireworks
  if (providerId === 'fireworks') {
    return 'json';
  }
  return 'auto';
}

export const convertFileToBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export function parseMessage(message) {
  const parts = [];
  let currentPart = null;
  let buffer = '';
  let i = 0;

  while (i < message.length) {
    const char = message[i];

    if (char === '<' && !currentPart) {
      if (buffer.trim()) {
        parts.push({ type: 'text', data: buffer.trim() });
        buffer = '';
      }

      const tagEnd = message.indexOf('>', i);
      if (tagEnd === -1) {
        buffer += char;
        i++;
        continue;
      }

      const tag = message.slice(i + 1, tagEnd);
      if (tag.startsWith('thinking')) {
        currentPart = { type: 'thought', data: '' };
        i = tagEnd + 1;
      } else if (tag.startsWith('artifact')) {
        const data = {
          generating: true,
          id: null,
          type: null,
          title: null,
          content: '',
          language: null,
        };
        const attributeRegex = /(\w+)="([^"]*)"/g;
        let match;
        while ((match = attributeRegex.exec(tag)) !== null) {
          const [, key, value] = match;
          if (key === 'identifier') data.id = value;
          else if (key === 'type') data.type = value;
          else if (key === 'title') data.title = value;
          else if (key === 'language') data.language = value;
        }
        currentPart = { type: 'artifact', data };
        i = tagEnd + 1;
      } else {
        buffer += char;
        i++;
      }
    } else if (currentPart) {
      const closingTag =
        currentPart.type === 'thought' ? '</thinking>' : '</artifact>';
      const closingIndex = message.indexOf(closingTag, i);

      if (closingIndex !== -1) {
        const content = message.slice(i, closingIndex);
        if (currentPart.type === 'thought') {
          currentPart.data = content;
        } else if (currentPart.type === 'artifact' && currentPart.data) {
          currentPart.data.content = content;
          currentPart.data.generating = false;
        }
        parts.push(currentPart);
        currentPart = null;
        i = closingIndex + closingTag.length;
      } else {
        const remainingContent = message.slice(i);
        if (currentPart.type === 'thought') {
          currentPart.data = remainingContent;
        } else if (currentPart.type === 'artifact' && currentPart.data) {
          currentPart.data.content = remainingContent;
        }
        parts.push(currentPart);
        break;
      }
    } else {
      buffer += char;
      i++;
    }
  }

  if (buffer.trim()) {
    parts.push({ type: 'text', data: buffer.trim() });
  }

  return combineTextParts(parts);
}

export function combineTextParts(parts) {
  const combinedParts = [];
  let currentTextContent = '';

  for (const part of parts) {
    if (part.type === 'text') {
      currentTextContent += (currentTextContent ? ' ' : '') + part.data;
    } else {
      if (currentTextContent) {
        combinedParts.push({ type: 'text', data: currentTextContent });
        currentTextContent = '';
      }
      combinedParts.push(part);
    }
  }

  if (currentTextContent) {
    combinedParts.push({ type: 'text', data: currentTextContent });
  }

  return combinedParts;
}

convertFileToBase64.propTypes = {
  file: PropTypes.instanceOf(File).isRequired,
};

parseMessage.propTypes = {
  message: PropTypes.string.isRequired,
};
