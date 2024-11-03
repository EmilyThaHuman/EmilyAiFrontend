import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const analyzeUserSentiment = async text => {
  try {
    // Simplified sentiment analysis
    const response = await openai.createCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Analyze the sentiment and key themes in this text',
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return { error: 'Failed to analyze sentiment' };
  }
};
