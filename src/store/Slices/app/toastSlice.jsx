// src/store/toastSlice.js
import { createSlice } from '@reduxjs/toolkit';

import { clearLocalDataAtStore, getLocalData, setLocalData } from '../helpers';

let count = 0;

const generateId = () => {
  count += 1;
  return count.toString();
};

const TOAST_LIMIT = 3; // Maximum number of toasts visible at once
const TOAST_REMOVE_DELAY = 5000; // Duration before toast is removed (in ms)
const LOCAL_NAME = 'toastStore';
const REDUX_NAME = 'toasts';

const initialState = getLocalData(LOCAL_NAME, REDUX_NAME);

function setLocalToastData(data) {
  setLocalData(LOCAL_NAME, data);
}
const clearLocalToastData = () => clearLocalDataAtStore(LOCAL_NAME, REDUX_NAME);

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      const id = generateId();
      const newToast = { id, open: true, ...action.payload };
      const toasts = [newToast, ...state.toasts].slice(0, TOAST_LIMIT);
      state.toasts = toasts;
      setLocalToastData({ ...state, toasts });
    },
    updateToast: (state, action) => {
      const { id, updates } = action.payload;
      const toast = state.toasts.find(t => t.id === id);
      if (toast) {
        Object.assign(toast, updates);
        setLocalToastData({ ...state, toasts: [...state.toasts] });
      }
    },
    dismissToast: (state, action) => {
      const { id } = action.payload;
      if (id) {
        const toast = state.toasts.find(t => t.id === id);
        if (toast) {
          toast.open = false;
          setLocalToastData({ ...state, toasts: [...state.toasts] });
        }
      } else {
        state.toasts.forEach(toast => {
          toast.open = false;
          setLocalToastData({ ...state, toasts: [...state.toasts] });
        });
      }
    },
    removeToast: (state, action) => {
      const { id } = action.payload;
      state.toasts = state.toasts.filter(t => t.id !== id);
      setLocalToastData({ ...state, toasts: [...state.toasts] });
    },
  },
});

export const { addToast, updateToast, dismissToast, removeToast } =
  toastSlice.actions;

export default toastSlice.reducer;
