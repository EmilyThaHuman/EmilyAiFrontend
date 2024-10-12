import {
  Folder as FolderIcon,
  ExpandLess,
  ExpandMore,
  Delete,
  Edit,
} from '@mui/icons-material';
import {
  Box,
  ListItemText,
  ListItemIcon,
  IconButton,
  Collapse,
  ListItem,
  Tooltip,
  ListItemButton,
} from '@mui/material';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { FileIcon } from 'components/chat/files';

import { FileInfoTooltip } from '../FileInfoTooltip';

const StyledListItemButton = styled(ListItemButton)(
  ({ theme, isSelected }) => ({
    backgroundColor: isSelected ? theme.palette.action.selected : 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus': {
      backgroundColor: theme.palette.action.focus,
    },
  })
);

const StyledTreeItemRoot = styled(Box, {
  shouldForwardProp: prop => prop !== 'isDragging',
})(({ theme, isDragging }) => ({
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.grey[400]
      : theme.palette.grey[800],
  position: 'relative',
  opacity: isDragging ? 0.5 : 1,
}));

// Wrapper component to include the tooltip
const ListItemWithTooltip = React.memo(({ item, ...otherProps }) => (
  <Tooltip title={<FileInfoTooltip item={item} />} placement="right" arrow>
    <StyledListItemButton {...otherProps} />
  </Tooltip>
));

ListItemWithTooltip.displayName = 'ListItemWithTooltip';

ListItemWithTooltip.propTypes = {
  item: PropTypes.object.isRequired,
};

// File component
const File = React.memo(({ item, onSelect }) => (
  <ListItemWithTooltip item={item} onClick={() => onSelect(item)}>
    <ListItemIcon>
      <FileIcon type={item.type} />
    </ListItemIcon>
    <ListItemText primary={item.name} />
  </ListItemWithTooltip>
));

File.displayName = 'File';

File.propTypes = {
  item: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const Folder = React.memo(({ item, onToggle, onDelete, onEdit }) => (
  <ListItemWithTooltip item={item} onClick={() => onToggle(item.id)}>
    <ListItemIcon>
      <FolderIcon />
    </ListItemIcon>
    <ListItemText primary={item.name} />
    <IconButton
      onClick={e => {
        e.stopPropagation();
        onToggle(item.id);
      }}
    >
      {item.isOpen ? <ExpandLess /> : <ExpandMore />}
    </IconButton>
    <IconButton
      edge="end"
      aria-label="edit"
      onClick={e => {
        e.stopPropagation();
        onEdit(item.id);
      }}
    >
      <Edit />
    </IconButton>
    <IconButton
      edge="end"
      aria-label="delete"
      onClick={e => {
        e.stopPropagation();
        onDelete(item.id);
      }}
    >
      <Delete />
    </IconButton>
  </ListItemWithTooltip>
));

Folder.displayName = 'Folder';

Folder.propTypes = {
  item: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export const FileTreeItem = React.memo(
  ({ item, path, isSelected, onMove, updateItem, removeItem, children }) => {
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

    const handleToggle = useCallback(
      event => {
        event.stopPropagation();
        updateItem(item.id, { isOpen: !item.isOpen });
      },
      [item, updateItem]
    );

    const handleDelete = useCallback(
      event => {
        event.stopPropagation();
        removeItem(item.id);
      },
      [item, removeItem]
    );

    const handleSelect = useCallback(
      event => {
        event.stopPropagation();
        if (item.isDirectory) {
          handleToggle(event);
        } else {
          console.log('File clicked:', item);
          // onFileClick(item);
        }
      },
      [item, handleToggle]
    );

    return (
      <StyledTreeItemRoot isDragging={isDragging} ref={drag}>
        <Tooltip
          title={<FileInfoTooltip item={item} />}
          placement="right"
          arrow
        >
          <StyledListItemButton
            onClick={handleSelect}
            isSelected={isSelected}
            style={{
              backgroundColor: isOver ? '#e0e0e0' : 'transparent',
            }}
          >
            <ListItemIcon>
              {item.isDirectory ? (
                <FolderIcon />
              ) : (
                <FileIcon type={item.type} />
              )}
            </ListItemIcon>
            <ListItemText primary={item.name} />
            {item.isDirectory && (
              <>
                <IconButton onClick={handleToggle}>
                  {item.isOpen ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
                <IconButton onClick={handleDelete}>
                  <Delete />
                </IconButton>
              </>
            )}
          </StyledListItemButton>
        </Tooltip>
        <div ref={drop}>
          {item.isDirectory && (
            <Collapse in={item.isOpen} timeout="auto" unmountOnExit>
              {children}
            </Collapse>
          )}
        </div>
      </StyledTreeItemRoot>
    );
  }
);

FileTreeItem.displayName = 'FileTreeItem';

FileTreeItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    isOpen: PropTypes.bool,
    isDirectory: PropTypes.bool,
  }).isRequired,
  path: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onMove: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default FileTreeItem;

//   return (
//     <StyledTreeItemRoot isDragging={isDragging} ref={drag}>
//       <ListItemWithTooltip
//         item={item}
//         isSelected={isSelected}
//         // In FileTreeItem component
//         onClick={event => {
//           event.stopPropagation();
//           if (item.isDirectory) {
//             onToggle(item.id);
//           } else {
//             onSelect(item);
//           }
//         }}
//         onMouseEnter={() => onHover(item.id)}
//         onMouseLeave={() => onHover(null)}
//         onFocus={() => onFocus(item.id)}
//         onBlur={() => onFocus(null)}
//         style={{
//           backgroundColor: isOver ? '#e0e0e0' : 'transparent',
//         }}
//       >
//         <ListItemIcon>
//           {item.isDirectory ? <FolderIcon /> : <FileIcon type={item.type} />}
//         </ListItemIcon>
//         <ListItemText primary={item.name} />
//       </ListItemWithTooltip>
//       <div ref={drop}>
//         {item.isDirectory && (
//           <ListItemWithTooltip
//             item={item}
//             isSelected={isSelected}
//             // In FileTreeItem component
//             onClick={event => {
//               event.stopPropagation();
//               if (item.isDirectory) {
//                 onToggle(item.id);
//               } else {
//                 onSelect(item);
//               }
//             }}
//             onMouseEnter={() => onHover(item.id)}
//             onMouseLeave={() => onHover(null)}
//             onFocus={() => onFocus(item.id)}
//             onBlur={() => onFocus(null)}
//             style={{
//               backgroundColor: isOver ? '#e0e0e0' : 'transparent',
//             }}
//           >
//             <ListItemIcon>
//               <FolderIcon />
//             </ListItemIcon>
//             <IconButton
//               onClick={e => {
//                 e.stopPropagation();
//                 onToggle(item._id);
//               }}
//             >
//               {item.isOpen ? <ExpandLess /> : <ExpandMore />}
//             </IconButton>
//             <IconButton
//               edge="end"
//               aria-label="delete"
//               onClick={e => {
//                 e.stopPropagation();
//                 console.log('Edit clicked');
//               }}
//             >
//               <Edit />
//             </IconButton>
//             <IconButton
//               edge="end"
//               aria-label="delete"
//               onClick={e => {
//                 e.stopPropagation();
//                 onDelete(path);
//               }}
//             >
//               <Delete />
//             </IconButton>
//           </ListItemWithTooltip>
//         )}
//         <Collapse in={item.isOpen} timeout="auto" unmountOnExit>
//           {children}
//         </Collapse>
//       </div>
//     </StyledTreeItemRoot>
//   );
// };

// FileTreeItem.propTypes = {
//   item: PropTypes.shape({
//     id: PropTypes.string.isRequired, // Use 'id' consistently
//     name: PropTypes.string.isRequired,
//     type: PropTypes.string,
//     isOpen: PropTypes.bool,
//     isDirectory: PropTypes.bool,
//   }).isRequired,
//   path: PropTypes.string.isRequired,
//   isSelected: PropTypes.bool.isRequired,
//   onDelete: PropTypes.func.isRequired,
//   onHover: PropTypes.func.isRequired,
//   onFocus: PropTypes.func.isRequired,
//   onSelect: PropTypes.func.isRequired,
//   onMove: PropTypes.func.isRequired,
//   onToggle: PropTypes.func.isRequired,
//   children: PropTypes.node,
// };

// export default FileTreeItem;
