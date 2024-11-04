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
/*
'use client';
import { m } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import { useLoadingStore } from 'contexts/LoadingProvider';

const variants = {
  in: {
    opacity: 1,
    scale: 1,
    // x: 0,
    transition: {
      duration: 0.1,
      // type: "ease",
      // type: "ease",
    },
  },
  out: {
    opacity: 0,
    // x: 10,
    scale: 0.994,
    transition: {
      duration: 0.1,
      // type: "ease",
      // type: "ease",
    },
  },
};

export const Transition = ({ children }) => {
  const { isLoading } = useLoadingStore();
  const location = useLocation();
  const path = location.pathname;
  return (
    <m.div
      key={path}
      variants={variants}
      animate="in"
      initial="out"
      exit="out"
      className={`transition-container ${isLoading ? 'loading' : ''}`}
    >
      {children}
    </m.div>
  );
};

export default Transition;
*/
