import React, { createContext, useState, useContext } from 'react';

// Create a context for loading state
const LoadingContext = createContext({
  startLoading: () => {},
  stopLoading: () => {},
  isLoading: false,
});

// Provider component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the loading context
export const useLoadingStore = () => useContext(LoadingContext);

export default LoadingProvider;
