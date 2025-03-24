/**
 * Persisted Store Utilities
 * 
 * This module provides utilities for working with persisted Zustand stores.
 * It includes helpers for creating enhanced persisted stores with throttling,
 * debugging, and cleanup functions.
 */
import { StateStorage, PersistOptions, StorageValue } from 'zustand/middleware';
import { throttledStorage, clearStorageByPattern, resetAppStorage } from './throttledStorage';
import { createJSONStorage } from 'zustand/middleware';

/**
 * Enhanced persist options with automatic throttling
 * @param name The name of the store in localStorage
 * @param options Additional persist options
 * @returns Configure persist options with throttled storage
 */
export const createPersistedStoreOptions = <T>(
  name: string,
  options?: Partial<PersistOptions<T, T>>
): PersistOptions<T, T> => {
  return {
    name,
    // Use throttled storage by default
    storage: createJSONStorage(() => throttledStorage),
    // Add any custom options
    ...options
  };
};

/**
 * Reset a specific persisted store
 * @param storeName The name of the store in localStorage
 */
export const resetPersistedStore = (storeName: string): void => {
  try {
    throttledStorage.removeItem(storeName);
    console.log(`Store "${storeName}" has been reset`);
  } catch (error) {
    console.error(`Error resetting store "${storeName}":`, error);
  }
};

/**
 * Get the current state of a persisted store from localStorage
 * @param storeName The name of the store in localStorage
 * @returns The parsed state or null if not found/invalid
 */
export const getPersistedState = <T>(storeName: string): T | null => {
  try {
    const rawState = throttledStorage.getItem(storeName);
    if (!rawState) return null;
    
    const parsedState = JSON.parse(rawState) as StorageValue<T>;
    if (!parsedState || !parsedState.state) return null;
    
    return parsedState.state as T;
  } catch (error) {
    console.error(`Error reading persisted state for "${storeName}":`, error);
    return null;
  }
};

/**
 * Set the state of a persisted store directly in localStorage
 * Useful for debugging or testing
 * @param storeName The name of the store in localStorage
 * @param state The new state to persist
 */
export const setPersistedState = <T>(storeName: string, state: T): void => {
  try {
    const currentRaw = throttledStorage.getItem(storeName);
    let currentVersion = 0;
    
    // Get the current version number if available
    if (currentRaw) {
      try {
        const current = JSON.parse(currentRaw) as StorageValue<T>;
        currentVersion = current.version || 0;
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    // Create the storage value with the new state and incremented version
    const storageValue: StorageValue<T> = {
      state,
      version: currentVersion + 1
    };
    
    // Persist to storage
    throttledStorage.setItem(storeName, JSON.stringify(storageValue));
    console.log(`State for "${storeName}" has been updated`);
  } catch (error) {
    console.error(`Error setting persisted state for "${storeName}":`, error);
  }
};

// Export everything
export {
  throttledStorage,
  clearStorageByPattern,
  resetAppStorage
};

// Default export
export default {
  createPersistedStoreOptions,
  resetPersistedStore,
  getPersistedState,
  setPersistedState,
  throttledStorage,
  clearStorageByPattern,
  resetAppStorage
};