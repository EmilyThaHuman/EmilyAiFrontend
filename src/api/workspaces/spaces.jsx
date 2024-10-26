import { apiUtils } from '@/lib/apiUtils';
const baseUrl = '/chat/workspaces';
const baseUrlSpaceWithParams = params => baseUrl + `/${params}`;
const baseUrlSpace = () =>
  baseUrlSpaceWithParams(sessionStorage.getItem('workspaceId'));
const baseUrlSpaceFolder = () =>
  baseUrlSpaceWithParams(sessionStorage.getItem('workspaceId')) + '/folders';
export const workspacesApi = {
  // --- Workspace service ---
  getWorkspaces: async () => {
    try {
      const data = await apiUtils.get(baseUrl);
      return data;
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      throw error;
    }
  },
  getUserWorkspaces: async () => {
    try {
      const data = await apiUtils.get(
        `${baseUrl}/${encodeURIComponent(sessionStorage.getItem('userId'))}`
      );
      return data;
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      throw error;
    }
  },
  getWorkspace: async () => {
    let workspaceId = sessionStorage.getItem('workspaceId');
    if (!workspaceId) {
      const userStore = JSON.parse(localStorage.getItem('userStore'));
      sessionStorage.setItem('workspaceId', userStore.user.homeWorkspaceId);
      workspaceId === userStore.user.homeWorkspaceId;
    }
    try {
      const data = await apiUtils.get(
        `/chat/workspaces/${encodeURIComponent(workspaceId)}`
      );
      return data;
    } catch (error) {
      console.error(
        `Error fetching workspace with id ${encodeURIComponent(workspaceId)}:`,
        error
      );
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
  // --- Folders service ---
  createWorkspaceFolder: async folderData => {
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
  getItemsFolder: async props => {
    const { workspaceId, space } = props;
    try {
      const response = await apiUtils.get(
        `/chat/workspaces/${encodeURIComponent(workspaceId)}/folders/space/${space}`
      );
      console.log('RES', response);
      console.log('FOLDER', response.folder);
      return response.folder;
    } catch (error) {
      console.error(`Error fetching chat folders for space ${space}:`, error);
      throw error;
    }
  },
  getWorkspaceFoldersBySpace: async props => {
    const { workspaceId, space } = props;
    try {
      const response = await apiUtils.get(
        `/chat/workspaces/${encodeURIComponent(workspaceId)}/folders/space/${space}`
      );
      console.log('RES', response);
      console.log('FOLDERS_ARRAY', response.folders);
      console.log('ITEMS_ARRAY', response.allItems);
      const folder = response?.folders[0];
      const folderItems = response.allItems;
      return { folder, folderItems };
    } catch (error) {
      console.error(`Error fetching chat folders for space ${space}:`, error);
      throw error;
    }
  },
  deleteWorkspaceFolder: async props => {
    const { folderId } = props;
    try {
      const response = await apiUtils.delete(
        `/chat/workspaces/${encodeURIComponent(sessionStorage.getItem('workspaceId'))}/folders/${encodeURIComponent(folderId)}`
      );
      return response;
    } catch (error) {
      console.error(`Error deleting folder with id ${folderId}:`, error);
      throw error;
    }
  },
  // --- Spaces service ---
  getWorkspaceSpacesByWorkspaceId: async props => {
    const { workspaceId } = props;
    try {
      const response = await apiUtils.get(
        `/chat/workspaces/${encodeURIComponent(workspaceId)}/spaces`
      );
      console.log('RES', response);
      console.log('SPACES', response.spaces);
      return response.spaces;
    } catch (error) {
      console.error(
        `Error fetching spaces for workspace ${workspaceId}:`,
        error
      );
      throw error;
    }
  },
  // --- Sessions service ---
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
};

export default workspacesApi;
