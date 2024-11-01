import React, { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setPageLoading, setSidebarOpen, setTheme } from 'store/Slices';

export const AppContext = createContext({
  state: {
    sidebarOpen: false,
    theme: 'light',
    pageLoading: false,
  },
  actions: {
    setSidebarOpen: () => {},
    setTheme: () => {},
  },
});

export const AppProvider = ({ children }) => {
  const state = useSelector(state => state.app);
  const dispatch = useDispatch();
  const actions = {
    setSidebarOpen: collapsed => dispatch(setSidebarOpen(collapsed)),
    setTheme: theme => dispatch(setTheme(theme)),
    setPageLoading: loading => dispatch(setPageLoading(loading)),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => useContext(AppContext);

export default AppProvider;
