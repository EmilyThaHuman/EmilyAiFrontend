import { settingsApi } from 'api/Ai/chat-items';
import { assistantsApi, attachmentsApi, chatApi } from 'api/Ai/chat-sessions';
import { workspacesApi } from 'api/workspaces';

const deleteItemFromServer = async item => {
  try {
    if (item.isDirectory) {
      await workspacesApi.deleteFolder(item.id);
    } else {
      switch (item.metadata.space) {
        case 'files':
          await attachmentsApi.deleteFile(item.id);
          break;
        case 'prompts':
          await settingsApi.deletePrompt(item.id);
          break;
        case 'chatSessions':
          await chatApi.delete(item.id);
          break;
        case 'assistants':
          await assistantsApi.deleteAssistant(item.id);
          break;
        default:
          throw new Error(`Unknown space type: ${item.metadata.space}`);
      }
    }
  } catch (error) {
    throw new Error(`Failed to delete item: ${error.message}`);
  }
};

const updateItemOnServer = async (item, updates) => {
  try {
    if (item.isDirectory) {
      return await workspacesApi.updateFolder(item.id, updates);
    }

    switch (item.metadata.space) {
      case 'files':
        return await attachmentsApi.updateFile(item.id, updates);
      case 'prompts':
        return await settingsApi.updatePrompt(item.id, updates);
      case 'chatSessions':
        return await chatApi.update(item.id, updates);
      case 'assistants':
        return await assistantsApi.updateAssistant(item.id, updates);
      default:
        throw new Error(`Unknown space type: ${item.metadata.space}`);
    }
  } catch (error) {
    throw new Error(`Failed to update item: ${error.message}`);
  }
};

const moveItemOnServer = async (item, newParentId, newPath) => {
  try {
    const payload = {
      itemId: item.id,
      newParentId,
      newPath,
      space: item.metadata.space,
    };

    if (item.isDirectory) {
      return await workspacesApi.moveFolder(payload);
    }

    switch (item.metadata.space) {
      case 'files':
        return await attachmentsApi.moveFile(payload);
      case 'prompts':
        return await settingsApi.movePrompt(payload);
      case 'chatSessions':
        return await chatApi.moveSession(payload);
      case 'assistants':
        return await assistantsApi.moveAssistant(payload);
      default:
        throw new Error(`Unknown space type: ${item.metadata.space}`);
    }
  } catch (error) {
    throw new Error(`Failed to move item: ${error.message}`);
  }
};
