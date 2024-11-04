// Importing actions from profileSlice
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
  setSidebarOpen,
  setTheme,
  setPageLoading,
  addToast,
  updateToast,
  dismissToast,
  removeToast,
};

export { appReducer, toastReducer };
