import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { toast } from '@/services/toastService'; // Updated import
import { workspacesApi } from 'api/workspaces';

import { getLocalData, setLocalData } from '../helpers';

const LOCAL_NAME = 'workspaceStore';
const REDUX_NAME = 'workspaces';

const initialState = getLocalData(LOCAL_NAME, REDUX_NAME);

function setLocalWorkspaceData(data) {
  setLocalData(LOCAL_NAME, data);
}

// New thunk for syncing workspace folders
export const syncWorkspaceFolders = createAsyncThunk(
  'workspaces/syncFolders',
  async (workspaceId, { getState }) => {
    const state = getState();
    const { folders } = state.workspace.selectedWorkspace;
    const response = await workspacesApi.syncFolders({ folders });
    return response.data;
  }
);

// New thunk for syncing workspace folders
export const updateWorkspace = createAsyncThunk(
  'workspaces/update',
  async (workspaceId, { getState }) => {
    const state = getState();
    const { folders } = state.workspaces.selectedWorkspace;
    const response = await workspacesApi.update({ folders });
    return response.data;
  }
);

export const workspaceSlice = createSlice({
  name: REDUX_NAME,
  initialState,
  reducers: {
    setWorkspaceId: (state, action) => {
      let workspaceId;
      if (action.payload && action.payload !== '') {
        workspaceId = action.payload;
      } else {
        const warn = 'No workspace ID provided. Using default workspace ID.';
        toast.warning(warn);
        const userStore = JSON.parse(localStorage.getItem('userStore'));
        sessionStorage.setItem('workspaceId', userStore.user.homeWorkspaceId);
        workspaceId === userStore.user.homeWorkspaceId;
      }
      state.workspaceId = workspaceId;
      sessionStorage.setItem('workspaceId', workspaceId);
      setLocalWorkspaceData({ ...state, workspaceId: workspaceId });
    },
    setWorkspaces: (state, action) => {
      console.log('SETTING: WORKSPACES', action.payload);
      setLocalWorkspaceData({ ...state, workspaces: action.payload });
      state.workspaces = action.payload;
    },
    setSelectedWorkspace: (state, action) => {
      console.log('[SETTING_SELECTED_WORKSPACE]', action.payload);
      // setLocalWorkspaceData({ ...state, selectedWorkspace: action.payload });
      state.selectedWorkspace = action.payload;
    },
    setHomeWorkSpace: (state, action) => {
      console.log('SETTING: HOME_WORKSPACE', action.payload);
      setLocalWorkspaceData({ ...state, homeWorkSpace: action.payload });
      state.homeWorkSpace = action.payload;
    },
    setWorkspaceImages: (state, action) => {
      state.workspaceImages = action.payload;
    },
    extraReducers: builder => {
      builder
        .addCase(syncWorkspaceFolders.pending, state => {
          state.syncStatus = 'loading';
        })
        .addCase(syncWorkspaceFolders.fulfilled, (state, action) => {
          state.syncStatus = 'succeeded';
          state.selectedWorkspace.folders = action.payload.folders;
          setLocalWorkspaceData(state);
        })
        .addCase(syncWorkspaceFolders.rejected, (state, action) => {
          state.syncStatus = 'failed';
          state.error = action.error.message;
        });
    },
  },
});

export { initialState as workspaceInitialState };

export const {
  setWorkspaces,
  setSelectedWorkspace,
  setWorkspaceImages,
  setHomeWorkSpace,
  setWorkspaceId,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
// setChatSessions,
// setSelectedChatSession,
// function getLocalWorkspaceData() {
//   console.log(
//     `LOCAL_NAME: ${LOCAL_NAME}`,
//     'stringify' + JSON.stringify(LOCAL_NAME),
//     'regular' + LOCAL_NAME
//   );

//   const localWorkSpaceData = JSON.parse(
//     localStorage.getItem(LOCAL_NAME) || '{}'
//   );
//   return { ...defaultWorkspaceStoreData(), ...localWorkSpaceData };
// }

// const initialState = getLocalWorkspaceData();

// localStorage.setItem(LOCAL_NAME, JSON.stringify(data));
