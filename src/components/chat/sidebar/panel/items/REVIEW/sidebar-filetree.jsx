// renderFileTree.jsx or within your main component

import { List } from '@mui/material';
import { AnimatePresence } from 'framer-motion'; // If you choose to use it
import React, { useCallback } from 'react';

import FileTreeItem from '../sidebar-items/sidebar-filetree-item';

export const FileTree = ({
  items,
  selectedItemId,
  handleItemMove,
  handleItemSelect,
  setState,
  updateItemInTree,
  removeItemFromTree,
}) => {
  const renderFileTree = useCallback(
    (items, parentPath = '') => (
      <AnimatePresence>
        {items.map(item => {
          const itemPath = parentPath
            ? `${parentPath}/${item.name}`
            : `/${item.name}`;
          const validItem = {
            ...item,
            id: item.id || `${parentPath}/${item.name}`, // Ensure unique ID
            path: itemPath,
          };

          return (
            <FileTreeItem
              key={validItem.id}
              item={validItem}
              path={itemPath}
              isSelected={selectedItemId === validItem.id}
              onMove={handleItemMove}
              onSelect={handleItemSelect}
              onUpdate={(id, updates) =>
                setState(prev => updateItemInTree(prev, id, updates))
              }
              onRemove={id =>
                setState(prev => removeItemFromTree(prev, id).updatedFiles)
              }
            />
          );
        })}
      </AnimatePresence>
    ),
    [
      selectedItemId,
      handleItemMove,
      handleItemSelect,
      setState,
      updateItemInTree,
      removeItemFromTree,
    ]
  );

  return <List component="nav">{renderFileTree(items)}</List>;
};

export default FileTree;
