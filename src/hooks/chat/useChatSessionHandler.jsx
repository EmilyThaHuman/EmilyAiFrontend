import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { chatApi } from 'api/Ai/chat-sessions';
import { workspacesApi } from 'api/workspaces';
import { useChatStore } from 'contexts';
import { defaultChatSessionStoreData } from 'store/Slices/helpers';

export const useChatSessionHandler = () => {
  const navigate = useNavigate();
  const params = useParams();
  const {
    state: { sessionId, workspaceId, sessionHeader, workspaces },
    actions: {
      setSessionId,
      setSelectedChatSession,
      setWorkspaces,
      setSelectedWorkspace,
      setChatFileItems,
      syncChatMessages,
    },
  } = useChatStore();

  const handleCreateNewWorkspace = useCallback(
    async workspaceData => {
      try {
        const savedWorkspace = await workspacesApi.create(workspaceData);
        setWorkspaces([...workspaces, savedWorkspace]);
        setSelectedWorkspace(savedWorkspace);
        navigate(`/admin/workspaces/${params.workspaceId}}`);
      } catch (err) {
        console.error('Error saving workspace:', err);
      }
    },
    [
      navigate,
      params.workspaceId,
      setSelectedWorkspace,
      setWorkspaces,
      workspaces,
    ]
  );
  const handleGetSession = useCallback(async () => {
    try {
      if (!workspaceId) {
        throw new Error('Workspace ID not provided');
      }
      if (!sessionId) {
        throw new Error('Session ID not provided');
      }
      const response = await chatApi.getChatSessionByChatSessionId(
        workspaceId,
        sessionId
      );
      setSelectedChatSession(response);
      setSessionId(response._id);
      return response;
    } catch (error) {
      console.error('Error fetching session data:', error);
      throw error;
    }
  }, [sessionId, setSelectedChatSession, setSessionId, workspaceId]);
  const handleGetSessionMessages = useCallback(async () => {
    try {
      if (!sessionId) {
        return;
      }
      const response = await syncChatMessages(sessionId);
      if (!response) {
        return;
      }
      console.log('Session messages fetched:', response);
    } catch (error) {
      console.error('Error fetching session messages:', error);
    }
  }, [sessionId, syncChatMessages]);
  const handleCreateNewSession = useCallback(
    async (userId, apiKey) => {
      try {
        // Initialize a new chat session
        const newSessionData = {
          ...defaultChatSessionStoreData(),
          name: sessionHeader || 'New Chat Session',
          topic: sessionHeader || 'New Chat Session',
          userId,
          workspaceId,
          apiKey,
        };
        const data =
          await workspacesApi.createWorkspaceChatSession(newSessionData);
        const newSessionId = data.chatSession._id;
        setSessionId(newSessionId);
        navigate(`/admin/workspaces/${workspaceId}/chat/${newSessionId}`);
      } catch (err) {
        console.error('Failed to create new chat session:', err);
      }
    },
    [sessionHeader, setSessionId, workspaceId, navigate]
  );

  return {
    handleGetSession,
    handleGetSessionMessages,
    handleCreateNewSession,
    handleCreateNewWorkspace,
  };
};

export default useChatSessionHandler;
