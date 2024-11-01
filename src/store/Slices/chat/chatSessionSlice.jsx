import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { debounce } from 'lodash';

import { chatApi } from 'api/Ai/chat-sessions';

import {
  clearLocalDataAtStore,
  createAsyncThunkWithErrorHandling,
  getLocalData,
  setLocalData,
} from '../helpers';

const LOCAL_NAME = 'chatSessionStore';
const REDUX_NAME = 'chatSessions';
const FETCH_INTERVAL = 30000; // 30 seconds
const SYNC_INTERVAL = 5000; // 5 seconds
let lastFetchTime = 0;
let syncTimeout = null;

export const createTempMessage = () => ({
  _id: `assistant-${Date.now()}`,
  role: 'assistant',
  content: '',
  isComplete: false,
});

export const handleAsyncError = (state, error) => {
  state.error = error;
  state.streaming = false;
  state.loading = false;
};

const initialState = {
  ...getLocalData(LOCAL_NAME, REDUX_NAME),
  entities: {}, // Normalized chat messages
  sessionId: null,
  messageIds: [], // Store message IDs in an array
  streaming: false,
  streamingMessageId: null,
  topic: '',
  error: null,
  pendingSync: false,
  chatSettings: {},
  apiKey: '',
  isApiKeySet: false,
};

const setLocalSessionData = data => setLocalData(LOCAL_NAME, data);

const clearLocalSessionData = () =>
  clearLocalDataAtStore(LOCAL_NAME, REDUX_NAME);

export const createChatSession = createAsyncThunkWithErrorHandling(
  `${REDUX_NAME}/create`,
  async (newSessionData, { dispatch }) => {
    const data = await chatApi.create(newSessionData);
    dispatch(setSessionId(data._id));
    return data;
  }
);

export const fetchSessions = createAsyncThunkWithErrorHandling(
  `${REDUX_NAME}/fetchAll`,
  async () => await chatApi.getAll()
);

export const updateSessions = createAsyncThunkWithErrorHandling(
  `${REDUX_NAME}/update`,
  async ({ sessionId, sessionData }) =>
    await chatApi.update(sessionId, sessionData)
);

export const syncChatMessages = createAsyncThunkWithErrorHandling(
  `${REDUX_NAME}/syncMessages`,
  async (_, { getState, dispatch }) => {
    const state = getState().chatSession;
    console.log('state', state);
    const { sessionId, chatMessages, pendingSync } = state;

    if (!sessionId || !pendingSync) return;

    const response = await chatApi.updateMessages(chatMessages);
    dispatch(setSyncStatus(false));
    return response;
  }
);

const scheduleSyncMessages = dispatch => {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => dispatch(syncChatMessages()), SYNC_INTERVAL);
};

export const fetchLatestMessages = createAsyncThunkWithErrorHandling(
  `${REDUX_NAME}/fetchLatestMessages`,
  async (_, { getState, dispatch }) => {
    const state = getState().chatSessions;
    const { sessionId } = state;

    if (!sessionId) return;

    const currentTime = Date.now();
    if (currentTime - lastFetchTime < FETCH_INTERVAL) return;

    lastFetchTime = currentTime;
    const response = await chatApi.getChatSessionMessages(sessionId);

    if (
      JSON.stringify(state.chatMessages) !== JSON.stringify(response.messages)
    ) {
      dispatch(setChatMessages(response.messages));
    }

    return response;
  }
);

const debouncedUpdateChatMessages = debounce(
  (dispatch, sessionId, messages) => {
    dispatch(updateChatMessages({ sessionId, messages }));
  },
  500
);

export const updateChatMessages = createAsyncThunk(
  `${REDUX_NAME}/updateChatMessages`,
  async ({ sessionId, messages }, { rejectWithValue }) => {
    try {
      const data = await chatApi.updateMessages(sessionId, messages);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getChatMessages = createAsyncThunk(
  `${REDUX_NAME}/getChatSessionMessages`,
  async ({ sessionId, messages }, { rejectWithValue }) => {
    try {
      const data = await chatApi.getChatSessionMessages();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendMessageStream = createAsyncThunkWithErrorHandling(
  `${REDUX_NAME}/sendMessageStream`,
  async ({ sessionId, userMessage }, { dispatch, rejectWithValue }) => {
    try {
      let assistantMessageId = null;

      // Create a new assistant message with temporary ID
      const tempMessage = {
        _id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        isComplete: false,
      };
      dispatch(addChatMessage(tempMessage));
      assistantMessageId = tempMessage._id;

      // Start streaming the assistant's response
      await chatApi.sendMessageStream(sessionId, userMessage, chunk => {
        dispatch(
          appendToChatMessage({
            _id: assistantMessageId,
            content: chunk,
          })
        );
      });

      // Mark the message as complete
      dispatch(
        completeChatMessage({
          _id: assistantMessageId,
        })
      );

      return assistantMessageId;
    } catch (error) {
      console.error('Error in sendMessageStream:', error);
      // Optionally, you can mark the message as failed
      dispatch(
        markChatMessageError({
          _id: `assistant-${Date.now()}`, // Or use another identifier
          error: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const debouncedSetChatMessages = (sessionId, messages) => dispatch => {
  debouncedUpdateChatMessages(dispatch, sessionId, messages);
};
// **Thunk to Handle Saving Chat Messages to Local Storage**
export const saveChatMessagesToLocal = () => (dispatch, getState) => {
  const state = getState().chatSessions;
  setLocalSessionData({ chatMessages: state.chatMessages });
};
export const chatSessionsSlice = createSlice({
  name: REDUX_NAME,
  initialState,
  reducers: {
    /* --- Chat Session --- */
    setSessionId: (state, action) => {
      console.log('setSessionId action payload', action.payload);
      state.sessionId = action.payload;
      sessionStorage.setItem('sessionId', action.payload);
      setLocalSessionData({ ...state, sessionId: action.payload });
    },
    setChatSessions: (state, action) => {
      console.log('SETTING CHAT SESSIONS', action.payload);
      state.chatSessions = action.payload;
      setLocalSessionData({ ...state, chatSessions: action.payload });
    },
    setSelectedChatSession: (state, action) => {
      console.log('SETTING SELECTED CHAT', action.payload);
      state.selectedChatSession = action.payload;
      setLocalSessionData({
        ...state,
        selectedChatSession: action.payload,
        chatMessages: action.payload?.messages,
      });
    },
    /* --- Chat Input --- */
    setApiKey: (state, action) => {
      console.log('SETTING API KEY', action.payload);
      state.apiKey = action.payload;
      state.isApiKeySet = action.payload.length > 0 ? true : false;
      sessionStorage.setItem('apiKey', action.payload);
      setLocalSessionData({ ...state, apiKey: action.payload });
    },
    setUserInput: (state, action) => {
      state.userInput = action.payload;
      setLocalSessionData({ ...state, userInput: action.payload });
    },
    /* --- Chat Message --- */
    setChatMessages: (state, action) => {
      console.log('SETTING CHAT MESSAGES:', action.payload);
      state.chatMessages = action.payload;
      state.pendingSync = true;
      setLocalSessionData({ ...state, chatMessages: action.payload });
    },
    addChatMessage: (state, action) => {
      console.log('ADDING CHAT MESSAGE:', action.payload);
      state.chatMessages.push(action.payload);
      state.pendingSync = true;
      setLocalSessionData({ ...state, chatMessages: state.chatMessages });
    },
    appendToChatMessage: (state, action) => {
      const { _id, content } = action.payload;
      console.log('APPENDING TO CHAT MESSAGE:', action.payload);
      const message = state.chatMessages.find(msg => msg._id === _id);
      if (message) {
        message.content += content;
      }
    },
    completeChatMessage: (state, action) => {
      const { _id, content } = action.payload;
      const message = state.chatMessages.find(msg => msg._id === _id);
      if (message) {
        message.isComplete = true;
        message.content = content;
      }
      console.log('COMPLETED CHAT MESSAGE:', action.payload);
      state.streaming = false;
      state.streamingMessageId = null;
    },
    markChatMessageError: (state, action) => {
      const { _id, error } = action.payload;
      const message = state.chatMessages.find(msg => msg._id === _id);
      if (message) {
        message.error = error;
        message.content = error;
        message.isComplete = true;
      }
      state.streaming = false;
      state.streamingMessageId = null;
      state.error = error;
    },
    markChatMessageComplete: (state, action) => {
      const { _id, error } = action.payload;
      const message = state.chatMessages.find(msg => msg._id === _id);
      if (message) {
        message.isComplete = true;
        message.isStreaming = false;
      }
    },
    updateChatMessage: (state, action) => {
      const { _id, message } = action.payload;
      if (state.entities[_id]) {
        state.entities[_id] = message;
        state.pendingSync = true;
      }
    },
    /* --- Chat Status --- */
    setChatStreaming: (state, action) => {
      state.isChatStreaming = action.payload;
    },
    setChatLoading: (state, action) => {
      state.isChatStreaming = action.payload;
    },
    setChatDisabled: (state, action) => {
      state.isChatDisabled = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    setChatError: (state, action) => {
      state.chatError = action.payload;
    },
    setStreamingMessageId: (state, action) => {
      state.streamingMessageId = action.payload;
    },
    setSyncStatus: (state, action) => {
      state.pendingSync = action.payload;
    },
    /* --- Chat Settings --- */
    setChatSettings: (state, action) => {
      state.chatSettings = action.payload;
      setLocalSessionData({ ...state, chatSettings: action.payload });
    },
    setChatFileItems: (state, action) => {
      state.chatFileItems = action.payload;
      setLocalSessionData({ ...state, chatFileItems: action.payload });
    },
    /* --- Miscellaneous --- */
    clearChatMessages: state => {
      state.chatMessages = [];
    },
    clearChatSessions: state => {
      clearLocalSessionData();
      Object.assign(state, initialState);
    },
    extraReducers: builder => {
      builder
        .addCase(createChatSession.fulfilled, (state, action) => {
          const newSession = action.payload;
          state.chatSessions.push(newSession);
          state.activeSession = newSession;
          state.selectedSession = newSession;
          state.sessionId = newSession._id;
          setLocalSessionData({
            ...state,
            chatSessions: state.chatSessions,
            activeSession: newSession,
            sessionId: newSession._id,
          });
        })
        .addCase(createChatSession.rejected, (state, action) => {
          console.error('Failed to create chat session:', action.payload);
        })
        .addCase(syncChatMessages.fulfilled, (state, action) => {
          if (action.payload) {
            state.pendingSync = false;
          }
        })
        .addCase(syncChatMessages.rejected, (state, action) => {
          console.error('Failed to sync chat messages:', action.payload);
        })
        .addCase(getChatMessages.fulfilled, (state, action) => {
          if (action.payload) {
            state.chatMessages = action.payload.messages;
            setLocalSessionData({ ...state, chatMessages: state.chatMessages });
          }
        })
        .addCase(getChatMessages.rejected, (state, action) => {
          console.error('Failed to get chat messages:', action.payload);
        })
        .addCase(fetchLatestMessages.fulfilled, (state, action) => {
          if (action.payload) {
            state.chatMessages = action.payload.messages;
            state.pendingSync = false;
            setLocalSessionData({ ...state, chatMessages: state.chatMessages });
          }
        })
        // **Handle sendMessageStream Thunk**
        .addCase(sendMessageStream.pending, (state, action) => {
          state.streaming = true;
          state.error = null;
        })
        .addCase(sendMessageStream.fulfilled, (state, action) => {
          // No additional state updates required here as handled in reducers
        })
        .addCase(sendMessageStream.rejected, (state, action) => {
          state.streaming = false;
          state.error = action.payload;
        });
    },
  },
});

export { initialState as chatSessionsInitialState };

export const {
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
} = chatSessionsSlice.actions;
// Memoized selectors for better performance
export const selectChatMessages = createSelector(
  [
    state => state.chatSessions.messageIds,
    state => state.chatSessions.entities,
  ],
  (messageIds, entities) => messageIds.map(id => entities[id])
);

export const selectChatMessagesById = (state, messageId) =>
  state.chatSessions.entities[messageId];

export const updateLocalChatMessages =
  (message, index = -1) =>
  (dispatch, getState) => {
    if (index === -1) {
      dispatch(addChatMessage(message));
    } else {
      dispatch(updateChatMessage({ index, message }));
    }
    scheduleSyncMessages(dispatch);
    dispatch(saveChatMessagesToLocal());
  };

export default chatSessionsSlice.reducer;
