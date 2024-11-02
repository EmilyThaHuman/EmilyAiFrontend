/* eslint-disable jsx-a11y/no-autofocus */
import {
  ChevronRightRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Paper,
  Box,
  Menu,
} from '@mui/material';
import React, { useContext, useRef, useState } from 'react';
import {
  FaHome,
  FaPlus,
  FaCog,
  FaSearch,
  FaFolder,
  FaFile,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa';

import { toast } from '@/services';
import { EditIcon } from 'assets/humanIcons';
import { TrashCanIcon } from 'assets/humanIcons/custom';
import { useChatStore } from 'contexts/ChatProvider';

const initialFolders = [
  {
    _id: '66bd572935a92c71849b6cc6',
    userId: '66bd572935a92c71849b6cc1',
    workspaceId: '66bd572935a92c71849b6cc3',
    name: 'chatSessions_folder1',
    description: 'chatSessions folder',
    type: 'chatSessions',
    items: ['66bd572d35a92c71849b6cf8'],
    subfolders: [],
    createdAt: '2024-08-15T01:17:29.766Z',
    updatedAt: '2024-08-15T01:17:34.183Z',
    __v: 1,
  },
  {
    _id: '66bd572a35a92c71849b6ccb',
    userId: '66bd572935a92c71849b6cc1',
    workspaceId: '66bd572935a92c71849b6cc3',
    name: 'assistants_folder2',
    description: 'assistants folder',
    type: 'assistants',
    items: ['66bd572d35a92c71849b6cf6'],
    subfolders: [],
    createdAt: '2024-08-15T01:17:30.165Z',
    updatedAt: '2024-08-15T01:17:34.183Z',
    __v: 1,
  },
];

const initialFiles = {
  '66bd572d35a92c71849b6cf8': {
    userId: 'pt89yBRiKSHlKrlrvIHWq5FW',
    workspaceId: 'nyW0cygVsSuGkfIhCk9rVYT8',
    sessionId: 'v3ezxFRJeJzSDaBOtjwbLQQp',
    folderId: 'UoFRIi9TdeRj5w1ClSGylqhh',
    messageId: 'dn5H9lBAVnONQmdt7V9oRhfP',
    name: 'YQaLB02Iiy.docx',
    size: 2876,
    originalFileType: 'application/pdf',
    filePath: '/files/iLln4hNHI7VSQzS2mGHNpyRI',
    type: 'docx',
    tokens: 775,
    sharing: 'private',
    mimeType: 'application/msword',
    metadata: {
      fileSize: 2892,
      fileType: 'docx',
      lastModified: '2024-09-03T16:46:26.458942',
    },
  },
  '66bd572d35a92c71849b6cf6': {
    userId: 'pt89yBRiKSHlKrlrvIHWq5FW',
    workspaceId: 'nyW0cygVsSuGkfIhCk9rVYT8',
    sessionId: 'v3ezxFRJeJzSDaBOtjwbLQQp',
    folderId: 'UoFRIi9TdeRj5w1ClSGylqhh',
    messageId: 'dn5H9lBAVnONQmdt7V9oRhfP',
    name: 'AssistantFile.pdf',
    size: 3000,
    originalFileType: 'application/pdf',
    filePath: '/files/assistantFile',
    type: 'pdf',
    tokens: 800,
    sharing: 'private',
    mimeType: 'application/pdf',
    metadata: {
      fileSize: 3000,
      fileType: 'pdf',
      lastModified: '2024-09-03T16:46:26.458942',
    },
  },
};

export const UpdateFolder = ({ folder }) => {
  const {
    actions: { setFolders, updateFolder },
  } = useChatStore();
  const buttonRef = useRef(null);
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [name, setName] = useState(folder.name);

  const handleUpdateFolder = async () => {
    const updatedFolder = await updateFolder(folder.id, { name });
    setFolders(prevState =>
      prevState.map(c => (c.id === folder.id ? updatedFolder : c))
    );
    setShowFolderDialog(false);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      buttonRef.current?.click();
    }
  };

  return (
    <>
      <IconButton onClick={() => setShowFolderDialog(true)}>
        <EditIcon />
      </IconButton>
      <Dialog
        open={showFolderDialog}
        onClose={() => setShowFolderDialog(false)}
      >
        <DialogTitle>Edit Folder</DialogTitle>
        <DialogContent onKeyDown={handleKeyDown}>
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFolderDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button ref={buttonRef} onClick={handleUpdateFolder} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const DeleteFolder = ({ folder, contentType }) => {
  const {
    actions: { setFolders, deleteFolder },
  } = useChatStore();

  const buttonRef = useRef(null);
  const [showFolderDialog, setShowFolderDialog] = useState(false);

  const handleDeleteFolderOnly = async () => {
    await deleteFolder(folder.id);
    setFolders(prevState => prevState.filter(c => c.id !== folder.id));
    setShowFolderDialog(false);
  };

  const handleDeleteFolderAndItems = async () => {
    handleDeleteFolderOnly();
  };

  return (
    <div>
      <IconButton onClick={() => setShowFolderDialog(true)}>
        <TrashCanIcon />
      </IconButton>
      <Dialog
        open={showFolderDialog}
        onClose={() => setShowFolderDialog(false)}
      >
        <DialogTitle>Delete {folder.name}</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this folder?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFolderDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            ref={buttonRef}
            onClick={handleDeleteFolderAndItems}
            color="error"
          >
            Delete Folder & Included Items
          </Button>
          <Button
            ref={buttonRef}
            onClick={handleDeleteFolderOnly}
            color="error"
          >
            Delete Folder Only
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export const getBlankSessionData = () => {
  return {
    stats: {
      tokenUsage: 0,
      messageCount: 0,
    },
    _id: null,
    name: '',
    topic: '',
    userId: null,
    workspaceId: null,
    assistantId: null,
    model: 'gpt-4-turbo-preview',
    prompt: '',
    active: false,
    activeSessionId: null,
    settings: {
      maxTokens: 500,
      temperature: 0.7,
      model: 'gpt-4-turbo-preview',
      topP: 1,
      n: 1,
      debug: false,
      summarizeMode: false,
    },
    messages: [],
    tuning: {
      debug: false,
      summary: '',
      summarizeMode: false,
    },
    createdAt: null,
    updatedAt: null,
    __v: 0,
    files: [],
    tools: [],
  };
};
export const ChatFolders = props => {
  const { folders = [] } = props;

  const {
    state: { selectedFolder, files },
    actions: { setFolders, setFiles, setSelectedFolder },
  } = useChatStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('file');
  const [search, setSearch] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  const toggleFolder = folderId => {
    setIsExpanded(prev => !prev);
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
    setSelectedFolder(folderId);
  };

  // Custom drag and drop handlers
  const handleDragStart = (e, item, itemType, sourceId, sourceIndex) => {
    e.dataTransfer.setData('itemType', itemType);
    e.dataTransfer.setData('itemId', item._id || item.id);
    e.dataTransfer.setData('sourceId', sourceId);
    e.dataTransfer.setData('sourceIndex', sourceIndex);
    setDraggedItem({ item, itemType, sourceId, sourceIndex });
  };

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDrop = (e, targetFolder) => {
    e.preventDefault();
    const itemType = e.dataTransfer.getData('itemType');
    const itemId = e.dataTransfer.getData('itemId');
    const sourceId = e.dataTransfer.getData('sourceId');

    if (itemType === 'file') {
      // Move file to target folder
      if (sourceId !== targetFolder._id) {
        // Update folders state
        setFolders(prevFolders => {
          const newFolders = prevFolders.map(folder => {
            if (folder._id === sourceId) {
              return {
                ...folder,
                items: folder.items.filter(id => id !== itemId),
              };
            } else if (folder._id === targetFolder._id) {
              return {
                ...folder,
                items: [...folder.items, itemId],
              };
            } else {
              return folder;
            }
          });
          return newFolders;
        });
      }
    } else if (itemType === 'folder') {
      // Reorder folders
      if (sourceId === 'folders') {
        setFolders(prevFolders => {
          const sourceIndex = prevFolders.findIndex(f => f._id === itemId);
          const targetIndex = prevFolders.findIndex(
            f => f._id === targetFolder._id
          );

          if (sourceIndex === -1 || targetIndex === -1) return prevFolders;

          const newFolders = [...prevFolders];
          const [movedFolder] = newFolders.splice(sourceIndex, 1);
          newFolders.splice(targetIndex, 0, movedFolder);

          return newFolders;
        });
      }
    }

    setDraggedItem(null);
  };

  const handleFolderDrop = (e, targetIndex) => {
    e.preventDefault();
    const itemType = e.dataTransfer.getData('itemType');
    const itemId = e.dataTransfer.getData('itemId');
    const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'), 10);

    if (itemType !== 'folder') return;

    setFolders(prevFolders => {
      const sourceIdx = prevFolders.findIndex(f => f._id === itemId);
      if (sourceIdx === -1) return prevFolders;

      const newFolders = [...prevFolders];
      const [movedFolder] = newFolders.splice(sourceIdx, 1);
      newFolders.splice(targetIndex, 0, movedFolder);

      return newFolders;
    });

    setDraggedItem(null);
  };

  const handleFileDrop = (e, targetIndex, targetFolder) => {
    e.preventDefault();
    const itemType = e.dataTransfer.getData('itemType');
    const itemId = e.dataTransfer.getData('itemId');
    const sourceId = e.dataTransfer.getData('sourceId');
    const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'), 10);

    if (itemType !== 'file') return;

    if (sourceId === targetFolder._id) {
      // Reorder within the same folder
      setFolders(prevFolders => {
        const newFolders = prevFolders.map(folder => {
          if (folder._id === sourceId) {
            const newItems = [...folder.items];
            const [movedItemId] = newItems.splice(sourceIndex, 1);
            newItems.splice(targetIndex, 0, movedItemId);
            return { ...folder, items: newItems };
          } else {
            return folder;
          }
        });
        return newFolders;
      });
    } else {
      // Move item from source folder to target folder at targetIndex
      setFolders(prevFolders => {
        const newFolders = prevFolders.map(folder => {
          if (folder._id === sourceId) {
            return {
              ...folder,
              items: folder.items.filter(id => id !== itemId),
            };
          } else if (folder._id === targetFolder._id) {
            const newItems = [...folder.items];
            newItems.splice(targetIndex, 0, itemId);
            return { ...folder, items: newItems };
          } else {
            return folder;
          }
        });
        return newFolders;
      });
    }

    setDraggedItem(null);
  };

  const handleNewItem = () => {
    if (!newItemName || !newItemType || !selectedFolder) {
      toast.warning('Please complete all fields');
      return;
    }

    if (newItemType === 'file') {
      const newFileId = Date.now().toString();
      const newFile = createNewFile(newFileId, selectedFolder, newItemName);

      setFiles(prevFiles => ({ ...prevFiles, [newFileId]: newFile }));
      setFolders(prevFolders =>
        prevFolders.map(folder =>
          folder._id === selectedFolder
            ? { ...folder, items: [...folder.items, newFileId] }
            : folder
        )
      );
    } else {
      const newFolder = createNewFolder(newItemName);

      setFolders(prevFolders => [...prevFolders, newFolder]);
    }

    setIsDialogOpen(false);
    setNewItemName('');
    setNewItemType('file');
  };

  const createNewFile = (id, folderId, name) => ({
    // ... (same as before)
  });

  const createNewFolder = name => ({
    // ... (same as before)
  });

  const renderFiles = folderId => {
    const folder = folders.find(f => f._id === folderId);
    if (!folder) return null;

    return (
      <List component="div" disablePadding>
        {folder.items.map((itemId, index) => {
          const file = files[itemId];
          if (!file) return null;

          return (
            <ListItem
              key={itemId}
              draggable
              onDragStart={e =>
                handleDragStart(e, file, 'file', folder._id, index)
              }
              onDragOver={handleDragOver}
              onDrop={e => handleFileDrop(e, index, folder)}
              button
            >
              <ListItemIcon>
                <FaFile />
              </ListItemIcon>
              <ListItemText primary={file.name} />
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <>
      <AppBar position="static">{/* ... (same as before) */}</AppBar>
      <List>
        {folders.map((folder, index) => (
          <React.Fragment key={folder._id}>
            <ListItem
              draggable
              onDragStart={e =>
                handleDragStart(e, folder, 'folder', 'folders', index)
              }
              onDragOver={handleDragOver}
              onDrop={e => handleFolderDrop(e, index)}
              button
              onClick={() => toggleFolder(folder._id)}
            >
              <ListItemIcon>
                <FaFolder />
              </ListItemIcon>
              <ListItemText primary={folder.name} />
              {expandedFolders[folder._id] ? (
                <ExpandLessRounded />
              ) : (
                <ExpandMoreRounded />
              )}
            </ListItem>
            <Collapse
              in={expandedFolders[folder._id]}
              timeout="auto"
              unmountOnExit
            >
              {renderFiles(folder._id)}
            </Collapse>
          </React.Fragment>
        ))}
      </List>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        {/* ... (same as before) */}
      </Dialog>
    </>
  );
};

export default ChatFolders;
// export const ChatFolders = props => {
//   const { folders = [] } = props;

//   const {
//     state: { selectedFolder, files },
//     actions: { setFolders, setFiles, setSelectedFolder },
//   } = useChatStore();
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [expandedFolders, setExpandedFolders] = useState({});
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [newItemName, setNewItemName] = useState('');
//   const [newItemType, setNewItemType] = useState('file');
//   const [search, setSearch] = useState('');

//   const toggleFolder = folderId => {
//     setIsExpanded(prev => !prev);
//     setExpandedFolders(prev => ({
//       ...prev,
//       [folderId]: !prev[folderId],
//     }));
//     setSelectedFolder(folderId);
//   };

//   const onDragEnd = result => {
//     if (!result.destination) return;

//     const sourceId = result.source.droppableId;
//     const destinationId = result.destination.droppableId;

//     if (sourceId === destinationId) {
//       const updatedItems = reorderItems(
//         folders.find(folder => folder._id === sourceId).items,
//         result.source.index,
//         result.destination.index
//       );

//       setFolders(
//         folders.map(folder =>
//           folder._id === sourceId ? { ...folder, items: updatedItems } : folder
//         )
//       );
//     } else {
//       const sourceFolder = folders.find(folder => folder._id === sourceId);
//       const destFolder = folders.find(folder => folder._id === destinationId);

//       const [movedItemId] = sourceFolder.items.splice(result.source.index, 1);
//       destFolder.items.splice(result.destination.index, 0, movedItemId);

//       setFolders([...folders]);
//     }
//   };

//   const reorderItems = (list, startIndex, endIndex) => {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);
//     return result;
//   };

//   const handleNewItem = () => {
//     if (!newItemName || !newItemType || !selectedFolder) {
//       toast.warning('Please complete all fields');

//       return;
//     }

//     if (newItemType === 'file') {
//       const newFileId = Date.now().toString();
//       const newFile = createNewFile(newFileId, selectedFolder, newItemName);

//       setFiles(prevFiles => ({ ...prevFiles, [newFileId]: newFile }));
//       setFolders(prevFolders =>
//         prevFolders.map(folder =>
//           folder._id === selectedFolder
//             ? { ...folder, items: [...folder.items, newFileId] }
//             : folder
//         )
//       );
//     } else {
//       const newFolder = createNewFolder(newItemName);

//       setFolders(prevFolders => [...prevFolders, newFolder]);
//     }

//     setIsDialogOpen(false);
//     setNewItemName('');
//     setNewItemType('file');
//   };

//   const createNewFile = (id, folderId, name) => ({
//     userId: 'newUserId',
//     workspaceId: 'newWorkspaceId',
//     sessionId: 'newSessionId',
//     folderId,
//     messageId: 'newMessageId',
//     name,
//     size: 0,
//     originalFileType: 'application/octet-stream',
//     filePath: '/files/newFile',
//     type: 'unknown',
//     tokens: 0,
//     sharing: 'private',
//     mimeType: 'application/octet-stream',
//     metadata: {
//       fileSize: 0,
//       fileType: 'unknown',
//       lastModified: new Date().toISOString(),
//     },
//   });

//   const createNewFolder = name => ({
//     _id: Date.now().toString(),
//     userId: 'newUserId',
//     workspaceId: 'newWorkspaceId',
//     name,
//     description: 'New folder',
//     type: 'folder',
//     items: [],
//     subfolders: [],
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     __v: 0,
//   });

//   const renderFiles = folderId => {
//     const folder = folders.find(f => f._id === folderId);
//     if (!folder) return null;

//     return (
//       <List component="div" disablePadding>
//         {folder.items.map((itemId, index) => {
//           const file = files[itemId];
//           if (!file) return null; // Safeguard against undefined files

//           return (
//             <Draggable key={itemId} draggableId={itemId} index={index}>
//               {provided => (
//                 <ListItem
//                   ref={provided.innerRef}
//                   {...provided.draggableProps}
//                   {...provided.dragHandleProps}
//                   button
//                 >
//                   <ListItemIcon>
//                     <FaFile />
//                   </ListItemIcon>
//                   <ListItemText primary={file.name} />
//                 </ListItem>
//               )}
//             </Draggable>
//           );
//         })}
//       </List>
//     );
//   };

//   return (
//     <>
//       <AppBar position="static">
//         <Toolbar>
//           <IconButton edge="start" color="inherit" aria-label="menu">
//             <FaHome />
//           </IconButton>
//           <Typography variant="h6" style={{ flexGrow: 1 }}>
//             File Explorer
//           </Typography>
//           <TextField
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             placeholder="Search"
//             InputProps={{
//               startAdornment: <FaSearch />,
//             }}
//           />
//           <IconButton color="inherit" onClick={() => setIsDialogOpen(true)}>
//             <FaPlus />
//           </IconButton>
//           <IconButton color="inherit">
//             <FaCog />
//           </IconButton>
//         </Toolbar>
//       </AppBar>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Droppable droppableId="folders">
//           {provided => (
//             <List {...provided.droppableProps} ref={provided.innerRef}>
//               {folders.map((folder, index) => (
//                 <React.Fragment key={folder._id}>
//                   <Draggable draggableId={folder._id} index={index}>
//                     {provided => (
//                       <ListItem
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         button
//                         onClick={() => toggleFolder(folder._id)}
//                       >
//                         <ListItemIcon>
//                           <FaFolder />
//                         </ListItemIcon>
//                         <ListItemText primary={folder.type} />
//                         {expandedFolders[folder._id] ? (
//                           <ExpandLessRounded />
//                         ) : (
//                           <ExpandMoreRounded />
//                         )}
//                       </ListItem>
//                     )}
//                   </Draggable>
//                   <Collapse
//                     in={expandedFolders[folder._id]}
//                     timeout="auto"
//                     unmountOnExit
//                   >
//                     {renderFiles(folder._id)}
//                   </Collapse>
//                 </React.Fragment>
//               ))}
//               {provided.placeholder}
//             </List>
//           )}
//         </Droppable>
//       </DragDropContext>
//       <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
//         <DialogTitle>Add New Item</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Name"
//             type="text"
//             fullWidth
//             value={newItemName}
//             onChange={e => setNewItemName(e.target.value)}
//           />
//           <TextField
//             margin="dense"
//             label="Type"
//             type="text"
//             fullWidth
//             value={newItemType}
//             onChange={e => setNewItemType(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setIsDialogOpen(false)} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleNewItem} color="primary">
//             Add
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };
