// loaders/workspaceLoader.js

import { userApi } from 'api/user';

export async function homeWorkspaceLoader() {
  try {
    const workspace = await userApi.getHomeWorkspace();
    if (!workspace) {
      throw new Response('Workspace Not Found', { status: 404 });
    }
    return { workspace };
  } catch (error) {
    throw new Response(error.message || 'Failed to load workspace', {
      status: error.status || 500,
    });
  }
}

export default homeWorkspaceLoader;
