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

export default {
  INITIAL_STATE,
  INITIAL_FILE_STATE,
};
