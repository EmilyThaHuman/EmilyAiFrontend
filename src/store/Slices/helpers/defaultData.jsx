// Utility Constants
const REQUEST_STATE = Object.freeze({
  status: 'idle',
  message: '',
  error: null,
  success: null,
  data: null,
});

// Utility Functions
const getDefaultDate = () => new Date().toISOString();

const createPrompt = (
  name,
  content,
  createdBy,
  description,
  type,
  tags = ['sample', 'default'],
  props = {}
) => ({
  userId: null,
  folderId: null,
  name,
  content,
  key: name,
  value: content,
  sharing: 'private',
  createdAt: getDefaultDate(),
  metadata: {
    label: `${name} Label`,
    text: `${name} Text`,
    createdBy,
    description,
    type,
    style: 'functional',
    tags,
    props,
  },
});

const DEFAULT_MODELS = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'gpt-4',
  'gpt-4-1106-preview',
  'gpt-4-32k',
  'gpt-4-8k',
  'gpt-4-vision-preview',
  'gpt-4o',
  'gpt-4o-0301',
  'gpt-4o-0314',
  'gpt-4o-0315',
  'gpt-4o-0316',
  'llama-3.1-sonar-small-128k-online',
  'llama-3.1-sonar-small-128k-chat',
  'llama-3.1-sonar-large-128k-online',
  'llama-3.1-sonar-large-128k-chat',
  'llama-3.1-8b-instruct',
  'llama-3.1-70b-instruct',
  'mixtral-8x7b-instruct',
];

// Default Store Data Functions
export const defaultPromptList = () => [
  createPrompt(
    'React Counter Component',
    'Write the code for a React component with a stateful counter',
    'John Doe',
    'A component with a stateful counter',
    'React',
    ['sample', 'default'],
    { initialCount: 0 }
  ),
  createPrompt(
    'Express MongoDB API',
    'Write the code for a RESTful API with Express and MongoDB',
    'Jane Smith',
    'An API for managing users with Express and MongoDB',
    'API',
    ['sample', 'default'],
    {
      routes: [
        'GET /users',
        'POST /users',
        'PUT /users/:id',
        'DELETE /users/:id',
      ],
    }
  ),
  createPrompt(
    'Redux Authentication Store',
    'Generate code for a Redux store with slices for managing user authentication',
    'Sam Wilson',
    'A Redux store with slices for managing user authentication',
    'Redux',
    ['sample', 'default'],
    { slices: ['auth', 'user'], actions: ['login', 'logout', 'setUser'] }
  ),
];

export const defaultUserSessionData = () => ({
  userRequest: REQUEST_STATE,
  user: { username: '', email: '', firstName: '', profile: {}, workspaces: [] },
});

export const defaultWorkspaceStoreData = () => ({
  workspaceRequest: REQUEST_STATE,
  workspaceId: '',
  workspaces: [],
  selectedWorkspace: null,
  homeWorkSpace: null,
  workspaceImages: [],
});

export const defaultChatSessionStoreData = () => ({
  sessionId: '',
  sessionHeader: '',
  chatSessions: [],
  selectedChatSession: {},
  chatSessionRequest: { ...REQUEST_STATE, isFetching: false },
});

export const defaultAssistantStoreData = () => ({
  assistantRequest: REQUEST_STATE,
  assistants: [
    {
      name: 'ChatBot Assistant',
      instructions: 'Provide helpful responses to user queries.',
      description: 'An assistant designed to help with general questions.',
      model: 'gpt-3.5-turbo',
      tools: [{ type: 'text-generator' }],
      tool_resources: { code_interpreter: { file_ids: [] } },
    },
  ],
  selectedAssistant: null,
  assistantId: null,
  assistantImages: [],
  openaiAssistants: [],
  list: [],
  threadIds: [],
  assistantIds: [],
  threads: [],
  assistantSession: {
    sessionId: '',
    topic: '',
    id: '',
    name: '',
    summary: '',
    systemPrompt: '',
    assistantPrompt: '',
    isFirstPromptName: true,
    messages: [],
    files: [],
    tools: [],
    stats: {},
    setting: {},
  },
});

export const defaultFileStoreData = () => ({
  fileRequest: REQUEST_STATE,
  files: [],
  selectedFiles: [],
  byId: {},
  allIds: [],
  chatFiles: [],
  chatImages: [],
  newMessageFiles: [],
  newMessageImages: [],
  previewFiles: [],
  previewUrls: [],
  uploadedFiles: [],
  showFilesDisplay: false,
});

export const defaultFolderStoreData = () => ({
  folderRequest: REQUEST_STATE,
  folders: [
    {
      name: 'src',
      description: 'source code folder',
      type: 'folder',
      items: [
        {
          type: 'file',
          name: 'index.js',
          description: 'default file',
          content: null,
        },
        {
          type: 'file',
          name: 'App.js',
          description: 'default file',
          content: null,
        },
        {
          name: 'components',
          description: 'source code folder',
          type: 'folder',
          items: [
            {
              type: 'file',
              name: 'Header.js',
              description: 'default file',
              content: null,
            },
            {
              type: 'file',
              name: 'Footer.js',
              description: 'default file',
              content: null,
            },
          ],
        },
      ],
    },
  ],
  selectedFolder: null,
});

export const defaultPromptStoreData = () => ({
  prompts: defaultPromptList(),
  selectedPrompt: null,
  promptRequest: REQUEST_STATE,
  newPrompt: createPrompt(
    'Sample Prompt',
    'This is a sample prompt content.',
    'default',
    'This is a sample description for the default prompt',
    'defaultType',
    ['sample', 'default'],
    { exampleProp: 'exampleValue' }
  ),
});

export const defaultModelStoreData = () => ({
  models: [],
  modelNames: DEFAULT_MODELS,
  selectedModel: null,
  availableHostedModels: [],
  availableLocalModels: [],
  availableOpenRouterModels: [],
});

export const defaultPresetStoreData = () => ({
  presetRequest: REQUEST_STATE,
  presets: [],
  selectedPreset: null,
});

export const defaultCollectionStoreData = () => ({
  collectionRequest: REQUEST_STATE,
  collections: [],
});

export const defaultToolStoreData = () => ({
  tools: [],
  selectedTools: [],
  toolInUse: '',
});

export const defaultBaseChatStoreData = () => ({
  isApiKeySet: false,
  firstTokenReceived: false,
  isDisabled: false,
  abortController: null,
  active: null,
  isPromptPickerOpen: false,
  slashCommand: '',
  isFilePickerOpen: false,
  hashtagCommand: '',
  isToolPickerOpen: false,
  toolCommand: '',
  focusPrompt: false,
  focusFile: false,
  focusTool: false,
  focusAssistant: false,
  atCommand: '',
  isAssistantPickerOpen: false,
  useRetrieval: true,
  sourceCount: 0,
});

export const defaultAppStoreData = () => ({
  isSidebarOpen: false,
  theme: 'light',
});
export const defaultApiStoreData = () => ({
  isSidebarOpen: false,
  theme: 'light',
});
export const defaultToastStoreData = () => ({ count: 0, toasts: [] });

// Consolidated Export
export const DEFAULTS = {
  api: defaultApiStoreData(),
  app: defaultAppStoreData(),
  toasts: defaultToastStoreData(),
  user: defaultUserSessionData(),
  workspaces: defaultWorkspaceStoreData(),
  baseChat: defaultBaseChatStoreData(),
  chatSessions: defaultChatSessionStoreData(),
  prompts: defaultPromptStoreData(),
  models: defaultModelStoreData(),
  collections: defaultCollectionStoreData(),
  files: defaultFileStoreData(),
  presets: defaultPresetStoreData(),
  tools: defaultToolStoreData(),
  assistants: defaultAssistantStoreData(),
};
