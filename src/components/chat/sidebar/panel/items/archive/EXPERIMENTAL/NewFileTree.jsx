import { ExpandMore, ExpandLess, Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Grid,
  Paper,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/system';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaFolder,
  FaFileAlt,
  FaFileCode,
  FaFileImport,
  FaChevronRight,
  FaChevronDown,
  FaFileImage,
  FaFile,
  FaFileCsv,
  FaFileWord,
  FaFilePdf,
  FaRegFile,
} from 'react-icons/fa';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { attachmentsApi } from 'api/Ai/chat-sessions';
import { SidebarManagerContainer } from 'components/chat/styled';
import { useFileProcesser } from 'hooks/chat';
import { useDialog } from 'hooks/ui';
import { detectLanguage } from 'utils/format';

import SidebarActions from '../../sidebar-items/components/sidebar-actions';

const StyledTreeItemRoot = styled(Box)(({ theme, isDragging }) => ({
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.grey[400]
      : theme.palette.grey[800],
  position: 'relative',
  opacity: isDragging ? 0.5 : 1,
  '& .group': {
    transition: theme.transitions.create('height', {
      duration: theme.transitions.duration.shortest,
    }),
    overflow: 'hidden',
  },
}));

const FileTreeItem = ({
  item,
  path,
  isSelected,
  onDelete,
  onSelect,
  onMove,
  onToggle,
  children,
}) => {
  const isDirectory = Boolean(item.children && item.children.length);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FILE_ITEM',
    item: { path },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FILE_ITEM',
    drop: draggedItem => {
      if (draggedItem.path !== path) {
        onMove(draggedItem.path, path);
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop}>
      <StyledTreeItemRoot isDragging={isDragging} ref={drag}>
        <ListItem
          button
          onClick={event => {
            onSelect(event, item);
            if (isDirectory) {
              onToggle();
            }
          }}
          selected={isSelected}
          style={{
            backgroundColor: isOver ? '#e0e0e0' : 'transparent',
          }}
        >
          <ListItemIcon>
            {isDirectory ? (
              <>
                {item.isOpen ? <FaChevronDown /> : <FaChevronRight />}
                <FaFolder size={32} />
              </>
            ) : (
              <FileIcon type={item.type} />
            )}
          </ListItemIcon>
          <ListItemText primary={item.name} />
          {isDirectory && (
            <IconButton
              onClick={e => {
                e.stopPropagation();
                onToggle();
              }}
            >
              {item.isOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={e => {
              e.stopPropagation();
              onDelete(path);
            }}
          >
            <Delete />
          </IconButton>
        </ListItem>
        {isDirectory && (
          <Collapse in={item.isOpen} timeout="auto" unmountOnExit>
            {children}
          </Collapse>
        )}
      </StyledTreeItemRoot>
    </div>
  );
};

FileTreeItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    children: PropTypes.array,
    isOpen: PropTypes.bool,
  }).isRequired,
  path: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export const FileDirectory = ({ space, initialFiles, initialFolders }) => {
  const { handleSelectDeviceFile, fileInputRef } = useFileProcesser();
  const newFileDialog = useDialog();
  const newFolderDialog = useDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState([...initialFiles]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [fileType, setFileType] = useState('.txt');
  const [folders, setFolders] = useState([...initialFolders]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [isDirectory, setIsDirectory] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [action, setAction] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [singleFileLoading, setSingleFileLoading] = false;

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

  const isExpandable = useMemo(() => {
    return reactChildren => {
      if (Array.isArray(reactChildren)) {
        return reactChildren.length > 0 && reactChildren.some(isExpandable);
      }
      return Boolean(reactChildren);
    };
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
    setNewFileName('');
    setFileToUpload(null);
  }, [newFileDialog]);

  const handleNewFolder = useCallback(() => {
    newFolderDialog.handleOpen();
  }, [newFolderDialog]);

  const handleNewFileNameChange = e => {
    const value = e.target.value;
    setFileName(value);
    setError(value ? validateName(value, 'file') : 'File name is required');
  };

  const handleNewFolderNameChange = e => {
    const value = e.target.value;
    setFileName(value);
    setError(validateName(value, 'folder'));
  };

  const handleItemSelection = useCallback(
    (event, item) => {
      event.stopPropagation();
      setSelectedFile(item);
      setAction(item.name);
      if (isExpandable(item.children)) {
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
        setFileName(file.name);
        await handleSelectDeviceFile(file, false);
      }
    },
    [files, handleSelectDeviceFile]
  );

  const handleCreateItem = () => {
    if (!fileName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    const fullName = isDirectory ? fileName : fileName + fileType;
    const newItem = isDirectory
      ? { name: fullName, type: 'directory', children: [], isOpen: false }
      : {
          name: fullName,
          content: fileContent,
          type: fileType,
          userId: sessionStorage.getItem('userId'),
          workspaceId: sessionStorage.getItem('workspaceId'),
          folderId: selectedFolder?._id || null,
          fileId: 'local',
          space: space.toLowerCase(),
          contentType: fileType,
          size: new Blob([fileContent]).size,
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
    setFileName('');
    setFileContent('');
    setFileType('.txt');
    setIsDirectory(false);
    setError('');
  };

  const handleDeleteItem = itemPath => {
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
  };

  const handleImportFromCodeSnippets = () => {
    const importedFiles = [
      {
        name: 'imported1.js',
        content: "console.log('Imported file 1');",
        type: '.js',
      },
      {
        name: 'imported2.jsx',
        content: 'const App = () => <div>Hello World</div>;',
        type: '.jsx',
      },
      { name: 'imported3.txt', content: 'This is a text file.', type: '.txt' },
    ];
    const updatedFiles = [...files, ...importedFiles];
    setFiles(updatedFiles);
    localStorage.setItem('files', JSON.stringify(updatedFiles));
  };

  const moveItem = (dragPath, dropPath) => {
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
  };

  const renderFileTree = useCallback(
    (items, path = '') => {
      return (
        <List>
          <AnimatePresence>
            {items.map(item => {
              const itemPath = `${path}/${item.name}`;
              const isSelected = selectedFile?.name === item.name;

              return (
                <motion.div
                  key={itemPath}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <FileTreeItem
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
                </motion.div>
              );
            })}
          </AnimatePresence>
        </List>
      );
    },
    [
      selectedFile,
      handleDeleteItem,
      handleItemSelection,
      toggleFolder,
      moveItem,
    ]
  );

  const filteredFiles = useMemo(() => {
    const filterFiles = items => {
      return items.filter(item => {
        if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        }
        if (item.children) {
          item.children = filterFiles(item.children);
          return item.children.length > 0;
        }
        return false;
      });
    };
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
            {/* <Grid item xs={12} md={4}>
              <StyledPaper>
                <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<FaPlus />}
                    onClick={() => {
                      setModalOpen(true);
                      setIsDirectory(false);
                    }}
                  >
                    New File
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<FaFolder />}
                    onClick={() => {
                      setModalOpen(true);
                      setIsDirectory(true);
                    }}
                  >
                    New Folder
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FaFileImport />}
                    onClick={handleImportFromCodeSnippets}
                  >
                    Import
                  </Button>
                </Box>
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
                {renderFileTree(filteredFiles)}
              </StyledPaper>
            </Grid> */}
            <FileViewerDialog
              open={open}
              onClose={handleClose}
              selectedFile={selectedFile}
            />
          </Grid>

          <CreateItemDialog
            open={open}
            onClose={handleClose}
            isDirectory={isDirectory}
            fileName={fileName}
            onFileNameChange={handleFileNameChange}
            error={error}
            fileType={fileType}
            onFileTypeChange={e => setFileType(e.target.value)}
            fileContent={fileContent}
            onFileContentChange={e => setFileContent(e.target.value)}
            onCreateItem={handleCreateItem}
          />
        </Box>
      </SidebarManagerContainer>
    </DndProvider>
  );
};

export default FileDirectory;
// export const FileDirectory = props => {
//   const { space, initialFiles, initialFolders } = props;
//   const { handleSelectDeviceFile, fileInputRef } = useFileProcesser();

//   const [modalOpen, setModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   // file state
//   const [files, setFiles] = useState([...initialFiles]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [fileName, setFileName] = useState('');
//   const [fileContent, setFileContent] = useState('');
//   const [fileType, setFileType] = useState('.txt');
//   const [newFileName, setNewFileName] = useState('');
//   const [newFolderName, setNewFolderName] = useState('');
//   const [fileToUpload, setFileToUpload] = useState(null);
//   // directory state
//   const [folders, setFolders] = useState([...initialFolders]);
//   const [selectedFolder, setSelectedFolder] = useState('');
//   const [isDirectory, setIsDirectory] = useState(false);
//   const [currentPath, setCurrentPath] = useState('');
//   const [expandedFolders, setExpandedFolders] = useState({});
//   const [fileStructure, setFileStructure] = useState([]);
//   // event state
//   const [action, setAction] = React.useState(null);
//   const [error, setError] = useState('');
//   const [folderOpen, setFolderOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [expanded, setExpanded] = React.useState({});
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [hoveredItem, setHoveredItem] = useState(null);
//   const [focusedItem, setFocusedItem] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);

//   useEffect(() => {
//     const storedFiles = JSON.parse(localStorage.getItem('files')) || [];
//     setFiles(storedFiles);

//     const fetchFiles = async () => {
//       try {
//         const response = await attachmentsApi.getAllFiles();
//         setFiles(response.data);
//       } catch (error) {
//         console.error('Error fetching files:', error);
//       }
//     };
//     fetchFiles();
//   }, []);
