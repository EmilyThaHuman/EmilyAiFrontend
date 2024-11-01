// src/components/chat/sidebar/hooks/useFileOperations.js

import { useCallback, useMemo, useState } from 'react';

import { settingsApi } from 'api/Ai';
import { attachmentsApi, assistantsApi, chatApi } from 'api/Ai/chat-sessions';
import { workspacesApi } from 'api/workspaces';

import { formatItems, getFolderData } from './treeUtils';

export const useFileOperations = (
  space,
  initialItems,
  initialFolders,
  dispatch
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const spaceToApiMap = useMemo(
    () => ({
      files: attachmentsApi.getAllStoredFiles,
      prompts: settingsApi.getPromptFiles,
      chatSessions: chatApi.getAll,
      assistants: assistantsApi.getExistingAssistants,
    }),
    []
  );

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const fetchFunction = spaceToApiMap[space];
      if (!fetchFunction) {
        throw new Error(`Invalid space type: ${space}`);
      }

      const workspaceId = sessionStorage.getItem('workspaceId');
      const folderItemData = await getFolderData(
        space,
        workspaceId,
        initialFolders,
        initialItems
      );

      const updatedItems = formatItems(
        folderItemData.folderItems,
        space,
        folderItemData.folders
      );

      console.log('Updated items:', updatedItems);
      dispatch({ type: 'SET_ITEMS', payload: updatedItems });
    } catch (error) {
      setError(`Error fetching ${space}: ${error.message}`);
      console.error(`Error fetching ${space}:`, error);
    } finally {
      setLoading(false);
    }
  }, [space, initialItems, initialFolders, dispatch, spaceToApiMap]);

  return { loading, error, fetchItems };
};

export default useFileOperations;
