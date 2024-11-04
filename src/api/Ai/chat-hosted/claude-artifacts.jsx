import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';

import { REEDAI_PROMPTS_LIBRARY } from '@/config/ai';

export const maxDuration = 60;

const models = {
  claude: 'claude',
  gpt4o: 'gpt-4o',
  gpt4oMini: 'gpt-4o-mini',
  gpt35turbo: 'gpt-3.5-turbo',
  gpt4turbo: 'gpt-4-turbo',
};

// Convert the map to an array of keys
const getListOfMapKeys = map => Object.keys(map);

// Function to get a value from the map by key
const getKeyMapValue = (map, key) => map[key];

// Function to find a prompt by name from an array of prompts
const getPromptList = () => {
  const list = getListOfMapKeys(REEDAI_PROMPTS_LIBRARY);
  return list;
};

// Function to get specific prompt from prompt lib
const getPrompt = key => {
  const prompt = getKeyMapValue(REEDAI_PROMPTS_LIBRARY, key);
  return prompt;
};

export async function POST(req) {
  const { messages, apiKey, model } = await req.json();

  let llm;
  let options = {};

  if (model === models.claude) {
    const anthropic = createAnthropic({
      apiKey,
    });

    llm = anthropic('claude-3-5-sonnet-20240620');

    options = {
      ...options,
      maxTokens: 8192,
      headers: {
        ...(options.headers || {}),
        'anthropic-beta': 'max-tokens-3-5-sonnet-2024-07-15',
      },
    };
  } else if (model.startsWith('gpt')) {
    const openai = createOpenAI({
      compatibility: 'strict', // strict mode, enable when using the OpenAI API
      apiKey,
    });

    llm = openai(model);
  }

  if (!llm) throw new Error(`Unsupported model: ${model}`);

  const initialMessages = messages.slice(0, -1);
  const currentMessage = messages[messages.length - 1];
  const attachments = currentMessage.experimental_attachments || [];
  const imageParts = attachments.map(file => ({
    type: 'image',
    image: new URL(file.url),
  }));

  const result = await streamText({
    model: llm,
    messages: [
      ...convertToCoreMessages(initialMessages),
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: currentMessage.content,
          },
          ...imageParts,
        ],
      },
    ],
    system: REEDAI_PROMPTS_LIBRARY.OPEN_ARTIFACTS_CREATOR,
    ...options,
  });

  return result.toDataStreamResponse();
}
