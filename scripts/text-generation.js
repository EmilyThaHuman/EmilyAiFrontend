// example.js

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
const openai = createOpenAI({
  // baseURL: 'https://api.openai.com/v1',
  apiKey:
    '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',
  // organization: getEnv('OPENAI_API_ORG_NAME'),
  // project: getEnv('OPENAI_API_PROJECT_NAME'),
  // compatibility: 'strict',
  // headers: {
  //   "X-Custom-Header": "custom-header-value"
  // },
  // name: "openai-node-client"
});
async function main() {
  const messages = [
    { role: 'user', content: 'generate a button compoent using material UI' },
  ];

  // Get a language model
  const model = openai('gpt-4o-mini');

  // Call the language model with the prompt
  const result = await generateText({
    model,
    messages,
    maxTokens: 1024,
    temperature: 0.7,
    topP: 1,
  });

  console.log(result.text);
}

main().catch(console.error);
