/**
 * Emergency Reset Script for PharmacyHub Frontend
 * 
 * This script fixes common issues that can cause UI freezing or infinite loading:
 * 1. Clears corrupted localStorage data related to payments and premium status
 * 2. Resets API cache
 * 3. Provides a clean state for the application
 * 
 * HOW TO USE:
 * 1. Load this script in console when experiencing UI freezes
 * 2. Refresh the page after running
 * 3. If issues persist, try to manually run the cleanupLocalStorage() function
 */
(function() {
  console.log('Starting emergency cleanup process...');
  
  // Clean up all localStorage payment-related items
  function cleanupLocalStorage() {
    try {
      // Keys to clean up
      const keysToClean = [
        'manual-payment-store',
        'zustand-payment-store',
        'pharmacyhub_premium_status',
        'premium-access-cache',
        'manual-requests-cache',
        'payment-history-cache',
        'exam-questions-cache'
      ];
      
      // Loop through and remove all keys
      let cleaned = 0;
      keysToClean.forEach(key => {
        if (localStorage.getItem(key) !== null) {
          localStorage.removeItem(key);
          cleaned++;
          console.log(`✅ Removed ${key} from localStorage`);
        }
      });
      
      // Also clean any potential zustand persisted stores
      let zustandItems = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('payment') || key.includes('premium') || key.includes('zustand'))) {
          zustandItems.push(key);
        }
      }
      
      // Remove any additional zustand items found
      zustandItems.forEach(key => {
        localStorage.removeItem(key);
        cleaned++;
        console.log(`✅ Removed additional item: ${key}`);
      });
      
      // Set a clean default state for manual payment store
      localStorage.setItem('manual-payment-store', JSON.stringify({
        state: {
          userRequests: [],
          examAccessMap: {},
          pendingRequestMap: {},
          lastFetchedUserRequests: 0,
          lastFetchedExamAccess: {},
          lastFetchedPendingRequest: {}
        },
        version: 0
      }));
      
      // Set premium status to false
      localStorage.setItem('pharmacyhub_premium_status', 'false');
      
      console.log(`🧹 Cleaned up ${cleaned} items from localStorage`);
      console.log(`✅ Set default state for payment stores`);
      
      return true;
    } catch (error) {
      console.error('❌ Error cleaning up localStorage:', error);
      return false;
    }
  }
  
  // Clear any pending timeouts
  function clearPendingTimeouts() {
    try {
      // Clear manual payment timeout
      if (window.__MANUAL_PAYMENT_STORAGE_TIMEOUT) {
        window.clearTimeout(window.__MANUAL_PAYMENT_STORAGE_TIMEOUT);
        window.__MANUAL_PAYMENT_STORAGE_TIMEOUT = null;
        console.log('✅ Cleared manual payment timeout');
      }
      
      // Clear any other known timeouts
      ['__PREMIUM_CHECK_TIMEOUT', '__API_REFRESH_TIMEOUT', '__EXAM_REFRESH_TIMEOUT'].forEach(timeoutName => {
        if (window[timeoutName]) {
          window.clearTimeout(window[timeoutName]);
          window[timeoutName] = null;
          console.log(`✅ Cleared ${timeoutName}`);
        }
      });
      
      return true;
    } catch (error) {
      console.error('❌ Error clearing timeouts:', error);
      return false;
    }
  }
  
  // Attempt to clear React Query cache if it exists
  function clearReactQueryCache() {
    try {
      // If window.__REACT_QUERY_GLOBAL_CLIENT exists, invalidate all queries
      if (window.__REACT_QUERY_GLOBAL_CLIENT && typeof window.__REACT_QUERY_GLOBAL_CLIENT.invalidateQueries === 'function') {
        window.__REACT_QUERY_GLOBAL_CLIENT.invalidateQueries();
        console.log('✅ Invalidated React Query cache');
        return true;
      }
      
      // If TanStack Query is using the older ReactQueryDevtools
      if (window.__REACT_QUERY_DEVTOOLS && window.__REACT_QUERY_DEVTOOLS.reactQuery) {
        window.__REACT_QUERY_DEVTOOLS.reactQuery.invalidateQueries();
        console.log('✅ Invalidated React Query cache (via devtools)');
        return true;
      }
      
      console.log('⚠️ React Query client not found, skipping cache invalidation');
      return false;
    } catch (error) {
      console.error('❌ Error clearing React Query cache:', error);
      return false;
    }
  }
  
  // Main cleanup function
  function performEmergencyCleanup() {
    console.log('🚨 Starting emergency cleanup...');
    
    // Step 1: Clean localStorage
    const localStorageClean = cleanupLocalStorage();
    
    // Step 2: Clear pending timeouts
    const timeoutsClean = clearPendingTimeouts();
    
    // Step 3: Try to clear React Query cache
    const queryCacheClean = clearReactQueryCache();
    
    // Report results
    console.log('\n========== Emergency Cleanup Results ==========');
    console.log(`LocalStorage: ${localStorageClean ? '✅ CLEAN' : '❌ FAILED'}`);
    console.log(`Timeouts: ${timeoutsClean ? '✅ CLEAN' : '❌ FAILED'}`);
    console.log(`Query Cache: ${queryCacheClean ? '✅ CLEAN' : '⚠️ SKIPPED'}`);
    console.log('\n📣 Please refresh the page now for changes to take effect.');
    console.log('💡 If issues persist, try running emergency.hardReset() in the console.');
  }
  
  // Hard reset (completely wipe localStorage)
  function hardReset() {
    try {
      // Save a backup of session data if needed
      const authToken = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      // Clear all localStorage
      localStorage.clear();
      console.log('✅ Cleared all localStorage data');
      
      // Restore critical auth data if needed
      if (authToken) localStorage.setItem('auth_token', authToken);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
      console.log('✅ Restored authentication tokens');
      
      console.log('🔥 Hard reset complete - please refresh the page');
      return true;
    } catch (error) {
      console.error('❌ Error performing hard reset:', error);
      return false;
    }
  }
  
  // Execute cleanup
  performEmergencyCleanup();
  
  // Expose methods globally for manual use
  window.emergency = {
    cleanup: performEmergencyCleanup,
    clearStorage: cleanupLocalStorage,
    clearTimeouts: clearPendingTimeouts,
    clearQueryCache: clearReactQueryCache,
    hardReset: hardReset
  };
  
  console.log('💡 Emergency cleanup tools added to window.emergency');
})();