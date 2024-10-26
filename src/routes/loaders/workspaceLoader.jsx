// loaders/workspaceLoader.js
import { workspacesApi } from 'api/workspaces';

export async function workspaceLoader({ params }) {
  const { workspaceId } = params;

  try {
    const workspace = await workspacesApi.getWorkspace(workspaceId);
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

export default workspaceLoader;
