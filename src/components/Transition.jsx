import React from 'react';

import { useLoadingStore } from 'contexts/LoadingProvider';

export const Transition = ({ children }) => {
  const { isLoading } = useLoadingStore();

  return (
    <div className={`transition-container ${isLoading ? 'loading' : ''}`}>
      {children}
      {isLoading && <div className="loading-overlay">Loading...</div>}
    </div>
  );
};

export default Transition;
