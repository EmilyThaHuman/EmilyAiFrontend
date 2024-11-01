// utils
import path from 'path';

import { uniqueId } from 'lodash';

import { attachmentsApi } from 'api/Ai';
import { workspacesApi } from 'api/workspaces';
import { generateTempFileName } from 'utils/format';

export const buildItemMap = (items, map = new Map()) => {
  items?.forEach(item => {
    map.set(item.id, item);
    if (item.children?.length) {
      buildItemMap(item.children, map);
    }
  });
  return map;
};

export const normalizePath = path => {
  return path.replace(/\\/g, '/').replace(/\/+/g, '/');
};

export const getPathSegments = path => {
  return normalizePath(path).split('/').filter(Boolean);
};

export const joinPaths = (...paths) => {
  return normalizePath(path.join(...paths));
};

export const updatePathsRecursively = (items, parentPath = '') => {
  return items.map(item => {
    const newPath = parentPath ? `${parentPath}/${item.name}` : `/${item.name}`;
    const updatedItem = {
      ...item,
      path: newPath,
      metadata: {
        ...item.metadata,
        path: newPath,
      },
    };

    if (item.children?.length) {
      updatedItem.children = updatePathsRecursively(item.children, newPath);
    }

    return updatedItem;
  });
};

export const findItemInTree = (items, itemId) => {
  for (const item of items) {
    if (item.id === itemId) return item;
    if (item.children?.length) {
      const found = findItemInTree(item.children, itemId);
      if (found) return found;
    }
  }
  return null;
};

export const getItemPath = (items, itemId) => {
  const findPath = (currentItems, id, currentPath = []) => {
    for (const item of currentItems) {
      if (item.id === id) return [...currentPath, item.name];
      if (item.children?.length) {
        const path = findPath(item.children, id, [...currentPath, item.name]);
        if (path) return path;
      }
    }
    return null;
  };

  const pathSegments = findPath(items, itemId);
  return pathSegments ? `/${pathSegments.join('/')}` : null;
};

export const updateItemInTree = (items, itemId, updates) => {
  return items.map(item => {
    if (item.id === itemId) {
      const updatedItem = { ...item, ...updates };
      if (updates.name && item.name !== updates.name) {
        return updatePathsRecursively([updatedItem])[0];
      }
      return updatedItem;
    }
    if (item.children?.length) {
      return {
        ...item,
        children: updateItemInTree(item.children, itemId, updates),
      };
    }
    return item;
  });
};

export const removeItemFromTree = (items, dragId) => {
  let draggedItem;
  const updatedItems = items.reduce((acc, item) => {
    if (item.id === dragId) {
      draggedItem = item;
      return acc;
    }
    if (item.children?.length) {
      const { updatedFiles, foundItem } = removeItemFromTree(
        item.children,
        dragId
      );
      if (foundItem) draggedItem = foundItem;
      return [...acc, { ...item, children: updatedFiles }];
    }
    return [...acc, item];
  }, []);

  return { updatedFiles: updatedItems, draggedItem };
};

export const addItemToTree = (items, dropId, draggedItem) => {
  return items.map(item => {
    if (item.id === dropId && item.isDirectory) {
      return {
        ...item,
        children: [...(item.children || []), draggedItem],
      };
    }
    if (item.children?.length) {
      return {
        ...item,
        children: addItemToTree(item.children, dropId, draggedItem),
      };
    }
    return item;
  });
};

export const organizeItemsIntoTree = (items, folders) => {
  const folderMap = new Map(
    folders.map(folder => [
      folder._id,
      {
        ...folder,
        children: [],
        isDirectory: true,
        isOpen: false,
        path: `/${folder?._id}`,
      },
    ])
  );

  const itemMap = new Map();

  items.forEach(item => {
    const formattedItem = {
      ...item,
      id: item.id || uniqueId(item._id || item.name),
      path: item.folderId
        ? `/${folderMap.get(item.folderId)?.name}/${item.name}`
        : `/${item.name}`,
      children: [],
      isDirectory: Boolean(item.isDirectory),
    };
    itemMap.set(formattedItem.id, formattedItem);
  });

  items.forEach(item => {
    if (item.folderId && folderMap.has(item.folderId)) {
      const folder = folderMap.get(item.folderId);
      const formattedItem = itemMap.get(item.id);
      folder.children.push(formattedItem);
    }
  });

  const rootItems = [];

  folderMap.forEach(folder => {
    if (!folder.parentId) {
      rootItems.push(folder);
    } else if (folderMap.has(folder.parentId)) {
      const parentFolder = folderMap.get(folder.parentId);
      parentFolder.children.push(folder);
    }
  });

  items.forEach(item => {
    if (!item.folderId) {
      const formattedItem = itemMap.get(item.id);
      rootItems.push(formattedItem);
    }
  });

  return rootItems;
};

export const handleFileUpload = async (
  file,
  newItem,
  setIsUploading,
  setUploadProgress,
  selectedItemId
) => {
  setIsUploading(true);
  setUploadProgress(0);

  try {
    const payload = {
      name: newItem.name,
      userId: newItem.userId,
      fileId: newItem.id,
      workspaceId: newItem.workspaceId,
      folderId: selectedItemId,
      space: newItem.space,
    };

    const storageFile = await attachmentsApi.uploadFile(
      file,
      payload,
      progressEvent => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(progress);
      }
    );

    const createdFile = await attachmentsApi.createFile(storageFile);
    return {
      ...createdFile,
      id: createdFile._id,
      isDirectory: false,
    };
  } finally {
    setIsUploading(false);
    setUploadProgress(0);
  }
};

export const getFolderData = async (
  space,
  workspaceId,
  initialFolders,
  initialItems
) => {
  if (space === 'chatSessions') {
    return {
      folders: initialFolders.map(folder => ({
        ...folder,
        children: [],
        isDirectory: true,
        isOpen: false,
      })),
      folderItems: initialItems,
    };
  }

  const { folder, folderItems } =
    await workspacesApi.getWorkspaceFoldersBySpace({
      workspaceId,
      space,
    });

  const allFolders = [...initialFolders, folder].map(f => ({
    ...f,
    children: [],
    isDirectory: true,
    isOpen: false,
  }));

  return {
    folders: allFolders,
    folderItems,
  };
};

export const formatItems = (items, space, folders) => {
  const formattedItems = items?.map(item => ({
    ...item,
    id: uniqueId(item.id || item._id || item.name),
    name: item.name || item.filename || generateTempFileName(item.metaData),
    type: item.contentType || item.type,
    isDirectory: space === 'files' ? false : Boolean(item.children),
    space: space,
    path: `/${item?.folderId}/${item?._id}` || '/',
    folderId: item.folderId || null,
    metadata: {
      ...item.metaData,
      space: space,
      path: item.path || '',
      parentId: item.folderId || null,
    },
  }));

  return organizeItemsIntoTree(formattedItems, folders);
};

export default {
  findItemInTree,
  getItemPath,
  updateItemInTree,
  removeItemFromTree,
  addItemToTree,
  organizeItemsIntoTree,
  handleFileUpload,
  updatePathsRecursively,
  buildItemMap,
};
