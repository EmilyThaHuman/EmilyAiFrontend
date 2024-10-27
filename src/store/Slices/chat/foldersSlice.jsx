import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';

import { workspacesApi } from 'api/workspaces';

import { getLocalData, setLocalData } from '../helpers';

const LOCAL_NAME = 'folderStore';
const REDUX_NAME = 'folders';

const initialState = getLocalData(LOCAL_NAME, REDUX_NAME);

function setLocalFolderData(data) {
  setLocalData(LOCAL_NAME, data);
}

export const createFolder = createAsyncThunk(
  'folders/create',
  async (folderData, { rejectWithValue }) => {
    try {
      const data = await workspacesApi.createWorkspaceFolder(folderData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFolder = createAsyncThunk(
  'folders/delete',
  async (folderId, { rejectWithValue }) => {
    try {
      const data = await workspacesApi.deleteWorkspaceFolder(folderId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFolder = createAsyncThunk(
  'folders/update',
  async (folderData, { rejectWithValue }) => {
    try {
      const data = await workspacesApi.syncFolders(folderData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const foldersSlice = createSlice({
  name: REDUX_NAME,
  initialState,
  reducers: {
    setFolderId: (state, action) => {
      let folderId;
      if (action.payload && action.payload !== '') {
        folderId = action.payload;
      } else {
        const warn = 'No folder ID provided. Using default folder ID.';
        toast.warning(warn);
      }
      state.folderId = folderId;
      sessionStorage.setItem('folderId', folderId);
      setLocalFolderData({ ...state, folderId: folderId });
    },
    setFolders: (state, action) => {
      state.folders = action.payload;
      setLocalFolderData({ ...state, folders: action.payload });
    },
    setSelectedFolder: (state, action) => {
      state.selectedFolder = action.payload;
      setLocalFolderData({ ...state, selectedFolder: action.payload });
    },
  },
  extraReducers: builder => {
    builder
      .addCase(updateFolder.fulfilled, (state, action) => {
        state.selectedFolder = action.payload;
        setLocalFolderData({ ...state, selectedFolder: action.payload });
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.folders.unshift(action.payload);
        setLocalFolderData({ ...state, folders: state.folders });
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.folders = state.folders.filter(
          folder => folder.id !== action.payload
        );
        setLocalFolderData({ ...state, folders: state.folders });
      });
  },
});

export { initialState as foldersInitialState };

export const { setFolders, setSelectedFolder } = foldersSlice.actions;

export default foldersSlice.reducer;
