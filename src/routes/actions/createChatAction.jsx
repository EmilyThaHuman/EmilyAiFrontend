// actions/createChatAction.js
import { redirect } from 'react-router-dom';

import { chatApi } from 'api/Ai/chat-sessions';

export async function createChatAction({ request }) {
  const formData = await request.formData();
  const firstPrompt = formData.get('firstPrompt');

  if (!firstPrompt || firstPrompt.trim() === '') {
    return { errors: [{ message: 'First prompt is required.' }] };
  }

  try {
    const title = await chatApi.generateChatTitle(firstPrompt);

    if (!title) {
      return { errors: [{ message: 'Failed to generate chat title.' }] };
    }

    const newChat = await chatApi.createChatSession({
      title,
      firstPrompt,
      sessionId: sessionStorage.getItem('sessionId'),
      workspaceId: sessionStorage.getItem('workspaceId'),
      regenerate: false,
      prompt: firstPrompt,
      userId: sessionStorage.getItem('userId'),
      clientApiKey: sessionStorage.getItem('apiKey'),
      newSession: true,
    });

    return redirect(`/admin/workspaces/home/chat/${newChat.id}`);
  } catch (error) {
    return { errors: [{ message: error.message }] };
  }
}
