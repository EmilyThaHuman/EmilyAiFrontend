import { chatApi } from 'api/Ai';

export async function chatSessionLoader({ params }) {
  const { sessionId } = params;
  try {
    const chat = await chatApi.getChatSession(sessionId);
    if (!chat) {
      throw new Error('Chat session not found');
    }
    return {
      chatSession: chat,
    };
  } catch (error) {
    throw new Response(error.message, { status: 404 });
  }
}

export default chatSessionLoader;
