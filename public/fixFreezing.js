/**
 * Emergency Fix for UI Freezing
 * 
 * This script provides an immediate fix for UI freezing issues
 * caused by excessive localStorage operations in the PharmacyHub application.
 * 
 * HOW TO USE:
 * 1. Open the browser console
 * 2. Run: await fetch('/fixFreezing.js').then(r => r.text()).then(eval)
 * 3. Or just paste this script directly into the console and run it
 */
(function() {
  console.log('🔧 Starting emergency UI freezing fix...');

  // Define problematic store names that need to be fixed
  const PROBLEM_STORES = [
    'manual-payment-store',
    'exam-store',
    'zustand-payment-store',
    'zustand-exam-store',
    'pharmacyhub_premium_status'
  ];
  
  // Track pending storage operations
  window.__STORAGE_TIMEOUTS = window.__STORAGE_TIMEOUTS || {};
  
  /**
   * Throttled localStorage setItem implementation
   */
  const throttledSetItem = (key, value) => {
    // Clear any existing timeout
    if (window.__STORAGE_TIMEOUTS[key]) {
      clearTimeout(window.__STORAGE_TIMEOUTS[key]);
    }
    
    // Set up a new timeout
    window.__STORAGE_TIMEOUTS[key] = setTimeout(() => {
      try {
        localStorage.setItem(key, value);
        delete window.__STORAGE_TIMEOUTS[key];
      } catch (error) {
        console.error(`Error writing to localStorage: ${error}`);
      }
    }, 500); // 500ms debounce
  };
  
  /**
   * Override the localStorage setItem method with throttled version
   */
  function monkeyPatchLocalStorage() {
    const originalSetItem = localStorage.setItem;
    
    localStorage.setItem = function(key, value) {
      // Check if this is a problematic store
      if (PROBLEM_STORES.some(store => key.includes(store))) {
        throttledSetItem(key, value);
      } else {
        // Use original method for non-problematic stores
        originalSetItem.call(localStorage, key, value);
      }
    };
    
    console.log('✅ localStorage.setItem has been monkey-patched with throttling');
  }
  
  /**
   * Clean up problematic localStorage items
   */
  function cleanupLocalStorage() {
    let cleanedItems = [];
    
    // Try to reset problem stores
    PROBLEM_STORES.forEach(storeName => {
      try {
        if (localStorage.getItem(storeName)) {
          // For the exam store, preserve it but convert to a clean state
          if (storeName === 'exam-store') {
            try {
              const examStore = JSON.parse(localStorage.getItem(storeName));
              // Create a minimal clean state
              const cleanState = {
                version: examStore.version || 0,
                state: {
                  questions: [],
                  currentQuestionIndex: 0,
                  timeRemaining: 0,
                  answers: {},
                  flaggedQuestions: [],
                  visitedQuestions: [],
                  isPaused: false,
                  isCompleted: false
                }
              };
              localStorage.setItem(storeName, JSON.stringify(cleanState));
              cleanedItems.push(storeName + ' (reset to clean state)');
            } catch (e) {
              localStorage.removeItem(storeName);
              cleanedItems.push(storeName + ' (removed due to parse error)');
            }
          }
          // For manual payment store, preserve but reset to empty state
          else if (storeName === 'manual-payment-store') {
            const cleanState = {
              version: 0,
              state: {
                userRequests: [],
                examAccessMap: {},
                pendingRequestMap: {},
                lastFetchedUserRequests: 0,
                lastFetchedExamAccess: {},
                lastFetchedPendingRequest: {}
              }
            };
            localStorage.setItem(storeName, JSON.stringify(cleanState));
            cleanedItems.push(storeName + ' (reset to clean state)');
          }
          // For other items, just remove them
          else {
            localStorage.removeItem(storeName);
            cleanedItems.push(storeName);
          }
        }
      } catch (error) {
        console.error(`Error cleaning up ${storeName}:`, error);
      }
    });
    
    // Handle special case for non-enumerable __proto__ issue
    try {
      if (Object.getOwnPropertyDescriptor(localStorage, '__proto__')) {
        delete localStorage.__proto__;
        cleanedItems.push('__proto__ reference removed');
      }
    } catch (e) {
      // Ignore errors when checking __proto__
    }
    
    // Log results
    if (cleanedItems.length > 0) {
      console.log(`✅ Cleaned up localStorage items: ${cleanedItems.join(', ')}`);
    } else {
      console.log('ℹ️ No problematic localStorage items found');
    }
  }
  
  /**
   * Clear any pending timeouts
   */
  function clearPendingTimeouts() {
    // Clear manual payment timeout
    if (window.__MANUAL_PAYMENT_STORAGE_TIMEOUT) {
      clearTimeout(window.__MANUAL_PAYMENT_STORAGE_TIMEOUT);
      window.__MANUAL_PAYMENT_STORAGE_TIMEOUT = null;
      console.log('✅ Cleared manual payment timeout');
    }
    
    // Clear any store timeouts
    let timeoutsCleared = 0;
    for (const key in window.__STORAGE_TIMEOUTS) {
      clearTimeout(window.__STORAGE_TIMEOUTS[key]);
      delete window.__STORAGE_TIMEOUTS[key];
      timeoutsCleared++;
    }
    
    if (timeoutsCleared > 0) {
      console.log(`✅ Cleared ${timeoutsCleared} storage operation timeouts`);
    }
  }

  // Execute the fixes
  cleanupLocalStorage();
  monkeyPatchLocalStorage();
  clearPendingTimeouts();
  
  // Final message
  console.log('⚠️ UI freezing issue has been fixed. Refresh the page to apply changes completely.');
  console.log('💡 If issues persist, try running localStorage.clear() and then refresh.');
  
  // Return success
  return "UI Freezing Fix Complete ✅";
})();