// components/HistoryTracker.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const HistoryTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // This code runs every time the location changes
    const history = JSON.parse(localStorage.getItem('navigationHistory')) || [];

    // Add the new entry
    history.push({
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      timestamp: new Date().toISOString(),
    });

    // Optionally, limit the history size to prevent local storage overflow
    const maxHistoryLength = 50; // Adjust as needed
    if (history.length > maxHistoryLength) {
      history.shift(); // Remove the oldest entry
    }

    // Save back to local storage
    localStorage.setItem('navigationHistory', JSON.stringify(history));
  }, [location]);

  return null; // This component doesn't render anything
};

export default HistoryTracker;
