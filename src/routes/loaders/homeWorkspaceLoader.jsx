// loaders/workspaceLoader.js

import { userApi } from 'api/user';

export async function homeWorkspaceLoader() {
  try {
    const workspace = await userApi.getHomeWorkspace();
    if (!workspace) {
      // Return a default workspace or redirect
      return {
        workspace: {
          _id: 'default',
          name: 'Default Workspace',
          folders: [],
          chatSessions: [],
          assistants: [],
          prompts: [],
          tools: [],
        },
      };
    }
    return { workspace };
  } catch (error) {
    throw new Response(error.message || 'Failed to load workspace', {
      status: error.status || 500,
    });
  }
}

export default homeWorkspaceLoader;
