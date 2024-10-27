import _ from 'lodash';
import React, { useState, useCallback, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { SidebarManagerContainer } from 'components/chat/styled';
import { useChatStore } from 'contexts/ChatProvider';
import { useFileProcesser } from 'hooks/chat';
import { useFileStructure } from 'hooks/chat/useFileStructure';
import { useDialog } from 'hooks/ui';

import { NewFileDialog, NewFolderDialog } from './file-manager-components';
import { FileTree } from './FileTree';
import { SidebarActions } from './SidebarActions';
import { useFileEditor } from './useFileEditor';
import { useFileManagement } from './useFileManagement';

export const FileManagementSidebar = props => {
  const { initialFolders, initialFiles, space } = props;
  const {
    fileStructure,
    isLoading,
    error,
    refreshFileStructure,
    setFileStructure,
  } = useFileStructure(space);
  const fileEditor = useFileEditor();
  const [expandedFolders, setExpandedFolders] = useState({});
  const newFileDialog = useDialog();
  const newFolderDialog = useDialog();
  const [files, setFiles] = useState(initialFiles || []);
  const { handleSelectDeviceFile, fileInputRef } = useFileProcesser();
  const {
    actions: { addNewMessageFile, updateNewMessageFile },
  } = useChatStore();
  const fileManagement = useFileManagement(
    space,
    fileStructure,
    setFileStructure,
    addNewMessageFile,
    updateNewMessageFile,
    newFileDialog,
    newFolderDialog
  );
  const handleNewFile = useCallback(() => {
    newFileDialog.handleOpen();
    fileManagement.setNewFileName('');
    fileManagement.setFileToUpload(null);
  }, [newFileDialog, fileManagement]);

  const handleNewFolder = useCallback(() => {
    newFolderDialog.handleOpen();
  }, [newFolderDialog]);

  const handleFileUpload = useCallback(
    async event => {
      const file = event.target.files?.[0];
      if (file && !files.find(f => f.name === file.name)) {
        fileManagement.setFileToUpload(file);
        fileManagement.setNewFileName(file.name);
        await handleSelectDeviceFile(file, false);
      }
    },
    [files, fileManagement, handleSelectDeviceFile]
  );
  const toggleFolder = useCallback(
    folderId => {
      const focusedFolder = initialFolders.find(
        folder => folder.id === folderId
      );
      fileManagement.setSelectedFolder(focusedFolder);
      fileManagement.setSelectedFolderId(folderId); // Track selected folder
      setExpandedFolders(prev => ({
        ...prev,
        [folderId]: !prev[folderId],
      }));
    },
    [initialFolders, fileManagement]
  );
  const memoizedFileTree = useMemo(
    () => (
      <FileTree
        fileStructure={fileStructure}
        expandedFolders={expandedFolders}
        toggleFolder={toggleFolder}
        {...fileEditor}
        setFileStructure={setFileStructure}
      />
    ),
    [fileStructure, expandedFolders, toggleFolder, fileEditor, setFileStructure]
  );
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <SidebarManagerContainer>
        <SidebarActions
          handleNewFile={handleNewFile}
          handleNewFolder={handleNewFolder}
          space={space}
        />
        {memoizedFileTree}
        {/* File Creation Dialog */}
        <NewFileDialog
          newFileDialog={newFileDialog}
          handleCloseNewFileDialog={() => {
            newFileDialog.handleClose();
            fileManagement.setNewFileName('');
          }}
          newFileName={fileManagement.newFileName}
          setNewFileName={fileManagement.setNewFileName}
          fileInputRef={fileInputRef}
          existingNames={files.map(f => f.name)}
          handleFileUpload={handleFileUpload}
          handleNewFileNameChange={fileManagement.handleNewFileNameChange}
          fileNameError={fileManagement.fileNameError}
          handleCreateNewFile={fileManagement.handleCreateNewFile}
          fileToUpload={fileManagement.fileToUpload}
          space={space}
        />
        <NewFolderDialog
          newFolderDialog={newFolderDialog}
          handleCloseNewFolderDialog={() => {
            newFolderDialog.handleClose();
            fileManagement.setNewFolderName('');
          }}
          newFolderName={fileManagement.newFolderName}
          handleNewFolderNameChange={fileManagement.handleNewFolderNameChange}
          folderNameError={fileManagement.folderNameError}
          handleCreateNewFolder={fileManagement.handleCreateNewFolder}
          space={space}
        />
      </SidebarManagerContainer>
    </DndProvider>
  );
};

export default FileManagementSidebar;
// const updateFileTreeStructure = useCallback(updatedStructure => {
//   setFileStructure(prevStructure => {
//     const newStructure = _.cloneDeep(prevStructure);
//     _.merge(newStructure, updatedStructure);
//     return newStructure;
//   });
// }, []);
// const moveItem = useCallback((fromPath, toPath) => {
//   setFileStructure(prevStructure => {
//     const newStructure = JSON.parse(JSON.stringify(prevStructure));
//     const fromPathArray = fromPath.split('.');
//     const toPathArray = toPath.split('.');

//     const getItemAtPath = (structure, path) => {
//       return path.reduce((acc, key) => {
//         if (acc && typeof acc === 'object') {
//           return acc.children ? acc.children[key] : acc[key];
//         }
//         return undefined;
//       }, structure);
//     };

//     const removeItemAtPath = (structure, path) => {
//       const parent = getItemAtPath(structure, path.slice(0, -1));
//       if (parent && Array.isArray(parent.children)) {
//         const index = parseInt(path[path.length - 1]);
//         parent.children.splice(index, 1);
//       } else if (Array.isArray(structure)) {
//         const index = parseInt(path[path.length - 1]);
//         structure.splice(index, 1);
//       }
//     };

//     const insertItemAtPath = (structure, path, item) => {
//       const parent = getItemAtPath(structure, path.slice(0, -1));
//       if (parent) {
//         if (!parent.children) parent.children = [];
//         const index = parseInt(path[path.length - 1]);
//         parent.children.splice(index, 0, item);
//       } else if (Array.isArray(structure)) {
//         const index = parseInt(path[path.length - 1]);
//         structure.splice(index, 0, item);
//       }
//     };

//     const item = getItemAtPath(newStructure, fromPathArray);
//     if (item) {
//       removeItemAtPath(newStructure, fromPathArray);
//       insertItemAtPath(newStructure, toPathArray, item);
//     }

//     return newStructure;
//   });
// }, []);
// const handleCreateNewFile = async () => {
//   if (newFileName && fileToUpload) {
//     try {
//       const firstFolder = fileStructure.find(item => item.type === 'folder');
//       const folderId =
//         selectedFolderId || (firstFolder ? firstFolder.id : null);
//       const uploadedFile = await attachmentsApi.uploadFile(fileToUpload, {
//         name: newFileName,
//         userId: sessionStorage.getItem('userId'),
//         workspaceId: sessionStorage.getItem('workspaceId'),
//         folderId: folderId,
//         fileId: 'local',
//         space: space.toLowerCase(),
//         contentType: fileToUpload.type,
//         size: fileToUpload.size,
//         relativePath:
//       });
//       console.log('uploadedFile', uploadedFile);
//       const newFile = {
//         ...uploadedFile,
//         id: uploadedFile._id,
//         name: newFileName,
//         type: uploadedFile.type,
//         path: uploadedFile.path,
//       };

//       addNewMessageFile(newFile);
//       const createdFile = await attachmentsApi.createFile(newFile);
//       updateNewMessageFile({ ...createdFile, id: createdFile._id });

//       setFileStructure(prev => [
//         ...prev,
//         { id: createdFile._id, name: createdFile.name, type: 'file' },
//       ]);

//       refreshFileStructure();
//       newFileDialog.handleClose();
//       setNewFileName('');
//       setFileToUpload(null);
//     } catch (error) {
//       console.error('Error creating new file:', error);
//     }
//   }
// };
