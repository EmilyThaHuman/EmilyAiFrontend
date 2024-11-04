import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateRecommendations = async (
  context,
  userHistory = '',
  preferences = ''
) => {
  try {
    const response = await openai.createCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'Generate personalized recommendations based on the following context, history, and preferences.',
        },
        {
          role: 'user',
          content: `Context: ${context}\nHistory: ${userHistory}\nPreferences: ${preferences}`,
        },
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Recommendation generation error:', error);
    return { error: 'Failed to generate recommendations' };
  }
};

export default generateRecommendations;
