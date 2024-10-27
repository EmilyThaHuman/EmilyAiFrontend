import {
  Delete,
  Edit,
  ExpandLess,
  ExpandMore,
  Folder as FolderIcon,
} from '@mui/icons-material';
import {
  Box,
  Collapse,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';
import React, { forwardRef, memo, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { FileIcon } from 'components/chat/files';

import { FileInfoTooltip } from '../../../../../files/FileInfoTooltip';

// Styled components
/**
 * Styled ListItemButton that changes appearance based on the `isSelected` prop.
 * The `isSelected` prop is used for styling and is not forwarded to the DOM.
 */
const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: prop => prop !== 'isSelected',
})(({ theme, isSelected }) => ({
  backgroundColor: isSelected ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:focus': {
    backgroundColor: theme.palette.action.focus,
  },
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
}));

/**
 * Memoized component that wraps ListItemButton with a Tooltip.
 * It forwards the ref to the underlying ListItemButton.
 */
const ListItemWithTooltip = memo(
  forwardRef(({ item, children, isSelected = false, ...props }, ref) => (
    <Tooltip title={<FileInfoTooltip item={item} />} placement="right" arrow>
      <StyledListItemButton ref={ref} isSelected={isSelected} {...props}>
        {children}
      </StyledListItemButton>
    </Tooltip>
  ))
);

ListItemWithTooltip.displayName = 'ListItemWithTooltip';

const StyledTreeItemRoot = styled(Box, {
  shouldForwardProp: prop => !['isDragging', 'isOver'].includes(prop),
})(({ theme, isDragging, isOver }) => ({
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.grey[400]
      : theme.palette.grey[800],
  position: 'relative',
  opacity: isDragging ? 0.5 : 1,
  backgroundColor: isOver ? theme.palette.action.hover : 'transparent',
  transition: theme.transitions.create(['background-color', 'opacity']),
}));

export const FileTreeItem = memo(
  ({
    item,
    path,
    isSelected,
    onSelect,
    onMove,
    onUpdate,
    onRemove,
    children,
  }) => {
    console.log('FileTreeItem rendered', item);
    // DnD setup
    const [{ isDragging }, drag] = useDrag({
      type: 'FILE_TREE_ITEM',
      item: { id: item.id, path },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [{ isOver }, drop] = useDrop({
      accept: 'FILE_TREE_ITEM',
      drop: draggedItem => {
        if (draggedItem.id !== item.id) {
          onMove(draggedItem.id, item.id);
        }
      },
      canDrop: draggedItem => {
        return item.isDirectory && draggedItem.id !== item.id;
      },
      collect: monitor => ({
        isOver: monitor.isOver() && monitor.canDrop(),
      }),
    });

    // Event handlers
    const handleSelect = useCallback(
      event => {
        event.stopPropagation();
        onSelect(item);
      },
      [item, onSelect]
    );

    const handleToggle = useCallback(
      event => {
        event.stopPropagation();
        onUpdate({ isOpen: !item.isOpen });
      },
      [item, onUpdate]
    );

    const handleDelete = useCallback(
      event => {
        event.stopPropagation();
        onRemove();
      },
      [onRemove]
    );

    const handleEdit = useCallback(
      event => {
        event.stopPropagation();
        // Implement edit functionality
        console.log('Edit item:', item);
      },
      [item]
    );

    // Render methods
    const renderItemIcon = () => (
      <ListItemIcon>
        {item.isDirectory ? (
          <FolderIcon color="primary" />
        ) : (
          <FileIcon type={item.type} />
        )}
      </ListItemIcon>
    );

    const renderActions = () => (
      <>
        {item.isDirectory && (
          <IconButton size="small" onClick={handleToggle}>
            {item.isOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
        <IconButton size="small" onClick={handleEdit}>
          <Edit fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleDelete}>
          <Delete fontSize="small" />
        </IconButton>
      </>
    );

    return (
      <StyledTreeItemRoot
        ref={node => drag(drop(node))}
        id={
          item.isDirectory
            ? `tree-folder-${item.id}-${item.name}`
            : `tree-file-${item.id}`
        }
        isDragging={isDragging}
        isOver={isOver}
      >
        <ListItemWithTooltip
          item={item}
          onClick={handleSelect}
          isSelected={isSelected}
        >
          {renderItemIcon()}
          <ListItemText primary={item.name} sx={{ flex: 1, marginLeft: 1 }} />
          {renderActions()}
        </ListItemWithTooltip>

        {item.isDirectory && (
          <div ref={drop}>
            <Collapse in={item.isOpen} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 3 }}>{children}</Box>
            </Collapse>
          </div>
        )}
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
    children: PropTypes.array,
  }).isRequired,
  path: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  children: PropTypes.node,
};

ListItemWithTooltip.propTypes = {
  item: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  isSelected: PropTypes.bool,
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
