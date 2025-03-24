/**
 * Emergency Reset Script
 * 
 * This script will clear all localStorage data and reset the application state.
 * Use this as a last resort when experiencing severe UI issues or data corruption.
 * 
 * HOW TO USE:
 * 1. Open the browser console
 * 2. Run: await fetch('/clearAll.js').then(r => r.text()).then(eval)
 * 3. The page will refresh automatically after clearing
 */
(function() {
  console.log('🚨 EMERGENCY RESET: Clearing all application data...');
  
  // Save auth tokens if they exist
  let authToken = null;
  let refreshToken = null;
  
  try {
    authToken = localStorage.getItem('auth_token');
    refreshToken = localStorage.getItem('refresh_token');
  } catch (e) {
    console.error('Failed to save auth tokens:', e);
  }
  
  // Clear all timeouts
  try {
    // Clear any known timeouts in our tracking objects
    if (window.__STORAGE_TIMEOUTS) {
      Object.values(window.__STORAGE_TIMEOUTS).forEach(timeout => {
        clearTimeout(timeout);
      });
    }
    
    if (window.__MANUAL_PAYMENT_STORAGE_TIMEOUT) {
      clearTimeout(window.__MANUAL_PAYMENT_STORAGE_TIMEOUT);
    }
    
    console.log('✅ Cleared all tracked timeouts');
  } catch (e) {
    console.error('Error clearing timeouts:', e);
  }
  
  // Clear localStorage
  try {
    localStorage.clear();
    console.log('✅ Cleared localStorage');
  } catch (e) {
    console.error('Failed to clear localStorage:', e);
  }
  
  // Restore auth tokens if they existed
  try {
    if (authToken) localStorage.setItem('auth_token', authToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    
    if (authToken || refreshToken) {
      console.log('✅ Restored authentication tokens');
    }
  } catch (e) {
    console.error('Failed to restore auth tokens:', e);
  }
  
  // Reset any monkey patching
  try {
    // Remove any patches and restore original methods
    delete localStorage.setItem;
    console.log('✅ Restored original localStorage implementation');
  } catch (e) {
    console.error('Error restoring original methods:', e);
  }
  
  console.log('🔄 COMPLETE: Application data has been reset');
  console.log('⚠️ PAGE WILL REFRESH IN 2 SECONDS...');
  
  // Refresh the page after a short delay
  setTimeout(() => {
    window.location.reload();
  }, 2000);
  
  return "Emergency Reset Complete - Page will refresh shortly ✅";
})();