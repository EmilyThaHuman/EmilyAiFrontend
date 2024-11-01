import PropTypes from 'prop-types';
import React from 'react';

import { FileTreeItem } from '../sidebar-items/sidebar-filetree-item';

export const EnhancedFileTreeItem = React.memo(
  ({
    item,
    path,
    isSelected,
    onMove,
    onSelect,
    updateItem,
    removeItem,
    children,
  }) => {
    return (
      <FileTreeItem
        item={item}
        path={path}
        isSelected={isSelected}
        onSelect={onSelect}
        onMove={onMove}
        onUpdate={updateItem}
        onRemove={removeItem}
      >
        {children}
      </FileTreeItem>
    );
  }
);

EnhancedFileTreeItem.displayName = 'EnhancedFileTreeItem';

EnhancedFileTreeItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isDirectory: PropTypes.bool,
    children: PropTypes.array,
  }).isRequired,
  path: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onMove: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default EnhancedFileTreeItem;
