import { chatApi } from 'api/Ai';

export async function chatSessionLoader({ params }) {
  const { sessionId } = params;
  try {
    const chat = await chatApi.getChatSession(sessionId);
    if (!sessionId) {
      // Return a default chat session
      return {
        chatSession: {
          _id: 'default',
          messages: [],
          title: 'New Chat',
        },
      };
    }
    return {
      chatSession: chat,
    };
  } catch (error) {
    throw new Response(error.message, { status: 404 });
  }
}

export default chatSessionLoader;
