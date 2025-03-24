/**
 * Throttled Storage Adapter
 * 
 * This module provides a throttled storage adapter for Zustand's persist middleware.
 * It prevents excessive localStorage operations that can cause UI freezing by:
 * 1. Batching write operations
 * 2. Using debouncing to limit frequency
 * 3. Adding safety checks for browser compatibility and errors
 * 
 * Usage:
 * ```
 * import { throttledStorage } from '@/features/core/storage/throttledStorage';
 * import { createJSONStorage } from 'zustand/middleware';
 * 
 * const store = create(
 *   persist(
 *     (set, get) => ({ ... }),
 *     {
 *       name: 'store-name',
 *       storage: createJSONStorage(() => throttledStorage)
 *     }
 *   )
 * );
 * ```
 */

// Map to store pending updates
const pendingUpdates = new Map<string, { value: string; timer: any }>();

// Timeout to batch multiple updates
const DEBOUNCE_MS = 500;

/**
 * Throttled Storage Adapter
 * Prevents excessive localStorage operations by batching and debouncing
 */
export const throttledStorage = {
  /**
   * Get an item from localStorage with error handling
   */
  getItem: (name: string): string | null => {
    try {
      // Check if we have a pending update that hasn't been written yet
      const pendingUpdate = pendingUpdates.get(name);
      if (pendingUpdate) {
        return pendingUpdate.value;
      }
      
      // If we're not in a browser environment, return null
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return null;
      }
      
      // Get from localStorage with error handling
      return localStorage.getItem(name);
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return null;
    }
  },
  
  /**
   * Set an item to localStorage with throttling and error handling
   */
  setItem: (name: string, value: string): void => {
    try {
      // If we're not in a browser environment, do nothing
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
      }
      
      // Clear any existing timeout
      const existingUpdate = pendingUpdates.get(name);
      if (existingUpdate && existingUpdate.timer) {
        clearTimeout(existingUpdate.timer);
      }
      
      // Create a new timeout to batch writes
      const timer = setTimeout(() => {
        try {
          localStorage.setItem(name, value);
          pendingUpdates.delete(name);
          
          if (window.__ZUSTAND_DEBUG_MODE) {
            console.log(`[ThrottledStorage] Wrote ${name} to localStorage (${value.length} bytes)`);
          }
        } catch (error) {
          console.error(`Error writing to localStorage: ${error}`);
          
          // Try to recover by clearing localStorage if it might be full
          if (error instanceof DOMException && 
              (error.name === 'QuotaExceededError' || 
               error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
            
            console.warn('LocalStorage quota exceeded. Attempting recovery...');
            
            try {
              // Try to clear other items first
              const keysToKeep = ['auth_token', 'refresh_token', 'user_preferences'];
              const keysToRemove = [];
              
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && !keysToKeep.includes(key)) {
                  keysToRemove.push(key);
                }
              }
              
              // Remove non-essential items
              keysToRemove.forEach(key => {
                try {
                  localStorage.removeItem(key);
                } catch (e) {
                  // Ignore errors when cleaning up
                }
              });
              
              // Try writing again
              localStorage.setItem(name, value);
            } catch (recoveryError) {
              console.error('Failed to recover from storage quota error:', recoveryError);
            }
          }
        }
      }, DEBOUNCE_MS);
      
      // Store the pending update
      pendingUpdates.set(name, { value, timer });
      
    } catch (error) {
      console.error(`Error in setItem: ${error}`);
    }
  },
  
  /**
   * Remove an item from localStorage with error handling
   */
  removeItem: (name: string): void => {
    try {
      // If we're not in a browser environment, do nothing
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
      }
      
      // Clear any pending updates for this key
      const existingUpdate = pendingUpdates.get(name);
      if (existingUpdate && existingUpdate.timer) {
        clearTimeout(existingUpdate.timer);
      }
      pendingUpdates.delete(name);
      
      // Remove from localStorage
      localStorage.removeItem(name);
    } catch (error) {
      console.error(`Error removing from localStorage: ${error}`);
    }
  }
};

/**
 * Force flush all pending localStorage writes immediately
 * Useful when navigating away from the page or during cleanup
 */
export const flushStorage = (): void => {
  try {
    pendingUpdates.forEach((update, key) => {
      try {
        clearTimeout(update.timer);
        localStorage.setItem(key, update.value);
      } catch (e) {
        console.error(`Error flushing update for ${key}:`, e);
      }
    });
    pendingUpdates.clear();
  } catch (error) {
    console.error('Error flushing storage:', error);
  }
};

/**
 * Clear all LocalStorage entries that match a name pattern
 * @param pattern Substring to match in localStorage keys
 */
export const clearStorageByPattern = (pattern: string): void => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    
    const keysToRemove = [];
    
    // Find all matching keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(pattern)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove matching keys
    keysToRemove.forEach(key => {
      try {
        // Clear any pending updates
        const existingUpdate = pendingUpdates.get(key);
        if (existingUpdate && existingUpdate.timer) {
          clearTimeout(existingUpdate.timer);
        }
        pendingUpdates.delete(key);
        
        // Remove from localStorage
        localStorage.removeItem(key);
      } catch (e) {
        console.error(`Error removing ${key}:`, e);
      }
    });
    
    console.log(`Cleared ${keysToRemove.length} localStorage items matching "${pattern}"`);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

/**
 * Reset all application storage (for emergency use)
 * Preserves authentication tokens
 */
export const resetAppStorage = (): void => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    
    // Save authentication tokens
    const authToken = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    // Clear pending updates
    pendingUpdates.forEach((update) => {
      clearTimeout(update.timer);
    });
    pendingUpdates.clear();
    
    // Clear localStorage
    localStorage.clear();
    
    // Restore authentication tokens
    if (authToken) localStorage.setItem('auth_token', authToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    
    console.log('Application storage has been reset');
  } catch (error) {
    console.error('Error resetting app storage:', error);
  }
};

// Initialize listeners for page unload to flush pending writes
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushStorage);
  
  // Add debug mode flag
  (window as any).__ZUSTAND_DEBUG_MODE = false;
}

// Export default
export default throttledStorage;