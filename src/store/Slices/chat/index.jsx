/* eslint-disable import/order */
import assistantReducer, {
  setAssistantId,
  setAssistantFiles,
  createAssistant,
  createMessage,
  createRun,
  createRunStream,
  createRunStreamWithFunctions,
  createThread,
  deleteAssistant,
  fetchAssistantByThread,
  fetchAssistantList,
  retrieveRun,
  setAssistantImages,
  setAssistants,
  setOpenaiAssistants,
  setSelectedAssistant,
  updateAssistant,
  uploadAssistantFile,
} from './assistantSlice';
import baseChatReducer, {
  // addEnvToUser,
  setChatError,
  setAbortController,
  setAtCommand,
  setChatRequestData,
  setError,
  setFirstMessageReceived,
  setFirstTokenReceived,
  setFocusAssistant,
  setFocusFile,
  setFocusPrompt,
  setFocusTool,
  setIsSubmitting,
  setHashtagCommand,
  setIsAssistantPickerOpen,
  setIsDisabled,
  setIsFilePickerOpen,
  setIsMessagesUpdated,
  setIsPromptPickerOpen,
  setIsToolPickerOpen,
  setStreamingMessageIndex,
  setLoading,
  setMode,
  setSlashCommand,
  setSourceCount,
  setToolCommand,
  setUseRetrieval,
  setIsStreaming,
  setChatLoading,
} from './baseChatSlice';
import chatSessionReducer, {
  clearChatSessions,
  createChatSession,
  setChatSessions,
  setSelectedChatSession,
  setSessionHeader,
  setSessionId,
  setChatMessages,
  setChatSettings,
  setChatFileItems,
  setApiKey,
  debouncedSetChatMessages,
  updateLastMessage,
  updateChatMessage,
  addChatMessage,
  setSyncStatus,
  setUserInput,
  syncChatMessages,
  getChatMessages,
} from './chatSessionSlice';
import collectionReducer, { setCollections } from './collectionSlice';
import fileReducer, {
  fetchFileData,
  setChatFiles,
  setChatImages,
  setFiles,
  setNewMessageFiles,
  setNewMessageImages,
  setShowFilesDisplay,
  addNewMessageFile,
  updateNewMessageFile,
  uploadFile,
  getAllStoredFiles,
  getStoredFilesByType,
  getStoredFilesBySpace,
  getStoredFileByName,
  getStoredFileById,
} from './fileSlice';
import folderReducer, {
  createFolder,
  deleteFolder,
  setFolders,
  setSelectedFolder,
  updateFolder,
} from './foldersSlice';
import modelReducer, {
  setAvailableHostedModels,
  setAvailableLocalModels,
  setAvailableOpenRouterModels,
  setModels,
  setSelectedModel,
} from './modelsSlice';
import presetReducer, { setPresets, setSelectedPreset } from './presetSlice';
import promptReducer, { setPrompts, setSelectedPrompt } from './promptSlice';
import toolReducer, {
  setSelectedTools,
  setToolInUse,
  setTools,
} from './toolSlice';
import workspaceReducer, {
  setWorkspaceId,
  setWorkspaces,
  setSelectedWorkspace,
  setHomeWorkSpace,
  setWorkspaceImages,
  syncWorkspaceFolders,
} from './workspaceSlice';

export {
  // addEnvToUser,
  setChatError,
  setAssistantId,
  setAssistantFiles,
  debouncedSetChatMessages,
  syncWorkspaceFolders,
  updateLastMessage,
  updateChatMessage,
  addChatMessage,
  setSyncStatus,
  setIsStreaming,
  setStreamingMessageIndex,
  addNewMessageFile,
  updateNewMessageFile,
  syncChatMessages,
  clearChatSessions,
  createAssistant,
  createChatSession,
  createFolder,
  createMessage,
  createRun,
  createRunStream,
  createRunStreamWithFunctions,
  createThread,
  deleteAssistant,
  deleteFolder,
  fetchAssistantByThread,
  fetchAssistantList,
  fetchFileData,
  retrieveRun,
  setAbortController,
  setApiKey,
  getChatMessages,
  setAssistantImages,
  setAssistants,
  setAtCommand,
  setAvailableHostedModels,
  setAvailableLocalModels,
  setAvailableOpenRouterModels,
  setChatFileItems,
  setChatFiles,
  setChatImages,
  setChatMessages,
  setChatRequestData,
  setChatSessions,
  setChatSettings,
  setCollections,
  setError,
  setFiles,
  setFirstMessageReceived,
  setFirstTokenReceived,
  setFocusAssistant,
  setFocusFile,
  setFocusPrompt,
  setFocusTool,
  setFolders,
  setHashtagCommand,
  setHomeWorkSpace,
  setIsAssistantPickerOpen,
  setIsDisabled,
  setIsFilePickerOpen,
  setIsMessagesUpdated,
  setIsPromptPickerOpen,
  setIsToolPickerOpen,
  setLoading,
  setMode,
  setModels,
  setNewMessageFiles,
  setNewMessageImages,
  setOpenaiAssistants,
  setPresets,
  setPrompts,
  setSelectedAssistant,
  setSelectedChatSession,
  setSelectedFolder,
  setSelectedModel,
  setSelectedPreset,
  setSelectedPrompt,
  setSelectedTools,
  setSelectedWorkspace,
  setSessionHeader,
  setSessionId,
  setShowFilesDisplay,
  setSlashCommand,
  setSourceCount,
  setToolCommand,
  setToolInUse,
  setTools,
  setUseRetrieval,
  setUserInput,
  setWorkspaceId,
  setWorkspaceImages,
  setWorkspaces,
  updateAssistant,
  setChatLoading,
  setIsSubmitting,
  updateFolder,
  uploadAssistantFile,
  uploadFile,
  getAllStoredFiles,
  getStoredFilesByType,
  getStoredFilesBySpace,
  getStoredFileByName,
  getStoredFileById,
};

export {
  assistantReducer,
  baseChatReducer,
  chatSessionReducer,
  collectionReducer,
  fileReducer,
  folderReducer,
  modelReducer,
  presetReducer,
  promptReducer,
  toolReducer,
  workspaceReducer,
};
