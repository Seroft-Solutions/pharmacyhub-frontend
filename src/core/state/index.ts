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

// Export types
export type { StoreOptions } from './storeFactory';

// Add other state management exports as they are created
