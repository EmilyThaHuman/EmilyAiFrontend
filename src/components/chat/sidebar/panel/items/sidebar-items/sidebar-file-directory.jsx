import { Box, Grid, Typography } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { settingsApi } from 'api/Ai/chat-items';
import { assistantsApi, attachmentsApi, chatApi } from 'api/Ai/chat-sessions';
import { workspacesApi } from 'api/workspaces';
import { SidebarManagerContainer } from 'components/chat/styled';
import { Spinner } from 'components/themed';
import { INITIAL_STATE } from 'config/data-configs/fileTree';
import { useFileProcesser } from 'hooks/chat';
import { useDialog } from 'hooks/ui';
import { generateTempFileName } from 'utils/format';

import { CreateItemDialog } from './components/create-item-dialog';
import { SidebarActions } from './components/sidebar-actions';
import { ErrorDisplay } from './components/sidebar-error';
import { FileDirectoryErrorBoundary } from './components/sidebar-error-boundary';
import { SearchField } from './components/sidebar-search-field';
import {
  updateItemInTree,
  handleFileUpload,
  buildItemMap,
} from './components/treeUtils';
import useFileOperations from './components/useFileOperations';
import useFileSearch from './components/useFileSearch';
import FileTreeItem from './sidebar-filetree-item';

// // Helper functions for file tree operations
// const updateItemInTree = (items, itemId, updates) => {
//   return items.map(item => {
//     if (item.id === itemId) {
//       const updatedItem = { ...item, ...updates };
//       if (updates.name && item.name !== updates.name) {
//         return updatePathsRecursively([updatedItem])[0];
//       }
//       return updatedItem;
//     }
//     if (item.children?.length) {
//       return {
//         ...item,
//         children: updateItemInTree(item.children, itemId, updates),
//       };
//     }
//     return item;
//   });
// };

// // Custom hook for managing file operations
// const useFileOperations = (space, initialItems, initialFolders, dispatch) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const spaceToApiMap = useMemo(
//     () => ({
//       files: attachmentsApi.getAllStoredFiles,
//       prompts: settingsApi.getPromptFiles,
//       chatSessions: chatApi.getAll,
//       assistants: assistantsApi.getExistingAssistants,
//     }),
//     []
//   );

//   const fetchItems = useCallback(async () => {
//     setLoading(true);
//     try {
//       const fetchFunction = spaceToApiMap[space];
//       if (!fetchFunction) {
//         throw new Error(`Invalid space type: ${space}`);
//       }

//       const workspaceId = sessionStorage.getItem('workspaceId');
//       const folderItemData = await getFolderData(
//         space,
//         workspaceId,
//         initialFolders,
//         initialItems
//       );

//       const updatedItems = formatItems(
//         folderItemData.folderItems,
//         space,
//         folderItemData.folders
//       );

//       console.log('Updated items:', updatedItems);
//       dispatch({ type: 'SET_ITEMS', payload: updatedItems });
//     } catch (error) {
//       setError(`Error fetching ${space}: ${error.message}`);
//       console.error(`Error fetching ${space}:`, error);
//     } finally {
//       setLoading(false);
//     }
//   }, [space, initialItems, initialFolders, dispatch, spaceToApiMap]);

//   return { loading, error, fetchItems };
// };

// // Helper functions
// const formatItems = (items, space, folders) => {
//   const formattedItems = items?.map(item => ({
//     ...item,
//     id: uniqueId(item.id || item._id || item.name),
//     name: item.name || item.filename || generateTempFileName(item.metaData),
//     type: item.contentType || item.type,
//     isDirectory: space === 'files' ? false : Boolean(item.children),
//     space: space,
//     path: `/${item?.folderId}/${item?._id}` || '/',
//     folderId: item.folderId || null,
//     metadata: {
//       ...item.metaData,
//       space: space,
//       path: item.path || '',
//       parentId: item.folderId || null,
//     },
//   }));

//   return organizeItemsIntoTree(formattedItems, folders);
// };

// const getFolderData = async (
//   space,
//   workspaceId,
//   initialFolders,
//   initialItems
// ) => {
//   if (space === 'chatSessions') {
//     return {
//       folders: initialFolders.map(folder => ({
//         ...folder,
//         children: [],
//         isDirectory: true,
//         isOpen: false,
//       })),
//       folderItems: initialItems,
//     };
//   }

//   const { folder, folderItems } =
//     await workspacesApi.getWorkspaceFoldersBySpace({
//       workspaceId,
//       space,
//     });

//   const allFolders = [...initialFolders, folder].map(f => ({
//     ...f,
//     children: [],
//     isDirectory: true,
//     isOpen: false,
//   }));

//   return {
//     folders: allFolders,
//     folderItems,
//   };
// };

// const removeItemFromTree = (items, dragId) => {
//   let draggedItem;
//   const updatedItems = items.reduce((acc, item) => {
//     if (item.id === dragId) {
//       draggedItem = item;
//       return acc;
//     }
//     if (item.children?.length) {
//       const { updatedFiles, foundItem } = removeItemFromTree(
//         item.children,
//         dragId
//       );
//       if (foundItem) draggedItem = foundItem;
//       return [...acc, { ...item, children: updatedFiles }];
//     }
//     return [...acc, item];
//   }, []);

//   return { updatedFiles: updatedItems, draggedItem };
// };

// const addItemToTree = (items, dropId, draggedItem) => {
//   return items.map(item => {
//     if (item.id === dropId && item.isDirectory) {
//       return {
//         ...item,
//         children: [...(item.children || []), draggedItem],
//       };
//     }
//     if (item.children?.length) {
//       return {
//         ...item,
//         children: addItemToTree(item.children, dropId, draggedItem),
//       };
//     }
//     return item;
//   });
// };

// const updatePathsRecursively = (items, parentPath = '') => {
//   return items.map(item => {
//     const newPath = parentPath ? `${parentPath}/${item.name}` : `/${item.name}`;
//     const updatedItem = {
//       ...item,
//       path: newPath,
//       metadata: {
//         ...item.metadata,
//         path: newPath,
//       },
//     };

//     if (item.children?.length) {
//       updatedItem.children = updatePathsRecursively(item.children, newPath);
//     }

//     return updatedItem;
//   });
// };

// const organizeItemsIntoTree = (items, folders) => {
//   const folderMap = new Map(
//     folders.map(folder => [
//       folder._id,
//       {
//         ...folder,
//         children: [],
//         isDirectory: true,
//         isOpen: false,
//         path: `/${folder?._id}`,
//       },
//     ])
//   );

//   const itemMap = new Map();

//   items.forEach(item => {
//     const formattedItem = {
//       ...item,
//       id: item.id || uniqueId(item._id || item.name),
//       path: item.folderId
//         ? `/${folderMap.get(item.folderId)?.name}/${item.name}`
//         : `/${item.name}`,
//       children: [],
//       isDirectory: Boolean(item.isDirectory),
//     };
//     itemMap.set(formattedItem.id, formattedItem);
//   });

//   items.forEach(item => {
//     if (item.folderId && folderMap.has(item.folderId)) {
//       const folder = folderMap.get(item.folderId);
//       const formattedItem = itemMap.get(item.id);
//       folder.children.push(formattedItem);
//     }
//   });

//   const rootItems = [];

//   folderMap.forEach(folder => {
//     if (!folder.parentId) {
//       rootItems.push(folder);
//     } else if (folderMap.has(folder.parentId)) {
//       const parentFolder = folderMap.get(folder.parentId);
//       parentFolder.children.push(folder);
//     }
//   });

//   items.forEach(item => {
//     if (!item.folderId) {
//       const formattedItem = itemMap.get(item.id);
//       rootItems.push(formattedItem);
//     }
//   });

//   return rootItems;
// };

// // Utility for handling file uploads
// const handleFileUpload = async (
//   file,
//   newItem,
//   setIsUploading,
//   setUploadProgress,
//   selectedItemId
// ) => {
//   setIsUploading(true);
//   setUploadProgress(0);

//   try {
//     const payload = {
//       name: newItem.name,
//       userId: newItem.userId,
//       fileId: newItem.id,
//       workspaceId: newItem.workspaceId,
//       folderId: selectedItemId,
//       space: newItem.space,
//     };

//     const storageFile = await attachmentsApi.uploadFile(
//       file,
//       payload,
//       progressEvent => {
//         const progress = Math.round(
//           (progressEvent.loaded * 100) / progressEvent.total
//         );
//         setUploadProgress(progress);
//       }
//     );

//     const createdFile = await attachmentsApi.createFile(storageFile);
//     return {
//       ...createdFile,
//       id: createdFile._id,
//       isDirectory: false,
//     };
//   } finally {
//     setIsUploading(false);
//     setUploadProgress(0);
//   }
// };

// // Custom hook for search functionality
// const useFileSearch = (items, searchTerm) => {
//   return useMemo(() => {
//     const searchLower = searchTerm.toLowerCase();

//     const filterItems = items => {
//       return items.reduce((acc, item) => {
//         const matchesSearch = item.name.toLowerCase().includes(searchLower);

//         if (item.children?.length) {
//           const filteredChildren = filterItems(item.children);
//           if (matchesSearch || filteredChildren.length) {
//             return [...acc, { ...item, children: filteredChildren }];
//           }
//         } else if (matchesSearch) {
//           return [...acc, item];
//         }

//         return acc;
//       }, []);
//     };

//     return filterItems(items);
//   }, [items, searchTerm]);
// };

// Update in original file (sidebar-file-directory.jsx):
export const FileDirectory = ({ space, initialItems, initialFolders }) => {
  const { handleSelectDeviceFile } = useFileProcesser();
  const newFileDialog = useDialog();
  const newFolderDialog = useDialog();

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_ITEMS':
          return { ...state, files: action.payload };
        case 'TOGGLE_FOLDER': {
          const item = findItemById(action.payload);
          return {
            ...state,
            files: updateItemInTree(state.files, action.payload, {
              isOpen: !item.isOpen,
            }),
          };
        }
        case 'SET_ACTION': {
          return {
            ...state,
            ui: { ...state.ui, action: action.payload },
          };
        }
        case 'SET_SELECTED_ITEM': {
          return {
            ...state,
            ui: { ...state.ui, selectedItemId: action.payload },
          };
        }
        case 'SET_UPLOAD_PROGRESS': {
          return {
            ...state,
            ui: { ...state.ui, uploadProgress: action.payload },
          };
        }
        case 'SET_IS_UPLOADING': {
          return {
            ...state,
            ui: { ...state.ui, isUploading: action.payload },
          };
        }
        default:
          return state;
      }
    },
    { files: initialItems }
  );

  const [action, setAction] = useState(null);
  const { loading, fetchItems } = useFileOperations(
    space,
    initialItems,
    initialFolders,
    dispatch
  );

  const [uiState, setUiState] = useState(INITIAL_STATE.ui);
  const [newItemData, setNewItemData] = useState(INITIAL_STATE.newItemData);

  const { searchTerm, selectedItemId, isUploading, uploadProgress, error } =
    uiState;

  const itemMap = useMemo(() => buildItemMap(state.files), [state.files]);

  const findItemById = useCallback(id => itemMap.get(id) || null);

  const filteredFiles = useFileSearch(state.files, searchTerm);
  const closeDialogs = useCallback(() => {
    newFileDialog.handleClose();
    newFolderDialog.handleClose();
  }, [newFileDialog, newFolderDialog]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setUiState(prev => ({ ...prev, loading: true }));
        await fetchItems(space, initialItems, initialFolders, dispatch);
      } catch (err) {
        setUiState(prev => ({ ...prev, error: err.message }));
      } finally {
        setUiState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeData();
  }, [space, initialItems, initialFolders, fetchItems, dispatch]);

  const processUploadedFile = async file => {
    return {
      id: uniqueId(file.name),
      name: file.name,
      content: await file.text(),
      type: '.' + file.name.split('.').pop(),
      itemType: 'item',
      isDirectory: false,
    };
  };

  const createNewItem = async (itemData, selectedFile, space) => {
    const newItem = {
      id: Date.now().toString(),
      name: itemData.isDirectory
        ? itemData.name
        : `${itemData.name}${itemData.type}`,
      content: itemData.content,
      type: itemData.type,
      isDirectory: itemData.isDirectory,
      isOpen: false,
      children: [],
      userId: sessionStorage.getItem('userId'),
      workspaceId: sessionStorage.getItem('workspaceId'),
      space: space.toLowerCase(),
    };

    if (selectedFile) {
      const uploadedFile = await handleFileUpload(selectedFile, newItem);
      return uploadedFile;
    }

    return newItem;
  };

  const onFileClick = useCallback(async item => {
    setUiState(prev => ({ ...prev, selectedItemId: item.id }));
    const signedUrl = await attachmentsApi.getSignedUrl(item.filePath);
    window.open(signedUrl, '_blank');
  }, []);

  const onFolderClick = useCallback(
    item => {
      setUiState(prev => ({ ...prev, selectedItemId: item.id }));
      dispatch({ type: 'TOGGLE_FOLDER', payload: item.id });
    },
    [dispatch]
  );

  const handleSearchChange = useCallback(e => {
    setUiState(prev => ({ ...prev, searchTerm: e.target.value }));
  }, []);

  const handleNewFile = useCallback(() => {
    newFileDialog.handleOpen();
    setNewItemData(INITIAL_STATE.fileData);
  }, [newFileDialog]);

  const handleNewFolder = useCallback(() => {
    newFolderDialog.handleOpen();
    setNewItemData({ ...INITIAL_STATE.fileData, isDirectory: true });
  }, [newFolderDialog]);

  const handleUploadItem = useCallback(
    async event => {
      const file = event.target.files?.[0];
      if (!file || state.files.find(i => i.name === file.name)) return;

      try {
        setUiState(prev => ({ ...prev, isUploading: true }));
        const fileData = await processUploadedFile(file);
        setNewItemData(fileData);
        await handleSelectDeviceFile(file, false);
      } catch (err) {
        setUiState(prev => ({ ...prev, error: err.message }));
      } finally {
        setUiState(prev => ({ ...prev, isUploading: false }));
      }
    },
    [state.files, handleSelectDeviceFile]
  );

  const handleCreateItem = useCallback(
    async selectedFile => {
      try {
        const parentFolder = selectedItemId
          ? findItemById(selectedItemId)
          : null;
        const parentPath = parentFolder?.path || '';

        const newItem = await createNewItem(newItemData, selectedFile, space);
        const itemWithPath = {
          ...newItem,
          path: `${parentPath}/${newItem.name}`,
          metadata: {
            ...newItem.metadata,
            parentId: selectedItemId,
            path: `${parentPath}/${newItem.name}`,
          },
        };

        dispatch({
          type: 'ADD_ITEM',
          payload: { selectedItemId, itemWithPath },
        });

        closeDialogs();
        setAction(
          `Created ${newItem.isDirectory ? 'folder' : 'file'}: ${newItem.name}`
        );
      } catch (err) {
        setUiState(prev => ({ ...prev, error: err.message }));
      }
    },
    [selectedItemId, findItemById, newItemData, space, dispatch, closeDialogs]
  );

  const handleItemMove = useCallback(
    (dragId, dropId, { newPath, newParentId }) => {
      dispatch({
        type: 'MOVE_ITEM',
        payload: { dragId, dropId, newPath, newParentId },
      });
    },
    [dispatch]
  );

  const handleItemClick = useCallback(
    item => {
      dispatch({
        type: 'SELECT_ITEM',
        payload: item.id,
      });
      if (item.isDirectory) {
        dispatch({ type: 'TOGGLE_FOLDER', payload: item.id });
      } else {
        onFileClick(item);
      }
    },
    [onFileClick, dispatch]
  );

  // const handleItemUpdate = useCallback((id, updates) => {
  //   setFileTree(prev => updateItemInTree(prev, id, updates));
  // }, []);

  const handleItemRemove = useCallback(
    async id => {
      try {
        const item = findItemById(id);
        if (!item) return;

        if (item.isDirectory && item.children?.length) {
          const confirmed = window.confirm(
            `Are you sure you want to delete "${item.name}" and all its contents?`
          );
          if (!confirmed) return;
        }

        dispatch({ type: 'REMOVE_ITEM', payload: id });
        setAction(
          `Removed ${item.isDirectory ? 'folder' : 'file'}: ${item.name}`
        );
      } catch (err) {
        setUiState(prev => ({ ...prev, error: err.message }));
      }
    },
    [findItemById, dispatch]
  );

  const handleDragError = useCallback(error => {
    setUiState(prev => ({ ...prev, error: error.message }));
    setAction('Drag and drop failed');
  }, []);

  const renderFileTree = useCallback(
    (items, parentPath = '') => (
      <AnimatePresence>
        {items.map(item => {
          const itemPath = parentPath
            ? `${parentPath}/${item.name}`
            : `/${item.name}`;
          const validItem = {
            ...item,
            id: item.id || uniqueId(item.name),
            path: itemPath,
          };

          return (
            <FileTreeItem
              key={validItem.id}
              item={validItem}
              path={itemPath}
              isSelected={selectedItemId === validItem.id}
              onMove={handleItemMove}
              onSelect={handleItemClick}
              onUpdate={updates =>
                dispatch({
                  type: 'UPDATE_ITEM',
                  payload: { id: validItem.id, updates },
                })
              }
              onRemove={id => dispatch({ type: 'REMOVE_ITEM', payload: id })}
            >
              {validItem.isDirectory &&
                validItem.isOpen &&
                validItem.children?.length > 0 &&
                renderFileTree(validItem.children, itemPath)}
            </FileTreeItem>
          );
        })}
      </AnimatePresence>
    ),
    [selectedItemId, handleItemMove, handleItemClick, dispatch]
  );

  if (uiState.loading) return <Spinner />;

  if (error) return <ErrorDisplay error={error} />;

  return (
    <DndProvider backend={HTML5Backend}>
      <FileDirectoryErrorBoundary>
        <SidebarManagerContainer>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography>
              {action == null
                ? 'No item action recorded'
                : `Last action: ${action}`}
            </Typography>
            <SidebarActions
              handleNewFile={handleNewFile}
              handleNewFolder={handleNewFolder}
              space={space}
            />
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid item xs={12}>
                <SearchField value={searchTerm} onChange={handleSearchChange} />
                {renderFileTree(filteredFiles)}
              </Grid>
            </Grid>

            <CreateItemDialog
              error={error}
              open={newFileDialog.open || newFolderDialog.open}
              onClose={closeDialogs}
              itemData={newItemData}
              setItemData={setNewItemData}
              onCreateItem={handleCreateItem}
              onUploadItem={handleUploadItem}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          </Box>
        </SidebarManagerContainer>
      </FileDirectoryErrorBoundary>
    </DndProvider>
  );
};

FileDirectory.propTypes = {
  space: PropTypes.string.isRequired,
  initialItems: PropTypes.array.isRequired,
  initialFolders: PropTypes.array.isRequired,
};

export default FileDirectory;
