import { ExpandMore, ExpandLess, Delete, Edit } from '@mui/icons-material';
import {
  Box,
  ListItemText,
  ListItemIcon,
  IconButton,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import { FaFolder, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { FileIcon } from 'components/chat/files';
import { StyledListItem } from 'components/chat/styled';

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

export const FileTreeItem = ({
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
        <StyledListItem
          button
          onClick={event => {
            onSelect(event, item);
            if (isDirectory) {
              onToggle();
            }
          }}
          item={item}
          isHovered={isOver}
          isFocused={isSelected}
          isSelected={isSelected}
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
        </StyledListItem>
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

export default FileTreeItem;
