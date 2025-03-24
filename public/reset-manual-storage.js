/**
 * Reset Manual Payment Storage Script
 * 
 * This script can be loaded in development environments to reset the manual payment
 * storage when UI freezing issues occur. It can be included via a script tag
 * in development mode.
 */
(function() {
  try {
    // Clear manual payment store
    localStorage.removeItem('manual-payment-store');
    
    // Set a clean initial state
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
    
    console.log('Manual payment store has been reset to a clean state.');
    
    // Clear any existing timeout
    if (window.__MANUAL_PAYMENT_STORAGE_TIMEOUT) {
      window.clearTimeout(window.__MANUAL_PAYMENT_STORAGE_TIMEOUT);
      window.__MANUAL_PAYMENT_STORAGE_TIMEOUT = null;
    }
  } catch (error) {
    console.error('Failed to reset manual payment store:', error);
  }
})();