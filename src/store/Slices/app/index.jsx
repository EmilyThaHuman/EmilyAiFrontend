// Importing actions from profileSlice
import apiReducer, { logApiRequest } from './apiSlice';
import appReducer, {
  setSidebarOpen,
  setTheme,
  setPageLoading,
} from './appSlice';
import toastReducer, {
  addToast,
  updateToast,
  dismissToast,
  removeToast,
} from './toastSlice';

export {
  logApiRequest,
  setSidebarOpen,
  setTheme,
  setPageLoading,
  addToast,
  updateToast,
  dismissToast,
  removeToast,
};

export { apiReducer, appReducer, toastReducer };
