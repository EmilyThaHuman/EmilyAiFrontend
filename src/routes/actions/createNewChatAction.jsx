// actions/createNewChatAction.js
import { Navigate } from 'react-router-dom';

import { chatApi } from 'api/Ai/chat-sessions';

export async function createNewChatAction({ request }) {
  const formData = await request.formData();
  const { topic, prompt, selectedComponent, temperature, useGPT4 } =
    Object.fromEntries(formData);

  // Basic validation (already handled by Formik/Yup, but adding server-side validation)
  if (!prompt || prompt.trim() === '') {
    return { errors: [{ message: 'Prompt is required.' }] };
  }

  try {
    // Generate chat title
    const title = await chatApi.generateChatTitle(prompt);

    if (!title) {
      return { errors: [{ message: 'Failed to generate chat title.' }] };
    }

    // Create chat session
    const newChat = await chatApi.createChatSession({
      title,
      prompt,
      selectedComponent,
      temperature: parseFloat(temperature),
      useGPT4: useGPT4 === 'true' || useGPT4 === true,
      sessionId: sessionStorage.getItem('sessionId'),
      workspaceId: sessionStorage.getItem('workspaceId'),
      userId: sessionStorage.getItem('userId'),
      clientApiKey: sessionStorage.getItem('apiKey'),
      newSession: true,
    });

    // Redirect to the new chat session
    return Navigate(
      `/admin/workspaces/${newChat.workspaceId}/chat/${newChat._id}`
    );
  } catch (error) {
    console.error('Error creating chat session:', error);
    return { errors: [{ message: error.message || 'Failed to create chat.' }] };
  }
}
