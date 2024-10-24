import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  List,
} from '@mui/material';
import { AnimatePresence } from 'framer-motion';
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
import useDynamicState from 'hooks/chat/useDynamicState';
import { useDialog } from 'hooks/ui';
import { generateTempFileName } from 'utils/format';

import CreateItemDialog from './create-item-dialog';
import FileViewerDialog from './fileviewer-dialog';
import SidebarActions from './sidebar-actions';
import FileTreeItem from './sidebar-filetree-item';

export const FileDirectory = ({ space, initialItems, initialFolders }) => {
  const { handleSelectDeviceFile } = useFileProcesser();
  const newFileDialog = useDialog();
  const newFolderDialog = useDialog();

  const [state, setState] = useDynamicState(space, initialItems);

  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([...initialItems]);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [focusedItemId, setFocusedItemId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [newItemData, setNewItemData] = useState({
    name: '',
    type: '.txt',
    content: '',
    isDirectory: false,
    isOpen: false,
  });

  const [currentPath, setCurrentPath] = useState('');
  const [action, setAction] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [singleFileLoading, setSingleFileLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [language, setLanguage] = useState('javascript'); // Default language

  // --- Recursively finds an item by ID --- //
  const findItemById = useCallback((items, id) => {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.children && item.children.length > 0) {
        const found = findItemById(item.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }, []);

  // --- Function to universally format data into a tree structure --- //
  useEffect(() => {
    const loadInitialData = () => {
      const conditionalReqs = {
        files: ['type'],
        folders: ['children'],
      };
      const updatedItems = initialItems.map(itm => ({
        ...itm,
        id: itm.id || itm._id || itm.name,
        name: itm.name || itm.fileName,
        space: itm.space || space,
        isDirectory: false,
        // type: itm.contentType || file.type,
      }));
      console.log(`INIT_ITEMS: ${JSON.stringify(updatedItems)}`);

      const updatedFolders = initialFolders.map(folder => ({
        ...folder,
        id: folder.id || folder._id || folder.name,
        name: folder.name,
        space: folder.space || space,
        children: folder.children || [],
        isOpen: false,
        isDirectory: true,
      }));
      console.log(`INIT_FOLDERS: ${JSON.stringify(updatedFolders)}`);

      // Merge folders and files into a single tree structure
      const mergedData = [...updatedFolders, ...updatedItems];
      setItems(mergedData);
    };

    loadInitialData();
  }, [initialItems, initialFolders, space]);

  useEffect(() => {
    const actionsMap = {
      files: async () => await attachmentsApi.getAllStoredFiles(),
      prompts: async () => await settingsApi.getPromptFiles(),
      chatSessions: async () => await chatApi.getAll(),
      assistants: async () => await assistantsApi.getExistingAssistants(),
    };
    const fetchItems = async () => {
      setLoading(true);
      try {
        const fetchFunction = actionsMap[space];
        if (!fetchFunction) {
          console.error(`No fetch function defined for space: ${space}`);
          return;
        }
        const workspaceId = sessionStorage.getItem('workspaceId');
        let folderItemData;
        if (space === 'chatSessions') {
          folderItemData = {
            folders: initialFolders,
            folderItems: initialItems,
          };
        } else {
          const { folder, folderItems } =
            await workspacesApi.getWorkspaceFoldersBySpace({
              workspaceId,
              space,
            });
          folderItemData = {
            folders: [...initialFolders, folder],
            folderItems,
          };
        }
        // const fetchedItems = await fetchFunction();
        const updatedItems = folderItemData?.folderItems?.map(item => ({
          ...item,
          id: item.id || item._id || item.name,
          name:
            item.name || item.filename || generateTempFileName(item.metaData),
          type: item.contentType || item.type,
          isDirectory: space === 'files' ? false : Boolean(item.children),
          space: space,
        }));

        setState(prevState => {
          const mergedItems = [...prevState, ...updatedItems];
          return mergedItems.filter(
            (item, index, self) =>
              index === self.findIndex(t => t.id === item.id)
          );
        });
      } catch (error) {
        console.error(`Error fetching ${space}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [space, initialItems, setState]);

  // Handle new file creation dialog
  const handleNewFile = useCallback(() => {
    newFileDialog.handleOpen();
    setNewItemData({ name: '', type: '.txt', content: '', isDirectory: false });
  }, [newFileDialog]);

  // Handle new folder creation dialog
  const handleNewFolder = useCallback(() => {
    newFolderDialog.handleOpen();
    setNewItemData({ name: '', isDirectory: true, isOpen: false });
  }, [newFolderDialog]);

  const handleUploadItem = useCallback(
    async event => {
      const file = event.target.files?.[0];
      if (file && !state.find(i => i.name === file.name)) {
        setNewItemData({
          name: file.name,
          content: await file.text(),
          type: '.' + file.name.split('.').pop(),
          itemType: 'item',
          isDirectory: false,
        });
        await handleSelectDeviceFile(file, false);
      }
    },
    [state, handleSelectDeviceFile]
  );

  const handleCreateItem = async selectedFile => {
    const { name, type, content, isDirectory } = newItemData;

    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    const fullName = isDirectory ? name : name + type;
    const newItem = {
      id: Date.now().toString(),
      name: fullName,
      content,
      type,
      isDirectory,
      isOpen: false,
      children: [],
      userId: sessionStorage.getItem('userId'),
      workspaceId: sessionStorage.getItem('workspaceId'),
      space: space.toLowerCase(),
    };

    if (isDirectory) {
      // Handle folder creation
      setState(prevFiles => addItemRecursive(prevFiles, newItem));
      newFolderDialog.handleClose();
    } else {
      if (selectedFile) {
        // Handle file upload
        setIsUploading(true);
        setUploadProgress(0);
        try {
          const payload = {
            name: newItem.name,
            userId: newItem.userId,
            fileId: newItem.id,
            workspaceId: newItem.workspaceId,
            folderId: selectedItemId, // Assuming we have selected a folder to upload into
            space: newItem.space,
          };

          const storageFile = await attachmentsApi.uploadFile(
            selectedFile,
            payload,
            progressEvent => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          );
          const createdFile = await attachmentsApi.createFile(storageFile);
          const updatedItem = {
            ...createdFile,
            id: createdFile._id,
            isDirectory: false,
          };
          // Add the new item to the file tree
          setState(prev => addItemRecursive(prev, updatedItem));
        } catch (error) {
          console.error('Error uploading file:', error);
          setError('Error uploading file.');
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
          newFileDialog.handleClose();
        }
      } else {
        // Handle manual file creation
        setState(prev => addItemRecursive(prev, newItem));
        newFileDialog.handleClose();
      }
    }
  };

  // Helper function to add item recursively
  const addItemRecursive = (items, newItem) => {
    if (selectedItemId) {
      return items.map(item => {
        if (item.id === selectedItemId && item.isDirectory) {
          if (item.children.some(child => child.name === newItem.name)) {
            setError('Name already exists in this directory');
            return item;
          }
          return { ...item, children: [...item.children, newItem] };
        }
        if (item.children) {
          return {
            ...item,
            children: addItemRecursive(item.children, newItem),
          };
        }
        return item;
      });
    } else {
      if (items.some(item => item.name === newItem.name)) {
        setError('Name already exists in this directory');
        return items;
      }
      return [...items, newItem];
    }
  };

  const moveItem = useCallback((dragId, dropId) => {
    let draggedItem;
    const removeItemRecursive = items =>
      items
        .map(item => {
          if (item.id === dragId) {
            draggedItem = item;
            return null;
          }
          if (item.children) {
            return {
              ...item,
              children: removeItemRecursive(item.children).filter(Boolean),
            };
          }
          return item;
        })
        .filter(Boolean);

    const addItemRecursive = items =>
      items.map(item => {
        if (item.id === dropId && item.isDirectory) {
          return { ...item, children: [...item.children, draggedItem] };
        }
        if (item.children) {
          return { ...item, children: addItemRecursive(item.children) };
        }
        return item;
      });

    setState(prevFiles => {
      const filesWithoutDraggedItem = removeItemRecursive(prevFiles);
      return addItemRecursive(filesWithoutDraggedItem);
    });
  }, []);

  const dataWithFolders = state.filter(item => item.folder_id);
  const dataWithoutFolders = state.filter(item => item.folder_id === null);

  const renderFileTree = useCallback(
    (items, path = '') => (
      <List>
        <AnimatePresence>
          {items.map(item => {
            const itemPath = `${path}/${item.name}`;
            const isSelected = selectedItemId === item.id;
            return (
              <FileTreeItem
                key={item.id}
                item={item}
                path={itemPath}
                isSelected={isSelected}
                onMove={moveItem}
                updateItem={(id, updates) => {
                  setState(prevState => {
                    const updateItemRecursive = items =>
                      items.map(item => {
                        if (item.id === id) {
                          return { ...item, ...updates };
                        }
                        if (item.children) {
                          return {
                            ...item,
                            children: updateItemRecursive(item.children),
                          };
                        }
                        return item;
                      });
                    return updateItemRecursive(prevState);
                  });
                }}
                removeItem={id => {
                  setState(prevState => {
                    const removeItemRecursive = items =>
                      items.filter(item => {
                        if (item.id === id) {
                          return false;
                        }
                        if (item.children) {
                          item.children = removeItemRecursive(item.children);
                        }
                        return true;
                      });
                    return removeItemRecursive(prevState);
                  });
                  if (selectedItemId === id) {
                    setSelectedItemId(null);
                  }
                }}
              >
                {item.isDirectory && item.isOpen && item.children
                  ? renderFileTree(item.children, itemPath)
                  : null}
              </FileTreeItem>
            );
          })}
        </AnimatePresence>
      </List>
    ),
    [selectedItemId, moveItem, setState]
  );

  const filteredFiles = useMemo(() => {
    const filterItems = items =>
      items
        .filter(item => {
          if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return true;
          }
          if (item.children) {
            item.children = filterItems(item.children);
            return item.children.length > 0;
          }
          return false;
        })
        .map(item => ({ ...item }));
    return filterItems([...state]);
  }, [state, searchTerm]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <DndProvider backend={HTML5Backend}>
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
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search files"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaSearch />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Box>
              {renderFileTree(filteredFiles)}
            </Grid>
          </Grid>
          <FileViewerDialog
            open={Boolean(selectedItemId)}
            onClose={() => setSelectedItemId(null)}
            selectedItem={findItemById(state, selectedItemId)}
            fileContent={fileContent}
            loading={singleFileLoading}
            language={language}
          />
          <CreateItemDialog
            open={newFileDialog.open || newFolderDialog.open}
            onClose={() => {
              newFileDialog.handleClose();
              newFolderDialog.handleClose();
            }}
            isDirectory={newItemData.isDirectory}
            itemData={newItemData}
            setItemData={setNewItemData}
            error={error}
            onCreateItem={handleCreateItem}
            onUploadItem={handleUploadItem}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        </Box>
      </SidebarManagerContainer>
    </DndProvider>
  );
};

FileDirectory.propTypes = {
  space: PropTypes.string.isRequired,
  initialItems: PropTypes.array.isRequired,
  initialFolders: PropTypes.array.isRequired,
};

export default FileDirectory;

// const handleFileClick = useCallback(async file => {
//   setSingleFileLoading(true);
//   try {
//     console.log('handleFileClick:', file);
//     if (file.content) {
//       // If the file already has content, use it
//       setFileContent(file.content);
//     } else if (file.id) {
//       // If the file has an id, fetch the content using it
//       const response = await attachmentsApi.getFileFromStorage(file.filePath);
//       const contentDisposition = response.headers['content-disposition'];
//       let filename = 'file';
//       if (contentDisposition && contentDisposition.includes('filename=')) {
//         filename = contentDisposition
//           .split('filename=')[1]
//           .split(';')[0]
//           .replace(/"/g, '');
//       }

//       // Set the language for Monaco Editor
//       const fileExtension = filename.split('.').pop();
//       setLanguage(mapExtensionToLanguage(fileExtension));

//       // Read the file content as text
//       const reader = new FileReader();
//       reader.onload = () => {
//         setFileContent(reader.result);
//       };
//       reader.readAsText(response.data);
//     } else if (file.filePath) {
//       // If the file has a filePath, fetch the content using it
//       const response = await attachmentsApi.getStoredFileByPath(
//         file.filePath
//       );
//       setFileContent(response.data);
//     } else {
//       // Fetch the file content from the API using the file name
//       const response = await attachmentsApi.getStoredFileByName(file.name);
//       setFileContent(response.data);
//     }
//   } catch (error) {
//     console.error('Error fetching file:', error);
//     setFileContent('Error loading file content.');
//   } finally {
//     setSingleFileLoading(false);
//   }
// }, []);

// const mapExtensionToLanguage = ext => {
//   switch (ext) {
//     case 'js':
//     case 'jsx':
//       return 'javascript';
//     case 'ts':
//     case 'tsx':
//       return 'typescript';
//     case 'py':
//       return 'python';
//     case 'java':
//       return 'java';
//     // Add more mappings as needed
//     default:
//       return 'plaintext';
//   }
// };
