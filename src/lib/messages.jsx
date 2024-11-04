import { FragmentSchema } from '../schema';
import { DeepPartial } from 'ai';

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
