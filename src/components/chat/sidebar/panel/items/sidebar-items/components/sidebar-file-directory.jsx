import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  List,
  CircularProgress,
} from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaSearch } from 'react-icons/fa';

import { settingsApi } from 'api/Ai/chat-items';
import { assistantsApi, attachmentsApi, chatApi } from 'api/Ai/chat-sessions';
import { workspacesApi } from 'api/workspaces';
import { SidebarManagerContainer } from 'components/chat/styled';
import { useFileProcesser } from 'hooks/chat';
import { useDynamicState } from 'hooks/chat/useDynamicState';
import { useDialog } from 'hooks/ui';
import { generateTempFileName } from 'utils/format';

import { CreateItemDialog } from './create-item-dialog';
import { SidebarActions } from './sidebar-actions';
import { FileTreeItem } from './sidebar-filetree-item';

// Constants
const INITIAL_FILE_STATE = {
  name: '',
  type: '.txt',
  content: '',
  isDirectory: false,
};

const INITIAL_FOLDER_STATE = {
  name: '',
  isDirectory: true,
  isOpen: false,
};

const INITIAL_STATE = {
  fileData: {
    name: '',
    type: '.txt',
    content: '',
    isDirectory: false,
    isOpen: false,

    metadata: {
      space: '',
    },
  },
  ui: {
    searchTerm: '',
    selectedItemId: null,
    isUploading: false,
    uploadProgress: 0,
    error: null,
  },
};

const LoadingIndicator = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

const ErrorDisplay = ({ error }) => {
  return (
    <Box sx={{ p: 2, color: 'error.main', textAlign: 'center' }}>
      <Typography variant="h6">An error occurred</Typography>
      <Typography variant="body2">{error}</Typography>
    </Box>
  );
};

ErrorDisplay.propTypes = {
  error: PropTypes.string.isRequired,
};

const SearchField = ({ value, onChange }) => (
  <TextField
    fullWidth
    variant="outlined"
    placeholder="Search files"
    value={value}
    onChange={onChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <FaSearch />
        </InputAdornment>
      ),
    }}
    sx={{ mb: 2 }}
  />
);

SearchField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

// Custom hook for managing file operations
const useFileOperations = (space, initialItems, initialFolders, setState) => {
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

      const updatedItems = formatItems(folderItemData.folderItems, space);

      setState(prevState => {
        const uniqueItemsMap = new Map();

        // Merge previous items and updated items, using the `id` as the key to filter out duplicates
        [...prevState, ...updatedItems].forEach(item => {
          uniqueItemsMap.set(item.id, item);
        });

        // Convert map values back into an array to get the unique items
        return Array.from(uniqueItemsMap.values());
      });
    } catch (error) {
      setError(`Error fetching ${space}: ${error.message}`);
      console.error(`Error fetching ${space}:`, error);
    } finally {
      setLoading(false);
    }
  }, [space, initialItems, initialFolders, setState, spaceToApiMap]);

  return { loading, error, fetchItems };
};

// Helper functions
const formatItems = (items, space) => {
  return items?.map(item => ({
    ...item,
    id: uniqueId(item.id || item._id || item.name),
    name: item.name || item.filename || generateTempFileName(item.metaData),
    type: item.contentType || item.type,
    isDirectory: space === 'files' ? false : Boolean(item.children),
    space: space,
    metadata: {
      ...item.metaData,
      space: space,
    },
  }));
};

const getFolderData = async (
  space,
  workspaceId,
  initialFolders,
  initialItems
) => {
  if (space === 'chatSessions') {
    return {
      folders: initialFolders,
      folderItems: initialItems,
    };
  }

  const { folder, folderItems } =
    await workspacesApi.getWorkspaceFoldersBySpace({
      workspaceId,
      space,
    });

  return {
    folders: [...initialFolders, folder],
    folderItems,
  };
};

// Helper functions for file tree operations
const removeItemFromTree = (items, dragId) => {
  let draggedItem;
  const updatedItems = items.reduce((acc, item) => {
    if (item.id === dragId) {
      draggedItem = item;
      return acc;
    }
    if (item.children?.length) {
      const { updatedFiles, foundItem } = removeItemFromTree(
        item.children,
        dragId
      );
      if (foundItem) draggedItem = foundItem;
      return [...acc, { ...item, children: updatedFiles }];
    }
    return [...acc, item];
  }, []);

  return { updatedFiles: updatedItems, draggedItem };
};

const addItemToTree = (items, dropId, draggedItem) => {
  return items.map(item => {
    if (item.id === dropId && item.isDirectory) {
      return {
        ...item,
        children: [...(item.children || []), draggedItem],
      };
    }
    if (item.children?.length) {
      return {
        ...item,
        children: addItemToTree(item.children, dropId, draggedItem),
      };
    }
    return item;
  });
};

// Utility for handling file uploads
const handleFileUpload = async (
  file,
  newItem,
  setIsUploading,
  setUploadProgress,
  selectedItemId
) => {
  setIsUploading(true);
  setUploadProgress(0);

  try {
    const payload = {
      name: newItem.name,
      userId: newItem.userId,
      fileId: newItem.id,
      workspaceId: newItem.workspaceId,
      folderId: selectedItemId,
      space: newItem.space,
    };

    const storageFile = await attachmentsApi.uploadFile(
      file,
      payload,
      progressEvent => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(progress);
      }
    );

    const createdFile = await attachmentsApi.createFile(storageFile);
    return {
      ...createdFile,
      id: createdFile._id,
      isDirectory: false,
    };
  } finally {
    setIsUploading(false);
    setUploadProgress(0);
  }
};

// Custom hook for file content management
const useFileContent = () => {
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFileContent = async file => {
    setLoading(true);
    try {
      if (file.content) {
        setFileContent(file.content);
        return;
      }

      const response = file.id
        ? await attachmentsApi.getFileFromStorage(file.filePath)
        : await attachmentsApi.getStoredFileByName(file.name);

      const content = await processFileResponse(response);
      setFileContent(content);
    } catch (err) {
      setError(err.message);
      setFileContent('Error loading file content.');
    } finally {
      setLoading(false);
    }
  };

  return { fileContent, loading, error, loadFileContent };
};

// Utility for processing file responses
const processFileResponse = async response => {
  const contentType = response.headers['content-type'];

  if (contentType.includes('text')) {
    return await response.text();
  }

  if (contentType.includes('application/json')) {
    return JSON.stringify(await response.json(), null, 2);
  }

  // Handle binary files
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsText(response.data);
  });
};

// Custom hook for search functionality
const useFileSearch = (items, searchTerm) => {
  return useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    const filterItems = items => {
      return items.reduce((acc, item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchLower);

        if (item.children?.length) {
          const filteredChildren = filterItems(item.children);
          if (matchesSearch || filteredChildren.length) {
            return [...acc, { ...item, children: filteredChildren }];
          }
        } else if (matchesSearch) {
          return [...acc, item];
        }

        return acc;
      }, []);
    };

    return filterItems(items);
  }, [items, searchTerm]);
};

// Error boundary component
class FileDirectoryErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('FileDirectory Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2, color: 'error.main' }}>
          <Typography variant="h6">Something went wrong</Typography>
          <Typography variant="body2">{this.state.error?.message}</Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Enhanced file tree item component
// Enhanced file tree item component
const EnhancedFileTreeItem = React.memo(
  ({
    item,
    path,
    isSelected,
    onMove,
    onSelect,
    updateItem,
    removeItem,
    children,
  }) => {
    return (
      <FileTreeItem
        item={item}
        path={path}
        isSelected={isSelected}
        onSelect={onSelect}
        onMove={onMove}
        onUpdate={updateItem}
        onRemove={removeItem}
      >
        {children}
      </FileTreeItem>
    );
  }
);

EnhancedFileTreeItem.displayName = 'EnhancedFileTreeItem';

EnhancedFileTreeItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isDirectory: PropTypes.bool,
    children: PropTypes.array,
  }).isRequired,
  path: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onMove: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  children: PropTypes.node,
};
export const FileDirectory = ({ space, initialItems, initialFolders }) => {
  console.log('space', space);
  console.log('initialItems', initialItems);
  console.log('initialFolders', initialFolders);
  const { handleSelectDeviceFile } = useFileProcesser();
  const newFileDialog = useDialog();
  const newFolderDialog = useDialog();

  const [state, setState] = useDynamicState(space, initialItems);
  const [fileTree, setFileTree] = useState([]);

  const [action, setAction] = useState(null);
  const { loading, fetchItems } = useFileOperations(
    space,
    initialItems,
    initialFolders,
    setState
  );

  // State management
  const [uiState, setUiState] = useState(INITIAL_STATE.ui);
  const [newItemData, setNewItemData] = useState(INITIAL_STATE.fileData);

  // Destructure UI state for convenience
  const { searchTerm, selectedItemId, isUploading, uploadProgress, error } =
    uiState;

  const filteredFiles = useFileSearch(state, searchTerm);

  const closeDialogs = useCallback(() => {
    newFileDialog.handleClose();
    newFolderDialog.handleClose();
  }, [newFileDialog, newFolderDialog]);

  // Effect to fetch initial data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setUiState(prev => ({ ...prev, loading: true }));
        await fetchItems(space, initialItems, initialFolders, setState);
      } catch (err) {
        setUiState(prev => ({ ...prev, error: err.message }));
      } finally {
        setUiState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeData();
  }, [space, initialItems, initialFolders, fetchItems, setState]);

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

  const updateItemInTree = useCallback((items, itemId, updates) => {
    return items.map(item => {
      if (item.id === itemId) {
        return { ...item, ...updates };
      }
      if (item.children?.length) {
        return {
          ...item,
          children: updateItemInTree(item.children, itemId, updates),
        };
      }
      return item;
    });
  });

  const findItemById = (items, id) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children?.length) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const onFileClick = useCallback(async item => {
    setUiState(prev => ({ ...prev, selectedItemId: item.id }));
    const signedUrl = await attachmentsApi.getSignedUrl(item.filePath);
    window.open(signedUrl, '_blank');
  }, []);

  const onFolderClick = useCallback(
    item => {
      setUiState(prev => ({ ...prev, selectedItemId: item.id }));
      setState(prev => {
        const updatedItems = updateItemInTree(prev, item.id, {
          isOpen: !item.isOpen,
        });
        return updatedItems;
      });
    },
    [setState, updateItemInTree]
  );
  // Handlers
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
      if (!file || state.find(i => i.name === file.name)) return;

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
    [state, handleSelectDeviceFile]
  );

  const handleCreateItem = useCallback(
    async selectedFile => {
      try {
        const newItem = await createNewItem(newItemData, selectedFile, space);
        setState(prev => addItemToTree(prev, newItem, selectedItemId));
        closeDialogs();
      } catch (err) {
        setUiState(prev => ({ ...prev, error: err.message }));
      }
    },
    [newItemData, space, setState, closeDialogs, selectedItemId]
  );

  const handleItemMove = useCallback((dragId, dropId) => {
    setState(prev => {
      const { updatedFiles, draggedItem } = removeItemFromTree(prev, dragId);
      return draggedItem
        ? addItemToTree(updatedFiles, dropId, draggedItem)
        : prev;
    });
  }, []);

  const handleItemSelect = useCallback(
    item => {
      setUiState(prev => ({ ...prev, selectedItemId: item.id }));
      if (item.isDirectory) {
        onFolderClick(item);
      } else {
        onFileClick(item);
      }
    },
    [onFileClick, onFolderClick]
  );

  const handleItemUpdate = useCallback((id, updates) => {
    setFileTree(prev => updateItemInTree(prev, id, updates));
  }, []);

  const handleItemRemove = useCallback(id => {
    setFileTree(prev => removeItemFromTree(prev, id).updatedFiles);
  }, []);

  // Render helpers
  const renderFileTree = useCallback(
    (items, path = '') => (
      <AnimatePresence>
        {items.map(item => {
          let validItem;
          if (!item.id || !item.id === '') {
            validItem = {
              ...item,
              id: uniqueId(item.id),
            };
          } else {
            validItem = item;
          }
          return (
            <EnhancedFileTreeItem
              key={uniqueId(validItem.id)}
              item={validItem}
              // path={`${path}/${item.name}`}
              path={`${path}/${validItem.id}`}
              isSelected={selectedItemId === validItem.id}
              onMove={handleItemMove} // Ensure this function is defined
              onSelect={handleItemSelect} // Ensure this function is defined
              updateItem={updates =>
                setState(prev => updateItemInTree(prev, validItem.id, updates))
              }
              removeItem={id =>
                setState(prev => removeItemFromTree(prev, id).updatedFiles)
              }
            >
              {validItem.isDirectory &&
                validItem.isOpen &&
                validItem.children?.length > 0 &&
                renderFileTree(validItem.children, `${path}/${validItem.name}`)}
            </EnhancedFileTreeItem>
          );
        })}
      </AnimatePresence>
    ),
    [
      selectedItemId,
      handleItemMove,
      handleItemSelect,
      setState,
      updateItemInTree,
    ]
  );

  if (uiState.loading) return <LoadingIndicator />;

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

            {/* <FileViewerDialog
              open={Boolean(selectedItemId)}
              onClose={() =>
                setUiState(prev => ({ ...prev, selectedItemId: null }))
              }
              selectedItem={findItemById(state, selectedItemId)}
              fileContent={fileContent}
              loading={fileLoading}
              error={fileError}
              language={language}
            /> */}
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
