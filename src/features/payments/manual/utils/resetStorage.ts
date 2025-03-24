/**
 * Reset Manual Payment Storage Utility
 * 
 * This utility provides functions to clear the localStorage entries for
 * manual payments when issues occur.
 */

/**
 * Clear manual payment store data from localStorage
 * This is useful when there are issues with the payment data causing UI freezes
 */
export const clearManualPaymentStorage = (): void => {
  if (typeof window !== 'undefined') {
    // Remove the persisted manual payment store
    localStorage.removeItem('manual-payment-store');
    
    // Also remove any pending timeouts
    const existingTimeout = (window as any).__MANUAL_PAYMENT_STORAGE_TIMEOUT;
    if (existingTimeout) {
      window.clearTimeout(existingTimeout);
      (window as any).__MANUAL_PAYMENT_STORAGE_TIMEOUT = null;
    }
    
    console.log('Manual payment storage has been cleared. Please refresh the page.');
  }
};

/**
 * Reset manual payment store to clean state
 * This can be used in initialization code or as a recovery mechanism
 */
export const resetManualPaymentStore = (): void => {
  clearManualPaymentStorage();
  
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
  
  console.log('Manual payment store has been reset to a clean state. Please refresh the page.');
};

export default {
  clearManualPaymentStorage,
  resetManualPaymentStore
};