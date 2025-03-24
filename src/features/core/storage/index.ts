/**
 * Storage Module
 * 
 * This module provides utilities and abstractions for working with browser storage.
 * It focuses on performance and reliability with features like throttling and error handling.
 */

// Export throttled storage utilities
export {
  throttledStorage,
  flushStorage,
  clearStorageByPattern, 
  resetAppStorage
} from './throttledStorage';

// Export persist utilities for Zustand stores
export {
  createPersistedStoreOptions,
  resetPersistedStore,
  getPersistedState,
  setPersistedState
} from './persistUtil';

// Add default module export
import persistUtil from './persistUtil';
export default persistUtil;