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
import { useDrag, useDrop } from 'react-dnd';
import { FileIcon } from 'components/chat/files';
import FileInfoTooltip from '../FileInfoTooltip';

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

// Wrapper component to include the tooltip
const ListItemWithTooltip = ({ item, ...otherProps }) => (
  <Tooltip title={<FileInfoTooltip item={item} />} placement="right" arrow>
    <StyledListItemButton {...otherProps} />
  </Tooltip>
);

ListItemWithTooltip.propTypes = {
  item: PropTypes.object.isRequired,
};

// Styled root component
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

export const FileTreeItem = ({
  item,
  path,
  isHovered,
  isFocused,
  isSelected,
  isLoading,
  onDelete,
  onHover,
  onFocus,
  onSelect,
  onMove,
  onToggle,
  children,
}) => {
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
    <StyledTreeItemRoot isDragging={isDragging} ref={drag}>
      <div ref={drop}>
        <ListItemWithTooltip
          item={item}
          isSelected={isSelected}
          // In FileTreeItem component
          onClick={event => {
            event.stopPropagation();
            if (item.isDirectory) {
              onToggle(item.id);
            } else {
              onSelect(item);
            }
          }}
          onMouseEnter={() => onHover(item.id)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onFocus(item.id)}
          onBlur={() => onFocus(null)}
          style={{
            backgroundColor: isOver ? '#e0e0e0' : 'transparent',
          }}
        >
          <ListItemIcon>
            {item.isDirectory ? <FolderIcon /> : <FileIcon type={item.type} />}
          </ListItemIcon>
          <ListItemText primary={item.name} />
          {item.isDirectory && (
            <IconButton
              onClick={e => {
                e.stopPropagation();
                onToggle(item._id);
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
              console.log('Edit clicked');
            }}
          >
            <Edit />
          </IconButton>
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
        </ListItemWithTooltip>
        {item.isDirectory && (
          <Collapse in={item.isOpen} timeout="auto" unmountOnExit>
            {children}
          </Collapse>
        )}
      </div>
    </StyledTreeItemRoot>
  );
};

FileTreeItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired, // Use 'id' consistently
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    isOpen: PropTypes.bool,
    isDirectory: PropTypes.bool,
  }).isRequired,
  path: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default FileTreeItem;
