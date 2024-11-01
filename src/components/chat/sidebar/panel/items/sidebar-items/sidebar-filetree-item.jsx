// FileTreeItem.jsx

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
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';
import { memo, forwardRef, useCallback, useMemo } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { FileIcon } from 'components/chat/files';
import { FileInfoTooltip } from 'components/chat/files/FileInfoTooltip';

// Styled components
const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: prop => !['isSelected', 'depth'].includes(prop),
})(({ theme, isSelected, depth = 0 }) => ({
  backgroundColor: isSelected ? theme.palette.action.selected : 'transparent',
  paddingLeft: theme.spacing(2 + depth * 2),
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

const ListItemWithTooltip = memo(
  forwardRef(
    ({ item, children, isSelected = false, depth = 0, ...props }, ref) => (
      <Tooltip title={<FileInfoTooltip item={item} />} placement="right" arrow>
        <StyledListItemButton
          ref={ref}
          isSelected={isSelected}
          depth={depth}
          {...props}
        >
          {children}
        </StyledListItemButton>
      </Tooltip>
    )
  )
);

ListItemWithTooltip.displayName = 'ListItemWithTooltip';

const StyledTreeItemRoot = styled(Box, {
  shouldForwardProp: prop =>
    !['isDragging', 'isOver', 'canDrop'].includes(prop),
})(({ theme, isDragging, isOver, canDrop }) => ({
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.grey[400]
      : theme.palette.grey[800],
  position: 'relative',
  opacity: isDragging ? 0.5 : 1,
  backgroundColor:
    isOver && canDrop ? theme.palette.action.hover : 'transparent',
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
    depth = 0,
  }) => {
    // DnD setup
    const [{ isDragging }, drag] = useDrag({
      type: 'FILE_TREE_ITEM',
      item: {
        id: item.id,
        path,
        parentId: item.metadata?.parentId,
        isDirectory: item.isDirectory,
      },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [{ isOver, canDrop }, drop] = useDrop({
      accept: 'FILE_TREE_ITEM',
      drop: (draggedItem, monitor) => {
        if (!monitor.didDrop() && draggedItem.id !== item.id) {
          onMove(draggedItem.id, item.id, {
            newPath: `${path}/${draggedItem.name}`, // Use name instead of id for path
            newParentId: item.id,
          });
        }
      },
      // eslint-disable-next-line no-unused-vars
      canDrop: (draggedItem, monitor) => {
        // Prevent dropping on itself or its descendants
        if (draggedItem.id === item.id) return false;
        if (item.isDirectory && draggedItem.path.startsWith(path)) return false;
        // Only allow dropping into directories
        return item.isDirectory;
      },
      collect: monitor => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
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
        onUpdate(item.id, {
          isOpen: !item.isOpen,
          metadata: {
            ...item.metadata,
            lastToggled: new Date().toISOString(),
          },
        });
      },
      [item, onUpdate]
    );

    const handleDelete = useCallback(
      event => {
        event.stopPropagation();
        // Add confirmation for folders with children
        if (item.isDirectory && item.children?.length > 0) {
          if (!window.confirm('Delete folder and all its contents?')) {
            return;
          }
        }
        onRemove(item.id);
      },
      [item, onRemove]
    );

    const handleEdit = useCallback(
      event => {
        event.stopPropagation();
        onUpdate(item.id, {
          isEditing: true,
          metadata: {
            ...item.metadata,
            lastEdited: new Date().toISOString(),
          },
        });
      },
      [item, onUpdate]
    );

    // Render methods
    const renderItemIcon = useMemo(
      () => (
        <ListItemIcon>
          {item.isDirectory ? (
            <FolderIcon color="primary" />
          ) : (
            <FileIcon type={item.type} />
          )}
        </ListItemIcon>
      ),
      [item.isDirectory, item.type]
    );

    const renderActions = useMemo(
      () => (
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
      ),
      [item.isDirectory, item.isOpen, handleToggle, handleEdit, handleDelete]
    );

    return (
      <StyledTreeItemRoot
        ref={node => drag(drop(node))}
        id={`tree-${item.isDirectory ? 'folder' : 'file'}-${item.id}`}
        isDragging={isDragging}
        isOver={isOver}
        canDrop={canDrop}
      >
        <ListItemWithTooltip
          item={item}
          onClick={handleSelect}
          isSelected={isSelected}
          depth={depth}
        >
          {renderItemIcon}
          <ListItemText
            primary={item.name}
            secondary={item.metadata?.path}
            sx={{ flex: 1, marginLeft: 1 }}
          />
          {renderActions}
        </ListItemWithTooltip>

        {item.isDirectory && (
          <Collapse in={item.isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children &&
                item.children.map(child => {
                  const childPath = `${path}/${child.name}`;
                  return (
                    <FileTreeItem
                      key={child.id}
                      item={child}
                      path={childPath}
                      isSelected={isSelected}
                      onSelect={onSelect}
                      onMove={onMove}
                      onUpdate={onUpdate}
                      onRemove={onRemove}
                      depth={depth + 1}
                    />
                  );
                })}
            </List>
          </Collapse>
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
    metadata: PropTypes.object,
  }).isRequired,
  path: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  depth: PropTypes.number,
};

ListItemWithTooltip.propTypes = {
  item: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  isSelected: PropTypes.bool,
  depth: PropTypes.number,
};

export default FileTreeItem;
