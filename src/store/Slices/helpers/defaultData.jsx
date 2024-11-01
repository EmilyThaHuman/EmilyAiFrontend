const REQUEST_STATE = {
  status: 'idle' | 'loading' | 'success' | 'error',
  message: '',
  error: null,
  success: null,
  data: null,
};
// export const defaultPromptList = [
export function defaultPromptList() {
  return [
    {
      userId: null,
      folderId: null,
      name: 'React Counter Component',
      content: 'Write the code for a React component with a stateful counter',
      key: 'React Counter Component',
      value: 'Write the code for a React component with a stateful counter',
      sharing: 'private',
      createdAt: new Date().toISOString(),
      metadata: {
        label: 'Component Name',
        text: 'CounterComponent',
        createdBy: 'John Doe',
        description: 'A component with a stateful counter',
        type: 'React',
        style: 'functional',
        tags: ['sample', 'default'], // Tags for categorization
        props: {
          initialCount: 0,
        },
      },
    },
    {
      userId: null,
      folderId: null,
      name: 'Express MongoDB API',
      content: 'Write the code for a RESTful API with Express and MongoDB',
      key: 'Express MongoDB API',
      value: 'Write the code for a RESTful API with Express and MongoDB',
      sharing: 'private',
      promptText: 'Create a RESTful API with Express and MongoDB',
      createdAt: new Date().toISOString(),
      metadata: {
        label: 'API Name',
        text: 'UserAPI',
        createdBy: 'Jane Smith',
        description: 'An API for managing users with Express and MongoDB',
        type: 'API',
        style: 'functional',
        tags: ['sample', 'default'], // Tags for categorization
        props: {
          routes: [
            'GET /users',
            'POST /users',
            'PUT /users/:id',
            'DELETE /users/:id',
          ],
        },
      },
    },
    {
      userId: null,
      folderId: null,
      name: 'Redux Authentication Store',
      content:
        'Generate code for a Redux store with slices for managing user authentication',
      key: 'Redux Authentication Store',
      value:
        'Generate code for a Redux store with slices for managing user authentication',
      sharing: 'private',
      promptText:
        'Create a Redux store with slices for managing user authentication',
      createdAt: new Date().toISOString(),
      metadata: {
        label: 'Store Name',
        text: 'AuthStore',
        createdBy: 'Sam Wilson',
        description:
          'A Redux store with slices for managing user authentication',
        type: 'Redux',
        style: 'functional',
        tags: ['sample', 'default'], // Tags for categorization
        props: {
          slices: ['auth', 'user'],
          actions: ['login', 'logout', 'setUser'],
        },
      },
    },
  ];
}
export function defaultUserSessionData() {
  return {
    userRequest: REQUEST_STATE,
    user: {
      username: '',
      email: '',
      firstName: '',
      profile: {},
      workspaces: [],
    },
  };
}
export function defaultWorkspaceStoreData() {
  return {
    workspaceRequest: REQUEST_STATE,
    workspaceId: '',
    workspaces: [],
    selectedWorkspace: null,
    homeWorkSpace: null,
    workspaceImages: [],
  };
}
export function defaultChatSessionStoreData() {
  return {
    sessionId: '',
    sessionHeader: '',
    chatSessions: [],
    selectedChatSession: {},
    chatSessionRequest: {
      isFetching: false,
      error: null,
      message: '',
      status: '',
    },
  };
}
export function defaultAssistantStoreData() {
  return {
    assistantRequest: REQUEST_STATE,
    assistants: [
      {
        name: 'ChatBot Assistant',
        instructions: 'Provide helpful responses to user queries.',
        description: 'An assistant designed to help with general questions.',
        model: 'gpt-3.5-turbo',
        tools: [
          {
            type: 'text-generator',
          },
        ],
        tool_resources: {
          code_interpreter: {
            file_ids: [],
          },
        },
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
      assisstantPrompt: '',
      isFirstPromptName: true,
      messages: [],
      files: [],
      tools: [],
      stats: {},
      setting: {},
    },
  };
}
export function defaultModelStoreData() {
  return {
    models: [],
    modelNames: [
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
    ],
    selectedModel: null,
    availableHostedModels: [],
    availableLocalModels: [],
    availableOpenRouterModels: [],
  };
}
export function defaultPresetStoreData() {
  return {
    presetRequest: REQUEST_STATE,
    presets: [],
    selectedPreset: null,
  };
}
export function defaultCollectionStoreData() {
  return {
    collectionRequest: REQUEST_STATE,
    collections: [],
  };
}
export function defaultFileStoreData() {
  return {
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
  };
}
export function defaultFolderStoreData() {
  return {
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
  };
}
export function defaultToolStoreData() {
  return {
    tools: [],
    selectedTools: [],
    toolInUse: '',
  };
}
export function defaultPromptStoreData() {
  return {
    prompts: defaultPromptList(),
    selectedPrompt: null,
    promptRequest: {
      status: 'idle',
      error: null,
      success: null,
      message: '',
    },
    newPrompt: {
      // folderId: new mongoose.Types.ObjectId(), // A new ObjectId for the folder
      // userId: new mongoose.Types.ObjectId(), // A new ObjectId for the user
      content: 'This is a sample prompt content.',
      name: 'Sample Prompt',
      sharing: 'private', // Could be 'private', 'public', etc.
      key: 'sampleKey', // A unique key for identifying the prompt
      value: 'sampleValue', // The corresponding value for the key
      metadata: {
        label: 'default prompt',
        text: 'A default prompt.',
        createdBy: 'default',
        description: 'This is a sample description for the default prompt.',
        type: 'defaultType', // Specify the type of prompt, e.g., 'question', 'instruction'
        style: 'defaultStyle', // Specify the style, e.g., 'formal', 'casual'
        props: {
          // Additional properties or attributes
          exampleProp: 'exampleValue',
        },
        tags: ['sample', 'default'], // Tags for categorization
      },
    },
  };
}
export function defaultBaseChatStoreData() {
  return {
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
  };
}
function defaultAppStoreData() {
  return {
    isSidebarOpen: false,
    theme: 'light',
  };
}
function defaultApiStoreData() {
  return {
    isSidebarOpen: false,
    theme: 'light',
  };
}
function defaultToastStoreData() {
  return {
    count: 0,
    toasts: [],
  };
}
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
