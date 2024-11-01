// useFileDirectoryReducer.js
import { useReducer, useCallback } from 'react';

// Action Types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_FILES: 'SET_FILES',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_SELECTED_ITEM: 'SET_SELECTED_ITEM',
  SET_UPLOAD_PROGRESS: 'SET_UPLOAD_PROGRESS',
  SET_IS_UPLOADING: 'SET_IS_UPLOADING',
  SET_ACTION: 'SET_ACTION',
};

// Initial State
const initialState = {
  tree: [],
  ui: {
    searchTerm: '',
    selectedItemId: null,
    isUploading: false,
    uploadProgress: 0,
    loading: false,
    error: null,
    action: null,
  },
};

// Reducer Function
const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        ui: { ...state.ui, loading: action.payload },
      };
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        ui: { ...state.ui, error: action.payload },
      };
    case ActionTypes.SET_FILES:
      return {
        ...state,
        tree: action.payload,
      };
    case ActionTypes.ADD_ITEM:
      return {
        ...state,
        tree: addItemToTree(
          state.tree,
          action.payload.parentId,
          action.payload.item
        ),
        ui: { ...state.ui, action: action.payload.actionMessage },
      };
    case ActionTypes.UPDATE_ITEM:
      return {
        ...state,
        tree: updateItemInTree(
          state.tree,
          action.payload.id,
          action.payload.updates
        ),
      };
    case ActionTypes.REMOVE_ITEM:
      return {
        ...state,
        tree: removeItemFromTree(state.tree, action.payload.id),
        ui: { ...state.ui, action: action.payload.actionMessage },
      };
    case ActionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        ui: { ...state.ui, searchTerm: action.payload },
      };
    case ActionTypes.SET_SELECTED_ITEM:
      return {
        ...state,
        ui: { ...state.ui, selectedItemId: action.payload },
      };
    case ActionTypes.SET_UPLOAD_PROGRESS:
      return {
        ...state,
        ui: { ...state.ui, uploadProgress: action.payload },
      };
    case ActionTypes.SET_IS_UPLOADING:
      return {
        ...state,
        ui: { ...state.ui, isUploading: action.payload },
      };
    case ActionTypes.SET_ACTION:
      return {
        ...state,
        ui: { ...state.ui, action: action.payload },
      };
    default:
      return state;
  }
};

// Helper Functions for Tree Operations
const addItemToTree = (tree, parentId, newItem) => {
  if (!parentId) {
    return [...tree, newItem];
  }

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

const updateItemInTree = (tree, itemId, updates) => {
  const recursiveUpdate = items => {
    return items.map(item => {
      if (item.id === itemId) {
        return { ...item, ...updates };
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

const removeItemFromTree = (tree, itemId) => {
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

// Custom Hook
export const useFileDirectoryReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Action Dispatchers
  const setLoading = useCallback(isLoading => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
  }, []);

  const setError = useCallback(error => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  }, []);

  const setFiles = useCallback(files => {
    dispatch({ type: ActionTypes.SET_FILES, payload: files });
  }, []);

  const addItem = useCallback((parentId, item, actionMessage) => {
    dispatch({
      type: ActionTypes.ADD_ITEM,
      payload: { parentId, item, actionMessage },
    });
  }, []);

  const updateItem = useCallback((id, updates) => {
    dispatch({ type: ActionTypes.UPDATE_ITEM, payload: { id, updates } });
  }, []);

  const removeItem = useCallback((id, actionMessage) => {
    dispatch({ type: ActionTypes.REMOVE_ITEM, payload: { id, actionMessage } });
  }, []);

  const setSearchTerm = useCallback(term => {
    dispatch({ type: ActionTypes.SET_SEARCH_TERM, payload: term });
  }, []);

  const setSelectedItem = useCallback(id => {
    dispatch({ type: ActionTypes.SET_SELECTED_ITEM, payload: id });
  }, []);

  const setUploadProgress = useCallback(progress => {
    dispatch({ type: ActionTypes.SET_UPLOAD_PROGRESS, payload: progress });
  }, []);

  const setIsUploading = useCallback(isUploading => {
    dispatch({ type: ActionTypes.SET_IS_UPLOADING, payload: isUploading });
  }, []);

  const setActionMessage = useCallback(message => {
    dispatch({ type: ActionTypes.SET_ACTION, payload: message });
  }, []);

  return {
    state,
    setLoading,
    setError,
    setFiles,
    addItem,
    updateItem,
    removeItem,
    setSearchTerm,
    setSelectedItem,
    setUploadProgress,
    setIsUploading,
    setActionMessage,
  };
};
