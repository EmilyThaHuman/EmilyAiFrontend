import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { chatApi } from 'api/Ai/chat-sessions';

import { getLocalData, setLocalData } from '../helpers';

const LOCAL_NAME = 'baseChatStore';
const REDUX_NAME = 'baseChat';

const initialState = getLocalData(LOCAL_NAME, REDUX_NAME);

function setLocalBaseChatData(data) {
  setLocalData(LOCAL_NAME, data);
}

export const baseChatSlice = createSlice({
  name: REDUX_NAME,
  initialState,
  reducers: {
    setStreamingMessageIndex: (state, action) => {
      state.streamingMessageIndex = action.payload;
    },
    setFirstTokenReceived: (state, action) => {
      state.firstTokenReceived = action.payload;
    },
    setAbortController: (state, action) => {
      state.abortController = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    setChatLoading: (state, action) => {
      state.chatLoading = action.payload;
      setLocalBaseChatData({ ...state, chatLoading: action.payload });
    },
    setChatError: (state, action) => {
      state.chatError = action.payload;
      setLocalBaseChatData({ ...state, chatError: action.payload });
    },
    // -- secondary commands --
    setIsPromptPickerOpen: (state, action) => {
      state.isPromptPickerOpen = action.payload;
      setLocalBaseChatData({ ...state, isPromptPickerOpen: action.payload });
    },
    setIsFilePickerOpen: (state, action) => {
      state.isFilePickerOpen = action.payload;
      setLocalBaseChatData({ ...state, isFilePickerOpen: action.payload });
    },
    setIsToolPickerOpen: (state, action) => {
      state.isToolPickerOpen = action.payload;
      setLocalBaseChatData({ ...state, isToolPickerOpen: action.payload });
    },
    setFocusPrompt: (state, action) => {
      state.focusPrompt = action.payload;
      setLocalBaseChatData({ ...state, focusPrompt: action.payload });
    },
    setFocusFile: (state, action) => {
      state.focusFile = action.payload;
      setLocalBaseChatData({ ...state, focusFile: action.payload });
    },
    setFocusTool: (state, action) => {
      state.focusTool = action.payload;
      setLocalBaseChatData({ ...state, focusTool: action.payload });
    },
    setFocusAssistant: (state, action) => {
      state.focusAssistant = action.payload;
      setLocalBaseChatData({ ...state, focusAssistant: action.payload });
    },
    setHashtagCommand: (state, action) => {
      state.hashtagCommand = action.payload;
      setLocalBaseChatData({ ...state, hashtagCommand: action.payload });
    },
    setSlashCommand: (state, action) => {
      state.slashCommand = action.payload;
      setLocalBaseChatData({ ...state, slashCommand: action.payload });
    },
    setToolCommand: (state, action) => {
      state.toolCommand = action.payload;
      setLocalBaseChatData({ ...state, toolCommand: action.payload });
    },
    setAtCommand: (state, action) => {
      state.atCommand = action.payload;
      setLocalBaseChatData({ ...state, atCommand: action.payload });
    },
    setIsAssistantPickerOpen: (state, action) => {
      state.isAssistantPickerOpen = action.payload;
      setLocalBaseChatData({
        ...state,
        isAssistantPickerOpen: action.payload,
      });
    },
    setUseRetrieval: (state, action) => {
      state.useRetrieval = action.payload;
      setLocalBaseChatData({ ...state, useRetrieval: action.payload });
    },
    setSourceCount: (state, action) => {
      state.sourceCount = action.payload;
      setLocalBaseChatData({ ...state, sourceCount: action.payload });
    },
  },
});

export const {
  setMode,
  setLoading,
  setError,
  setChatRequestData,
  setIsDisabled,
  setStreamingMessageIndex,
  setIsStreaming,
  setAbortController,
  setIsSubmitting,
  setChatLoading,
  setChatError,
  // -- secondary commands --
  setIsPromptPickerOpen,
  setSlashCommand,
  setIsFilePickerOpen,
  setHashtagCommand,
  setIsToolPickerOpen,
  setToolCommand,
  setFocusPrompt,
  setFocusFile,
  setFocusTool,
  setFocusAssistant,
  setAtCommand,
  setIsAssistantPickerOpen,
  setFirstTokenReceived,
  setIsMessagesUpdated,
  setFirstMessageReceived,
  setUseRetrieval,
  setSourceCount,
} = baseChatSlice.actions;

export default baseChatSlice.reducer;
