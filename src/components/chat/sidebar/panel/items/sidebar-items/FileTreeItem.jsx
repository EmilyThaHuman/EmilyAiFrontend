import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import {
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { StyledListItem } from 'components/chat/styled';

export const FileTreeItem = props => {
  const {
    item,
    path,
    index,
    onHover,
    onFocus,
    onSelect,
    isHovered,
    isFocused,
    isSelected,
    toggleFolder,
    expandedFolders,
    children,
  } = props;

  const handleKeyDown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      onSelect(item, path);
    }
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.5 : 1,
            backgroundColor: snapshot.isDragging ? '#f0f0f0' : 'transparent', // Optional visual feedback
          }}
        >
          <div
            onMouseEnter={() => onHover(item.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onFocus(item.id)}
            onBlur={() => onFocus(null)}
            onClick={() =>
              item.type === 'folder'
                ? toggleFolder(item.id)
                : onSelect(item, path)
            }
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-pressed={isSelected}
          >
            <StyledListItem
              isHovered={isHovered}
              isFocused={isFocused}
              isSelected={isSelected}
              item={
                [
                  'file',
                  'prompt',
                  'assistant',
                  'model',
                  'tool',
                  'chatSession',
                ].includes(item.type)
                  ? item
                  : null
              }
              // file={item.type === 'file' ? item : null}
            >
              <ListItemIcon>
                {item.type === 'folder' ? <FolderIcon /> : <FileIcon />}
              </ListItemIcon>
              <ListItemText primary={item.name} />
              {item.type === 'folder' && (
                <IconButton
                  onClick={e => {
                    e.stopPropagation();
                    toggleFolder(item.id);
                  }}
                >
                  {expandedFolders[item.id] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )}
            </StyledListItem>
          </div>
          {item.type === 'folder' && (
            <Collapse
              in={expandedFolders[item.id]}
              timeout="auto"
              unmountOnExit
            >
              {children}
            </Collapse>
          )}
        </div>
      )}
    </Draggable>
  );
};

FileTreeItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  path: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onHover: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  isHovered: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  toggleFolder: PropTypes.func.isRequired,
  expandedFolders: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default React.memo(FileTreeItem);
