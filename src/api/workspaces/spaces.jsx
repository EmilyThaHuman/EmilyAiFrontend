import { apiUtils } from '@/lib/apiUtils';

export const workspacesApi = {
  getWorkspaceFoldersBySpace: async props => {
    const { workspaceId, space } = props;
    try {
      const response = await apiUtils.get(
        `/chat/workspaces/${encodeURIComponent(workspaceId)}/folders/space/${space}`
      );
      console.log('RES', response);
      console.log('FOLDERS', response.folders);
      console.log('WORKSPACE', response.workspace);
      return response.folders;
      // const data = await apiUtils.get(`/chat/spaces/${space}/folders`);
    } catch (error) {
      console.error(`Error fetching chat folders for space ${space}:`, error);
      throw error;
    }
  },
  getWorkspaceSessionsByWorkspaceId: async props => {
    const { workspaceId, userId } = props;
    try {
      const response = await apiUtils.get(
        `/chat/workspaces/${encodeURIComponent(workspaceId)}/chatSessions`
      );
      console.log('RES', response);
      console.log('CHATSESSIONS', response.chatSessions);
      console.log('WORKSPACE', response.workspace);
      return response.chatSessions;
    } catch (error) {
      console.error(
        `Error fetching chat sessions for workspace ${workspaceId}:`,
        error
      );
      throw error;
    }
  },
  createWorkspaceChatSession: async props => {
    const { sessionData } = props;

    try {
      const response = await apiUtils.post(
        `/chat/workspaces/${encodeURIComponent(sessionStorage.getItem('workspaceId'))}/chatSessions`,
        {
          userId: sessionStorage.getItem('userId'),
          sessionData: sessionData,
        }
      );
      return response;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  },
  createWorkspaceFolder: async folderData => {
    // const { folderData } = props;
    try {
      const response = await apiUtils.post(
        `/chat/workspaces/${encodeURIComponent(sessionStorage.getItem('workspaceId'))}/folders`,
        {
          folderData: folderData,
          userId: sessionStorage.getItem('userId'),
        }
      );
      return response;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  },
  syncFolders: async props => {
    const { folders } = props;
    try {
      const response = await apiUtils.put(
        `/chat/workspaces/${encodeURIComponent(sessionStorage.getItem('workspaceId'))}/folders`,
        { folders }
      );
      return response;
    } catch (error) {
      console.error('Error syncing folders:', error);
      throw error;
    }
  },
  create: async workspaceData => {
    try {
      const data = await apiUtils.post(
        '/chat/workspaces/create',
        workspaceData
      );
      return data;
    } catch (error) {
      console.error('Error creating workspace:', error);
      throw error;
    }
  },
  update: async props => {
    const { workspaceId, workspaceData } = props;
    try {
      const data = await apiUtils.put(
        `/chat/workspaces/${encodeURIComponent(workspaceId)}`,
        workspaceData
      );
      return data;
    } catch (error) {
      console.error(
        `Error updating workspace with id ${encodeURIComponent(workspaceId)}:`,
        error
      );
      throw error;
    }
  },
  delete: async props => {
    const { workspaceId } = props;
    try {
      const data = await apiUtils.delete(
        `/chat/workspaces/${encodeURIComponent(workspaceId)}`
      );
      return data;
    } catch (error) {
      console.error(
        `Error deleting workspace with id ${encodeURIComponent(workspaceId)}:`,
        error
      );
      throw error;
    }
  },
};

export default workspacesApi;
