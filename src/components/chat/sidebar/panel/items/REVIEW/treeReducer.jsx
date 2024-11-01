// reducer.js
import { ActionTypes } from './actionTypes';
import {
  addItemToTree,
  moveItemInTree,
  removeItemFromTree,
  updateItemInTree,
} from './treeHelpers';

export const initialState = {
  tree: [],
  ui: {
    searchTerm: '',
    selectedItemId: null,
    isUploading: false,
    uploadProgress: 0,
    error: null,
    loading: false,
    action: null,
  },
};

export const fileDirectoryReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.INITIALIZE_TREE:
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
        ui: {
          ...state.ui,
          action: `Created ${action.payload.item.isDirectory ? 'folder' : 'file'}: ${action.payload.item.name}`,
        },
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
        ui: {
          ...state.ui,
          action: `Removed ${action.payload.isDirectory ? 'folder' : 'file'}: ${action.payload.name}`,
        },
      };
    case ActionTypes.MOVE_ITEM:
      return {
        ...state,
        tree: moveItemInTree(
          state.tree,
          action.payload.dragId,
          action.payload.dropId,
          action.payload.newPath,
          action.payload.newParentId
        ),
      };
    case ActionTypes.SET_TREE:
      return {
        ...state,
        tree: action.payload,
      };
    case ActionTypes.SET_UI_STATE:
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};
