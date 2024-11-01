// treeHelpers.js
import { uniqueId } from 'lodash';

// Adds an item to the tree under the specified parentId
export const addItemToTree = (tree, parentId, newItem) => {
  if (!parentId) return [...tree, newItem];

  const recursiveAdd = items => {
    return items.map(item => {
      if (item.id === parentId && item.isDirectory) {
        return {
          ...item,
          children: [...(item.children || []), newItem],
        };
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: recursiveAdd(item.children),
        };
      }
      return item;
    });
  };

  return recursiveAdd(tree);
};

// Updates an item in the tree
export const updateItemInTree = (tree, itemId, updates) => {
  const recursiveUpdate = items => {
    return items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, ...updates };
        if (updates.name && item.name !== updates.name) {
          updatedItem.path = updates.parentPath
            ? `${updates.parentPath}/${updates.name}`
            : `/${updates.name}`;
        }
        return updatedItem;
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: recursiveUpdate(item.children),
        };
      }
      return item;
    });
  };

  return recursiveUpdate(tree);
};

// Removes an item from the tree
export const removeItemFromTree = (tree, itemId) => {
  const recursiveRemove = items => {
    return items
      .filter(item => item.id !== itemId)
      .map(item => ({
        ...item,
        children: item.children ? recursiveRemove(item.children) : [],
      }));
  };

  return recursiveRemove(tree);
};

// Moves an item within the tree
export const moveItemInTree = (tree, dragId, dropId, newPath, newParentId) => {
  let draggedItem;

  // Remove the dragged item from the tree
  const treeAfterRemoval = removeItemFromTree(tree, dragId, item => {
    draggedItem = item;
  });

  if (!draggedItem) return tree;

  // Update the path and parentId
  draggedItem.path = newPath;
  draggedItem.metadata.parentId = newParentId;

  // Add the dragged item to the new location
  const updatedTree = addItemToTree(treeAfterRemoval, dropId, draggedItem);

  return updatedTree;
};
