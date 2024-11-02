// src/components/ui/theme/themeContext.js
import CssBaseline from '@mui/material/CssBaseline';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { getTheme } from '@/assets/theme';
import { useManageCookies } from '@/hooks';

export const ColorModeContext = createContext({
  mode: 'dark',
  toggleColorMode: () => {},
  theme: getTheme('dark'),
});

export const CustomThemeProvider = ({ children }) => {
  // const { addCookies, getCookie } = useManageCookies();
  // const initialMode = getCookie('colorMode') || 'dark';
  // const [mode, setMode] = useState(initialMode);

  // useEffect(() => {
  //   addCookies('colorMode', mode, { path: '/' });
  // }, [mode]);

  // const toggleColorMode = () => {
  //   const newMode = mode === 'dark' ? 'light' : 'dark';
  //   setMode(newMode);
  //   addCookies('colorMode', newMode, { path: '/' });
  // };

  // const theme = useMemo(() => getTheme(mode), [mode]);
  // Retrieve the user's theme preference from localStorage or default to 'light'
  const [mode, setMode] = useState(() => {
    const storedMode = localStorage.getItem('themeMode');
    return storedMode ? storedMode : 'light';
  });

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode(prevMode => {
          const nextMode = prevMode === 'dark' ? 'light' : 'dark';
          localStorage.setItem('themeMode', nextMode);
          return nextMode;
        });
      },
    }),
    []
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    // Optional: Synchronize with system theme preferences
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (!localStorage.getItem('themeMode')) {
        setMode(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const state = {
    mode,
    theme,
  };

  const actions = {
    toggleColorMode: colorMode.toggleColorMode,
  };

  const contextValue = {
    ...state,
    ...actions,
  };

  return (
    <ColorModeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);

export default CustomThemeProvider;
