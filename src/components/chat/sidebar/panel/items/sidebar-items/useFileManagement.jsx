import _ from 'lodash';
import React, { useState, useCallback } from 'react';
import { attachmentsApi } from 'api/Ai/chat-sessions';
import { workspacesApi } from 'api/workspaces';

export const useFileManagement = (
  space,
  fileStructure,
  setFileStructure,
  addNewMessageFile,
  updateNewMessageFile,
  refreshFileStructure,
  newFileDialog,
  newFolderDialog
) => {
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [fileNameError, setFileNameError] = useState('');
  const [folderNameError, setFolderNameError] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');

  const validateName = useCallback(
    (name, type) => {
      const existingNames = fileStructure.map(item => item.name.toLowerCase());
      return existingNames.includes(name.toLowerCase())
        ? `A ${type} with this name already exists.`
        : '';
    },
    [fileStructure]
  );

  const handleNewFileNameChange = e => {
    const value = e.target.value;
    setNewFileName(value);
    setFileNameError(
      value ? validateName(value, 'file') : 'File name is required'
    );
  };

  const handleNewFolderNameChange = e => {
    const value = e.target.value;
    setNewFolderName(value);
    setFolderNameError(validateName(value, 'folder'));
  };

  const handleCreateNewFile = async selectedFolderId => {
    if (newFileName && fileToUpload) {
      try {
        const folderId = selectedFolderId || null; // Use the selected folder ID

        let relativePath = '/';
        if (folderId) {
          const folder = fileStructure.find(item => item.id === folderId);
          if (folder) {
            relativePath = folder.path ? `${folder.path}/` : '/';
          }
        }
        relativePath += newFileName;
        const uploadedFile = await attachmentsApi.uploadFile(fileToUpload, {
          name: newFileName,
          userId: sessionStorage.getItem('userId'),
          workspaceId: sessionStorage.getItem('workspaceId'),
          folderId: folderId,
          fileId: 'local',
          space: space.toLowerCase(),
          contentType: fileToUpload.type,
          size: fileToUpload.size,
          relativePath: relativePath,
        });
        console.log('uploadedFile', uploadedFile);
        const newFile = {
          ...uploadedFile,
          id: uploadedFile._id,
          name: newFileName,
          type: uploadedFile.type,
          path: uploadedFile.path,
          relativePath: relativePath,
        };

        addNewMessageFile(newFile);
        const createdFile = await attachmentsApi.createFile(newFile);
        updateNewMessageFile({ ...createdFile, id: createdFile._id });

        setFileStructure(prev => {
          if (folderId) {
            return prev.map(item =>
              item.id === folderId && item.type === 'folder'
                ? { ...item, children: [...item.children, newFile] }
                : item
            );
          } else {
            return [...prev, newFile];
          }
        });
        setNewFileName('');
        setFileToUpload(null);
        newFileDialog.handleClose();
      } catch (error) {
        console.error('Error creating new file:', error);
      }
    }
  };

  const handleCreateNewFolder = async selectedFolderId => {
    if (newFolderName) {
      try {
        const folderId = selectedFolderId || null; // Use the selected folder ID

        const folderData = {
          // id: _.uniqueId('folder_'),
          name: newFolderName,
          type: space.toLowerCase(),
          itemType: [],
          items: [],
          children: [],
          parentFolderId: folderId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: sessionStorage.getItem('userId'),
          workspaceId: sessionStorage.getItem('workspaceId'),
          space: space.toLowerCase(),
          path: `/${newFolderName}`,
          level: 0,
        };
        const newFolder = await workspacesApi.createWorkspaceFolder(folderData);
        setFileStructure(prev => {
          if (folderId) {
            return prev.map(item =>
              item.id === folderId && item.type === 'folder'
                ? { ...item, children: [...item.children, newFolder] }
                : item
            );
          } else {
            return [...prev, newFolder];
          }
        });
        newFolderDialog.handleClose();
        setNewFolderName('');
      } catch (error) {
        console.error('Failed to create folder:', error);
      }
    }
  };

  return {
    newFileName,
    newFolderName,
    fileToUpload,
    fileNameError,
    folderNameError,
    selectedFolder,
    selectedFolderId,
    setSelectedFolder,
    setSelectedFolderId,
    setNewFileName,
    setNewFolderName,
    setFileToUpload,
    handleNewFileNameChange,
    handleNewFolderNameChange,
    handleCreateNewFile,
    handleCreateNewFolder,
  };
};

export default useFileManagement;
