import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';

import { getLocalData, setLocalData } from '../helpers';

const LOCAL_NAME = 'toolStore';
const REDUX_NAME = 'tools';

const initialState = getLocalData(LOCAL_NAME, REDUX_NAME);

function setLocalToolData(data) {
  setLocalData(LOCAL_NAME, data);
}

export const toolSlice = createSlice({
  name: REDUX_NAME,
  initialState,
  reducers: {
    setToolId: (state, action) => {
      let toolId;
      if (action.payload && action.payload !== '') {
        toolId = action.payload;
      } else {
        const warn = 'No tool ID provided. Using default tool ID.';
        toast.warn(warn);
      }
      state.toolId = toolId;
      sessionStorage.setItem('toolId', toolId);
      setLocalToolData({ ...state, toolId: toolId });
    },
    setTools: (state, action) => {
      console.log('action.payload', action.payload);
      state.tools = action.payload;
      setLocalToolData({ ...state, tools: action.payload });
    },
    setSelectedTools: (state, action) => {
      state.selectedTools = action.payload;
      setLocalToolData({ ...state, selectedTools: action.payload });
    },
    setToolInUse: (state, action) => {
      state.toolInUse = action.payload;
      setLocalToolData({ ...state, toolInUse: action.payload });
    },
  },
});

export { initialState as toolInitialState };

export const { setTools, setSelectedTools, setToolInUse, setToolId } =
  toolSlice.actions;

export default toolSlice.reducer;
