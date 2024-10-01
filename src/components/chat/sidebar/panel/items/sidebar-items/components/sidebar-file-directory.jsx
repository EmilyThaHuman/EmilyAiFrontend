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

export const FileDirectory = ({ space, initialFiles }) => {
  const { handleSelectDeviceFile } = useFileProcesser();
  const newFileDialog = useDialog();
  const newFolderDialog = useDialog();

  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState([...initialFiles]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [newItemData, setNewItemData] = useState({
    name: '',
    type: '.txt',
    content: '',
    isDirectory: false,
  });
  const [currentPath, setCurrentPath] = useState('');
  const [action, setAction] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [singleFileLoading, setSingleFileLoading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await attachmentsApi.getAllStoredFiles();
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };
    fetchFiles();
  }, []);

  const validateName = useCallback(
    (name, type) => {
      const existingNames = files.map(item => item.name.toLowerCase());
      return existingNames.includes(name.toLowerCase())
        ? `A ${type} with this name already exists.`
        : '';
    },
    [files]
  );

  const handleNewFile = useCallback(() => {
    newFileDialog.handleOpen();
    setNewItemData({ name: '', type: '.txt', content: '', isDirectory: false });
  }, [newFileDialog]);

  const handleNewFolder = useCallback(() => {
    newFolderDialog.handleOpen();
    setNewItemData({ name: '', isDirectory: true });
  }, [newFolderDialog]);

  const handleItemSelection = useCallback(
    (event, item) => {
      event.stopPropagation();
      setSelectedFile(item);
      setAction(item.name);
      if (item.children) {
        setCurrentPath(prevPath =>
          prevPath ? `${prevPath}/${item.name}` : item.name
        );
        setFiles(item.children);
      } else {
        handleFileClick(item);
      }
    },
    [setSelectedFile, setAction]
  );

  const toggleFolder = useCallback(folderId => {
    setFiles(prevFiles =>
      prevFiles.map(file =>
        file.id === folderId ? { ...file, isOpen: !file.isOpen } : file
      )
    );
  }, []);

  const handleFileClick = async file => {
    setSingleFileLoading(true);
    setSelectedFile(file);
    try {
      const response = await attachmentsApi.getStoredFileByName(file.filename);
      setFileContent(response.data);
    } catch (error) {
      console.error('Error fetching file:', error);
      setFileContent('Error loading file content.');
    } finally {
      setSingleFileLoading(false);
    }
  };

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

  const handleCreateItem = () => {
    const { name, type, content, isDirectory } = newItemData;
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    const fullName = isDirectory ? name : name + type;
    const newItem = isDirectory
      ? { name: fullName, type: 'directory', children: [], isOpen: false }
      : {
          name: fullName,
          content,
          type,
          userId: sessionStorage.getItem('userId'),
          workspaceId: sessionStorage.getItem('workspaceId'),
          folderId: null,
          fileId: 'local',
          space: space.toLowerCase(),
          contentType: type,
          size: new Blob([content]).size,
        };

    const updatedFiles = [...files];
    let currentLevel = updatedFiles;
    const pathParts = currentPath.split('/').filter(Boolean);

    pathParts.forEach(part => {
      const existingDir = currentLevel.find(
        item => item.name === part && item.type === 'directory'
      );
      if (existingDir) {
        currentLevel = existingDir.children;
      }
    });

    if (currentLevel.some(item => item.name === fullName)) {
      setError('Name already exists in this directory');
      return;
    }

    currentLevel.push(newItem);
    setFiles(updatedFiles);
    localStorage.setItem('files', JSON.stringify(updatedFiles));
    newFileDialog.handleClose();
    resetForm();
  };

  const resetForm = () => {
    setNewItemData({ name: '', type: '.txt', content: '', isDirectory: false });
    setError('');
  };

  const handleDeleteItem = useCallback(
    itemPath => {
      const updatedFiles = [...files];
      const pathParts = itemPath.split('/').filter(Boolean);
      const itemName = pathParts.pop();
      let currentLevel = updatedFiles;

      pathParts.forEach(part => {
        const existingDir = currentLevel.find(
          item => item.name === part && item.type === 'directory'
        );
        if (existingDir) {
          currentLevel = existingDir.children;
        }
      });

      const index = currentLevel.findIndex(item => item.name === itemName);
      if (index !== -1) {
        currentLevel.splice(index, 1);
        setFiles(updatedFiles);
        localStorage.setItem('files', JSON.stringify(updatedFiles));
        setSelectedFile(null);
      }
    },
    [files, setFiles, setSelectedFile]
  );

  const moveItem = useCallback(
    (dragPath, dropPath) => {
      const updatedFiles = [...files];
      const dragPathParts = dragPath.split('/').filter(Boolean);
      const dropPathParts = dropPath.split('/').filter(Boolean);
      const dragItemName = dragPathParts.pop();
      let dragParentLevel = updatedFiles;
      let dropLevel = updatedFiles;

      dragPathParts.forEach(part => {
        const existingDir = dragParentLevel.find(
          item => item.name === part && item.type === 'directory'
        );
        if (existingDir) {
          dragParentLevel = existingDir.children;
        }
      });

      dropPathParts.forEach(part => {
        const existingDir = dropLevel.find(
          item => item.name === part && item.type === 'directory'
        );
        if (existingDir) {
          dropLevel = existingDir.children;
        }
      });

      const dragItemIndex = dragParentLevel.findIndex(
        item => item.name === dragItemName
      );
      if (dragItemIndex !== -1) {
        const [draggedItem] = dragParentLevel.splice(dragItemIndex, 1);
        dropLevel.push(draggedItem);
        setFiles(updatedFiles);
        localStorage.setItem('files', JSON.stringify(updatedFiles));
      }
    },
    [files, setFiles]
  );
  const renderFileTree = useCallback(
    (items, path = '') => (
      <List>
        <AnimatePresence>
          {items.map(item => {
            const itemPath = `${path}/${item.name}`;
            const isSelected = selectedFile?.name === item.name;
            return (
              <FileTreeItem
                key={itemPath}
                item={item}
                path={itemPath}
                isSelected={isSelected}
                onDelete={() => handleDeleteItem(itemPath)}
                onSelect={event => handleItemSelection(event, item)}
                onToggle={() => toggleFolder(item.id)}
                onMove={moveItem}
              >
                {item.children && renderFileTree(item.children, itemPath)}
              </FileTreeItem>
            );
          })}
        </AnimatePresence>
      </List>
    ),
    [
      selectedFile,
      handleDeleteItem,
      handleItemSelection,
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
            <Grid item xs={12} md={4}>
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
            open={Boolean(selectedFile)}
            onClose={() => setSelectedFile(null)}
            selectedFile={selectedFile}
            fileContent={fileContent}
            loading={singleFileLoading}
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
          />
        </Box>
      </SidebarManagerContainer>
    </DndProvider>
  );
};

FileDirectory.propTypes = {
  space: PropTypes.string.isRequired,
  initialFiles: PropTypes.array.isRequired,
};

export default FileDirectory;
