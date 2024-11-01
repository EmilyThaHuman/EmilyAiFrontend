export const INITIAL_FILE_STATE = {
  name: '',
  type: '.txt',
  content: '',
  isDirectory: false,
  path: '',
  folderId: null,
  children: [],
  metadata: {
    space: '',
    path: '',
    parentId: null,
  },
};

export const INITIAL_STATE = {
  data: {
    files: [],
    chatSessions: [],
    assistants: [],
    prompts: [],
    presets: [],
    tools: [],
    models: [],
  },
  ui: {
    searchTerm: '',
    selectedItemId: null,
    isUploading: false,
    uploadProgress: 0,
    error: null,
    action: null,
    loading: false,
  },
  newItemData: { ...INITIAL_FILE_STATE },
};

export const FILEDIRECTORY_ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_SELECTED_ITEM: 'SET_SELECTED_ITEM',
  SET_IS_UPLOADING: 'SET_IS_UPLOADING',
  SET_UPLOAD_PROGRESS: 'SET_UPLOAD_PROGRESS',
  SET_ACTION: 'SET_ACTION',
  SET_DATA: 'SET_DATA',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  SET_NEW_ITEM_DATA: 'SET_NEW_ITEM_DATA',
};

export default {
  INITIAL_STATE,
  FILEDIRECTORY_ACTION_TYPES,
  INITIAL_FILE_STATE,
};
