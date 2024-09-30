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
import React, { useState, useEffect, useCallback } from 'react';
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

const FileIcon = React.memo(({ type, size = 32, iconColor = '#BDBDBD' }) => {
  if (type.includes('image' || 'png' || 'jpg' || 'jpeg')) {
    return <FaFileImage size={size} color={iconColor} />;
  } else if (type.includes('pdf')) {
    return <FaFilePdf size={size} color={iconColor} />;
  } else if (type.includes('csv')) {
    return <FaFileCsv size={size} color={iconColor} />;
  } else if (type.includes('docx')) {
    return <FaFileWord size={size} color={iconColor} />;
  } else if (type.includes('plain')) {
    return <FaFileAlt size={size} color={iconColor} />;
  } else if (type.includes('json')) {
    return <FaFileCode size={size} color={iconColor} />;
  } else if (type.includes('markdown')) {
    return <FaRegFile size={size} color={iconColor} />;
  } else if (type.includes('javascript' || 'js' || 'jsx' || 'ts' || 'tsx')) {
    return <FaFileCode size={size} color={iconColor} />;
  } else if (type.includes('txt')) {
    return <FaFileAlt size={size} color={iconColor} />;
  } else {
    return <FaFile size={size} />;
  }
});

FileIcon.displayName = 'FileIcon';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  overflow: 'auto',
}));

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  width: '400px',
  borderRadius: theme.shape.borderRadius,
}));

const StyledTreeItemRoot = styled(Box)(({ theme }) => ({
  color: theme.palette.grey[400],
  position: 'relative',
  '& .group': {
    transition: theme.transitions.create('height', {
      duration: theme.transitions.duration.shortest,
    }),
    overflow: 'hidden',
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800],
  }),
}));

const FileDirectory = () => {
  const [files, setFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileType, setFileType] = useState('.txt');
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isDirectory, setIsDirectory] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [action, setAction] = React.useState(null);
  const [expanded, setExpanded] = React.useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [focusedItem, setFocusedItem] = useState(null);

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem('files')) || [];
    setFiles(storedFiles);
  }, []);

  const isExpandable = React.useMemo(
    () => reactChildren => {
      if (Array.isArray(reactChildren)) {
        return reactChildren.length > 0 && reactChildren.some(isExpandable);
      }
      return Boolean(reactChildren);
    },
    []
  );

  const handleItemSelection = useCallback((event, itemId, isSelected) => {
    event.stopPropagation();
    setSelectedFile(itemId);
    if (isSelected) {
      setAction(itemId);
    }
  }, []);

  const handleCreateItem = () => {
    if (!fileName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    const fullName = isDirectory ? fileName : fileName + fileType;
    const newItem = isDirectory
      ? { name: fullName, type: 'directory', children: [] }
      : { name: fullName, content: fileContent, type: fileType };

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
    setModalOpen(false);
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

  const FileTreeItem = ({
    item,
    path,
    isSelected,
    onDelete,
    onSelect,
    onMove,
    children,
  }) => {
    const [open, setOpen] = useState(false);
    const isDirectory = isExpandable(item?.children);

    const handleToggle = () => setOpen(!open);

    const handleMouseEnter = () => setHoveredItem(item);
    const handleMouseLeave = () => setHoveredItem(null);
    const handleFocus = () => setFocusedItem(item);
    const handleBlur = () => setFocusedItem(null);

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
          <div
            style={{
              opacity: isDragging ? 0.5 : 1,
              backgroundColor: isOver
                ? '#e0e0e0'
                : isSelected
                  ? '#f0f0f0'
                  : 'transparent',
            }}
          >
            <ListItem
              onClick={event => {
                if (isDirectory) {
                  setOpen(!open);
                  setCurrentPath(path);
                }
                onSelect(event);
              }}
              selected={isSelected}
            >
              <div ref={drag}>
                <ListItemIcon>
                  {isDirectory ? (
                    <>
                      {open ? <FaChevronDown /> : <FaChevronRight />}
                      <FaFolder size={32} />
                    </>
                  ) : (
                    <FileIcon type={item.type} />
                  )}
                </ListItemIcon>
              </div>
              <ListItemText primary={item.name} />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={e => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <FaTrash />
              </IconButton>
            </ListItem>
          </div>
          {isDirectory && (
            <Collapse in={open} timeout="auto" unmountOnExit>
              {children}
            </Collapse>
          )}
        </StyledTreeItemRoot>
      </div>
    );
  };
  const renderFileTree = (items, path = '') => {
    return (
      <List>
        <AnimatePresence>
          {items.map(item => {
            const itemPath = `${path}/${item.name}`;
            const isSelected = selectedFile === item;
            const isDirectory = isExpandable(item?.children);

            if (isDirectory) {
              return (
                <FileTreeItem
                  key={itemPath}
                  item={item}
                  path={itemPath}
                  isSelected={isSelected}
                  onDelete={() => handleDeleteItem(itemPath)}
                  onSelect={event =>
                    handleItemSelection(event, item, isSelected)
                  }
                  onMove={moveItem}
                >
                  {renderFileTree(item.children, itemPath)}
                </FileTreeItem>
              );
            } else {
              return (
                <FileTreeItem
                  key={itemPath}
                  item={item}
                  path={itemPath}
                  isSelected={isSelected}
                  onDelete={() => handleDeleteItem(itemPath)}
                  onSelect={event =>
                    handleItemSelection(event, item, isSelected)
                  }
                  onMove={moveItem}
                />
              );
            }
          })}
        </AnimatePresence>
      </List>
    );
  };
  const getLanguage = fileType => {
    switch (fileType) {
      case '.js':
        return 'javascript';
      case '.jsx':
        return 'jsx';
      default:
        return 'text';
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" gutterBottom>
          File Directory
        </Typography>
        <Typography>
          {action == null
            ? 'No item action recorded'
            : `Last action: ${action}`}
        </Typography>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid item xs={12} md={4}>
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
              {renderFileTree(files)}
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={8}>
            <StyledPaper>
              {selectedFile ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    {selectedFile.name}
                  </Typography>
                  <SyntaxHighlighter
                    language={getLanguage(selectedFile.type)}
                    style={docco}
                  >
                    {selectedFile.content}
                  </SyntaxHighlighter>
                </>
              ) : (
                <Typography variant="body1">
                  Select a file to view its content
                </Typography>
              )}
            </StyledPaper>
          </Grid>
        </Grid>

        <StyledModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            resetForm();
          }}
        >
          <ModalContent>
            <Typography variant="h6" gutterBottom>
              Create New {isDirectory ? 'Folder' : 'File'}
            </Typography>
            <TextField
              fullWidth
              label={isDirectory ? 'Folder Name' : 'File Name'}
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              error={!!error}
              helperText={error}
              sx={{ mb: 2 }}
            />
            {!isDirectory && (
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>File Type</InputLabel>
                  <Select
                    value={fileType}
                    onChange={e => setFileType(e.target.value)}
                    label="File Type"
                  >
                    <MenuItem value=".txt">.txt</MenuItem>
                    <MenuItem value=".js">.js</MenuItem>
                    <MenuItem value=".jsx">.jsx</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="File Content"
                  multiline
                  rows={4}
                  value={fileContent}
                  onChange={e => setFileContent(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </>
            )}
            <Button variant="contained" onClick={handleCreateItem}>
              Create {isDirectory ? 'Folder' : 'File'}
            </Button>
          </ModalContent>
        </StyledModal>
      </Box>
    </DndProvider>
  );
};

export default FileDirectory;
