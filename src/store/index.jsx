import { configureStore } from '@reduxjs/toolkit';
import localforage from 'localforage';
import { offline } from 'redux-offline';
import offlineConfig from 'redux-offline/lib/defaults';

import { api } from '../lib';
import rootReducer from './Slices';

// Configure IndexedDB storage
offlineConfig.persistOptions = { storage: localforage };

// Integrate redux-offline middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for offline actions
    }).concat(api.middleware, offline(offlineConfig)),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools only in development
});

export const dispatch = store.dispatch;
export const setField = (field, value) => dispatch(setField({ field, value }));

export default store;
