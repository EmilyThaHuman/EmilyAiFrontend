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

import { attachmentsApi } from 'api/Ai/chat-sessions';
import { SidebarManagerContainer } from 'components/chat/styled';
import { useFileProcesser } from 'hooks/chat';
import { useDialog } from 'hooks/ui';

import CreateItemDialog from './create-item-dialog';
import FileViewerDialog from './fileviewer-dialog';
import SidebarActions from './sidebar-actions';
import FileTreeItem from './sidebar-filetree-item';

export const FileDirectory = ({ space, initialFiles, initialFolders }) => {
  const { handleSelectDeviceFile } = useFileProcesser();
  const newFileDialog = useDialog();
  const newFolderDialog = useDialog();

  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState([...initialFiles]);
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

  // Recursive function to find an item by id
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

  // Load initial data
  useEffect(() => {
    const loadInitialData = () => {
      const updatedFiles = initialFiles.map(file => ({
        ...file,
        id: file.id || file._id || file.name,
        name: file.filename || file.name,
        type: file.contentType || file.type,
        isDirectory: false,
      }));
      console.log(`INIT_FILES: ${JSON.stringify(updatedFiles)}`);

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
      const mergedData = [...updatedFolders, ...updatedFiles];
      setFiles(mergedData);
    };

    loadInitialData();
  }, [initialFiles, initialFolders, space]);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const fetchedFiles = await attachmentsApi.getAllStoredFiles();
        const updatedFiles = fetchedFiles.map(file => ({
          ...file,
          id: file.id || file._id || file.name,
          name: file.filename,
          type: file.contentType,
          isDirectory: false,
        }));

        setFiles(prevFiles => {
          const mergedFiles = [...prevFiles, ...updatedFiles];
          return mergedFiles;
        });
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch files if necessary (only if initialFiles are empty)
    fetchFiles();
  }, [initialFiles]);

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

  const handleFileClick = useCallback(async file => {
    setSingleFileLoading(true);
    try {
      console.log('handleFileClick:', file);
      if (file.content) {
        // If the file already has content, use it
        setFileContent(file.content);
      } else if (file.id) {
        // If the file has an id, fetch the content using it
        const response = await attachmentsApi.getFileFromStorage(file.filePath);
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'file';
        if (contentDisposition && contentDisposition.includes('filename=')) {
          filename = contentDisposition
            .split('filename=')[1]
            .split(';')[0]
            .replace(/"/g, '');
        }

        // Set the language for Monaco Editor
        const fileExtension = filename.split('.').pop();
        setLanguage(mapExtensionToLanguage(fileExtension));

        // Read the file content as text
        const reader = new FileReader();
        reader.onload = () => {
          setFileContent(reader.result);
        };
        reader.readAsText(response.data);
      } else if (file.filePath) {
        // If the file has a filePath, fetch the content using it
        const response = await attachmentsApi.getStoredFileByPath(
          file.filePath
        );
        setFileContent(response.data);
      } else {
        // Fetch the file content from the API using the file name
        const response = await attachmentsApi.getStoredFileByName(file.name);
        setFileContent(response.data);
      }
    } catch (error) {
      console.error('Error fetching file:', error);
      setFileContent('Error loading file content.');
    } finally {
      setSingleFileLoading(false);
    }
  }, []);
  const mapExtensionToLanguage = ext => {
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      // Add more mappings as needed
      default:
        return 'plaintext';
    }
  };
  // In FileDirectory component
  const handleItemSelection = useCallback(
    item => {
      setSelectedItemId(item.id);
      setAction(`Selected Item: ${item.name}`);

      if (!item.isDirectory) {
        handleFileClick(item);
      }
    },
    [setSelectedItemId, setAction, handleFileClick]
  );

  // Handle item hover
  const handleItemHover = useCallback(itemId => {
    setHoveredItemId(itemId);
  }, []);

  // Handle item focus
  const handleItemFocus = useCallback(itemId => {
    setFocusedItemId(itemId);
  }, []);

  const toggleFolder = useCallback(folderId => {
    const toggleFolderRecursive = items =>
      items.map(item => {
        if (item.id === folderId) {
          return { ...item, isOpen: !item.isOpen };
        }
        if (item.children) {
          return { ...item, children: toggleFolderRecursive(item.children) };
        }
        return item;
      });

    setFiles(prevFiles => toggleFolderRecursive(prevFiles));
  }, []);

  const handleUploadItem = useCallback(
    async event => {
      const file = event.target.files?.[0];
      if (file && !files.find(f => f.name === file.name)) {
        setNewItemData({
          name: file.name,
          content: await file.text(),
          type: '.' + file.name.split('.').pop(),
          isDirectory: false,
        });
        await handleSelectDeviceFile(file, false);
      }
    },
    [files, handleSelectDeviceFile]
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
      setFiles(prevFiles => addItemRecursive(prevFiles, newItem));
      newFolderDialog.handleClose();
      resetForm();
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
          const updatedFile = {
            ...createdFile,
            id: createdFile._id,
            isDirectory: false,
          };
          // Add the new item to the file tree
          setFiles(prevFiles => addItemRecursive(prevFiles, updatedFile));
        } catch (error) {
          console.error('Error uploading file:', error);
          setError('Error uploading file.');
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
          newFileDialog.handleClose();
          resetForm();
        }
      } else {
        // Handle manual file creation
        setFiles(prevFiles => addItemRecursive(prevFiles, newItem));
        newFileDialog.handleClose();
        resetForm();
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

  const resetForm = () => {
    setNewItemData({ name: '', type: '.txt', content: '', isDirectory: false });
    setError('');
  };

  const handleDeleteItem = useCallback(
    itemId => {
      const deleteItemRecursive = items =>
        items
          .map(item => {
            if (item.id === itemId) {
              return null;
            }
            if (item.children) {
              return {
                ...item,
                children: deleteItemRecursive(item.children).filter(Boolean),
              };
            }
            return item;
          })
          .filter(Boolean);

      setFiles(prevFiles => deleteItemRecursive(prevFiles));
      if (selectedItemId === itemId) {
        setSelectedItemId(null);
      }
    },
    [selectedItemId]
  );
  // Move item via drag-and-drop
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

    setFiles(prevFiles => {
      const filesWithoutDraggedItem = removeItemRecursive(prevFiles);
      return addItemRecursive(filesWithoutDraggedItem);
    });
  }, []);
  // const moveItem = useCallback(
  //   (dragPath, dropPath) => {
  //     const updatedFiles = [...files];
  //     const dragPathParts = dragPath.split('/').filter(Boolean);
  //     const dropPathParts = dropPath.split('/').filter(Boolean);
  //     const dragItemName = dragPathParts.pop();
  //     let dragParentLevel = updatedFiles;
  //     let dropLevel = updatedFiles;

  //     dragPathParts.forEach(part => {
  //       const existingDir = dragParentLevel.find(
  //         item => item.name === part && item.isDirectory
  //       );
  //       if (existingDir) {
  //         dragParentLevel = existingDir.children;
  //       }
  //     });

  //     dropPathParts.forEach(part => {
  //       const existingDir = dropLevel.find(
  //         item => item.name === part && item.isDirectory
  //       );
  //       if (existingDir) {
  //         dropLevel = existingDir.children;
  //       }
  //     });

  //     const dragItemIndex = dragParentLevel.findIndex(
  //       item => item.name === dragItemName
  //     );
  //     if (dragItemIndex !== -1) {
  //       const [draggedItem] = dragParentLevel.splice(dragItemIndex, 1);
  //       dropLevel.push(draggedItem);
  //       setFiles(updatedFiles);
  //       localStorage.setItem('files', JSON.stringify(updatedFiles));
  //     }
  //   },
  //   [files, setFiles]
  // );

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
                isHovered={hoveredItemId === item.id}
                isFocused={focusedItemId === item.id}
                isLoading={singleFileLoading}
                onDelete={() => handleDeleteItem(item.id)}
                onSelect={event =>
                  handleItemSelection({
                    ...item,
                    event,
                  })
                }
                onHover={() => handleItemHover(item.id)}
                onFocus={() => handleItemFocus(item.id)}
                onToggle={() => toggleFolder(item.id)}
                onMove={moveItem}
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
    [
      selectedItemId,
      hoveredItemId,
      focusedItemId,
      singleFileLoading,
      handleDeleteItem,
      handleItemSelection,
      handleItemHover,
      handleItemFocus,
      toggleFolder,
      moveItem,
    ]
  );

  const filteredFiles = useMemo(() => {
    const filterFiles = items =>
      items
        .filter(item => {
          if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return true;
          }
          if (item.children) {
            item.children = filterFiles(item.children);
            return item.children.length > 0;
          }
          return false;
        })
        .map(item => ({ ...item }));
    return filterFiles([...files]);
  }, [files, searchTerm]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <SidebarManagerContainer>
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" gutterBottom>
            File Directory
          </Typography>
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
            selectedItem={findItemById(files, selectedItemId)}
            fileContent={fileContent}
            loading={singleFileLoading}
            language={language}
          />
          <CreateItemDialog
            open={newFileDialog.open || newFolderDialog.open}
            onClose={() => {
              newFileDialog.handleClose();
              newFolderDialog.handleClose();
              resetForm();
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
  initialFiles: PropTypes.array.isRequired,
  initialFolders: PropTypes.array.isRequired,
};

export default FileDirectory;
