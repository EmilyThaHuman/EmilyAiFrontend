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
  setHashtagCommand,
  setIsAssistantPickerOpen,
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
} from './baseChatSlice';
import chatSessionReducer, {
  // --- thunks --- //
  createChatSession,
  syncChatMessages,
  getChatMessages,
  debouncedSetChatMessages,
  fetchSessions,
  updateSessions,
  fetchLatestMessages,
  updateChatMessages,
  saveChatMessagesToLocal,
  // --- actions --- //
  // session //
  setSessionId,
  setChatSessions,
  setSelectedChatSession,
  // input //
  setApiKey,
  setUserInput,
  // messages //
  setChatMessages,
  addChatMessage,
  appendToChatMessage,
  completeChatMessage,
  markChatMessageError,
  markChatMessageComplete,
  updateChatMessage,
  // status //
  setChatLoading,
  setChatDisabled,
  setChatStreaming,
  setIsSubmitting,
  setChatError,
  setStreamingMessageId,
  setSyncStatus,
  // settings //
  setChatSettings,
  setChatFileItems,
  // clear //
  clearChatSessions,
  clearChatMessages,
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
  appendToChatMessage,
  completeChatMessage,
  markChatMessageError,
  setStreamingMessageId,
  debouncedSetChatMessages,
  syncWorkspaceFolders,
  updateChatMessage,
  addChatMessage,
  setSyncStatus,
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
  setIsSubmitting,
  updateFolder,
  uploadAssistantFile,
  uploadFile,
  getAllStoredFiles,
  getStoredFilesByType,
  getStoredFilesBySpace,
  getStoredFileByName,
  getStoredFileById,
  markChatMessageComplete,
  setChatLoading,
  setChatDisabled,
  setChatStreaming,
  clearChatMessages,
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
