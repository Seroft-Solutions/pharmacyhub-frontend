/**
 * Core State Management
 * 
 * This module provides state management utilities for the application.
 */

// Export store factory
export { 
  createStore, 
  createSelectors, 
  createStoreFactory 
} from './storeFactory';

// Export context factory
export {
  createContextProvider,
  withContextProvider
} from './contextFactory';

// Export types
export type { StoreOptions } from './storeFactory';
export type { ContextOptions } from './contextFactory';

// Add other state management exports as they are created
