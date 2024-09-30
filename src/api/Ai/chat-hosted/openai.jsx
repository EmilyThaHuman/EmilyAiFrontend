import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

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
};
