import OpenAI from '@ai-sdk/openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const analyzeUserSentiment = async text => {
  try {
    const response = await openai.createCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Analyze the sentiment and key themes in this text',
        },
        { role: 'user', content: text },
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return { error: 'Failed to analyze sentiment' };
  }
};

export const getDeviceContext = async () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: {
      width: window.screen.width,
      height: window.screen.height,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    connectionType: navigator.connection
      ? navigator.connection.effectiveType
      : 'unknown',
  };
};

// Repeat similar structure for other tools like `searchKnowledgeBase`, `generateRecommendations`, etc.
