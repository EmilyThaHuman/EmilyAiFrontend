import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import axios from 'axios';
import { marked } from 'marked';

import { promptGenTemplate } from '@/lib/chat-utils';

export const generatePrompt = async (prompt, apiKey) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 1500,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating prompt:', error);
    throw error;
  }
};

const openAiApiService = {
  getHostedCompletion: async prompt => {
    const response = await fetch('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].text.trim();
  },
  getHostedStreamCompletion: async () => {
    const messages = [{ role: 'user', content: 'Hello' }];

    // Get a language model
    const model = openai('gpt-4o');

    // Call the language model with the prompt
    const result = await generateText({
      model,
      messages,
      maxTokens: 1024,
      temperature: 0.7,
      topP: 1,
    });

    console.log(result.text);
  },
  generateTitle: async messages => {
    const concatenatedMessages = messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('apiKey')}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'Generate a short, concise title (3-5 words) for this conversation based on its main topic.',
              },
              { role: 'user', content: concatenatedMessages },
            ],
            max_tokens: 15,
          }),
        }
      );

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating title:', error);
      return 'New Chat';
    }
  },
  // generatePrompt: async (userInput, apiKey) => {
  //   const configuration = new Configuration({
  //     apiKey: apiKey,
  //   });
  //   const openai = new OpenAIApi(configuration);

  //   try {
  //     const completion = await openai.createChatCompletion({
  //       model: 'gpt-3.5-turbo',
  //       messages: [
  //         { role: 'system', content: promptGenTemplate },
  //         { role: 'user', content: userInput },
  //       ],
  //     });

  //     const aiResponse = completion.data.choices[0].message.content;
  //     const htmlContent = marked(aiResponse);

  //     return htmlContent;
  //   } catch (error) {
  //     console.error('Error calling OpenAI API:', error);
  //     throw error;
  //   }
  // },
  generatePromptAda: async () => {
    const apiKey = sessionStorage.getItem('apiKey');
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003',
          prompt: promptGenTemplate,
          max_tokens: 1500,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error generating prompt:', error);
      throw error;
    }
  },
  generateSystemPrompt: async () => {
    const apiKey = sessionStorage.getItem('apiKey');
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003',
          prompt: promptGenTemplate,
          max_tokens: 1500,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error generating system prompt:', error);
      throw error;
    }
  },
};
