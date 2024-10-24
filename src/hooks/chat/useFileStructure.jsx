import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

import { attachmentsApi } from 'api/Ai/chat-sessions';
import { workspacesApi } from 'api/workspaces';

export const useFileStructure = space => {
  const [fileStructure, setFileStructure] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAndOrganizeFileStructure = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentSpace = space.toLowerCase();
      const workspaceId = sessionStorage.getItem('workspaceId');

      const [workspaceFolders, storedFiles] = await Promise.all([
        workspacesApi.getWorkspaceFoldersBySpace({
          workspaceId,
          space,
        }),
        attachmentsApi.getStoredFilesBySpace(space),
      ]);

      const fileDirectory = workspaceFolders.map(folder => {
        const folderItems = [
          ...storedFiles.filter(file => file.metadata.folderId === folder._id),
        ];

        if (folder.files && folder.files.length > 0)
          folderItems.push(...folder.files);
        if (folder.prompts && folder.prompts.length > 0)
          folderItems.push(...folder.prompts);
        if (folder.assistants && folder.assistants.length > 0)
          folderItems.push(...folder.assistants);
        if (folder.collections && folder.collections.length > 0)
          folderItems.push(...folder.collections);
        if (folder.tools && folder.tools.length > 0)
          folderItems.push(...folder.tools);
        if (folder.models && folder.models.length > 0)
          folderItems.push(...folder.models);
        if (folder.chatSessions && folder.chatSessions.length > 0)
          folderItems.push(...folder.chatSessions);

        return {
          id: folder._id,
          name: folder.name,
          type: 'folder',
          children: folderItems.map(item => ({
            ...item,
            name: item.name || item.filename,
            type: getItemType(item),
          })),
        };
      });

      const rootItems = [
        ...storedFiles.filter(
          file => !file.metadata.folderId || file.metadata.folderId === ''
        ),
        ...workspaceFolders
          .flatMap(folder => [
            ...(folder.files || []),
            ...(folder.prompts || []),
            ...(folder.assistants || []),
            ...(folder.collections || []),
            ...(folder.tools || []),
            ...(folder.models || []),
            ...(folder.chatSessions || []),
          ])
          .filter(item => !item.folderId || item.folderId === ''),
      ];

      const rootItemsMapped = rootItems.map(item => ({
        ...item,
        name: item.name || item.filename,
        type: getItemType(item),
      }));

      setFileStructure([...fileDirectory, ...rootItemsMapped]);
    } catch (err) {
      setError(
        err.message || 'An error occurred while fetching file structure'
      );
    } finally {
      setIsLoading(false);
    }
  }, [space]);

  useEffect(() => {
    fetchAndOrganizeFileStructure();
  }, [fetchAndOrganizeFileStructure]);

  const refreshFileStructure = useCallback(() => {
    fetchAndOrganizeFileStructure();
  }, [fetchAndOrganizeFileStructure]);

  const getItemType = item => {
    if (item.type) return item.type;
    if (item.filename) return 'file';
    if (item.prompt) return 'prompt';
    if (item.assistant) return 'assistant';
    if (item.collection) return 'collection';
    if (item.tool) return 'tool';
    if (item.model) return 'model';
    if (item.chatSession) return 'chatSession';
    return 'unknown';
  };

  const addFile = useCallback(async (file, folderId = null) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderId', folderId);

      const response = await axios.post('/api/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFileStructure(prevStructure => {
        const newFile = { ...response.data, type: 'file' };
        if (folderId) {
          return prevStructure.map(item =>
            item.id === folderId && item.type === 'folder'
              ? { ...item, children: [...item.children, newFile] }
              : item
          );
        } else {
          return [...prevStructure, newFile];
        }
      });
    } catch (err) {
      setError('Failed to add file');
    }
  }, []);

  const addFolder = useCallback(async folderName => {
    try {
      const response = await axios.post('/api/folders', { name: folderName });
      setFileStructure(prevStructure => [
        ...prevStructure,
        { ...response.data, type: 'folder', children: [] },
      ]);
    } catch (err) {
      setError('Failed to add folder');
    }
  }, []);

  const deleteItem = useCallback(async (itemId, itemType) => {
    try {
      await axios.delete(`/api/${itemType}s/${itemId}`);
      setFileStructure(prevStructure =>
        prevStructure.filter(item => item.id !== itemId)
      );
    } catch (err) {
      setError(`Failed to delete ${itemType}`);
    }
  }, []);

  const moveItem = useCallback(async (itemId, targetFolderId) => {
    try {
      await axios.patch(`/api/files/${itemId}`, { folderId: targetFolderId });
      setFileStructure(prevStructure => {
        const item = prevStructure.find(i => i.id === itemId);
        const newStructure = prevStructure.filter(i => i.id !== itemId);
        const targetFolder = newStructure.find(f => f.id === targetFolderId);
        if (targetFolder) {
          targetFolder.children = [...targetFolder.children, item];
        } else {
          newStructure.push(item);
        }
        return newStructure;
      });
    } catch (err) {
      setError('Failed to move item');
    }
  }, []);

  return {
    fileStructure,
    setFileStructure,
    isLoading,
    error,
    refreshFileStructure,
    addFile,
    addFolder,
    deleteItem,
    moveItem,
  };
};

export default useFileStructure;
