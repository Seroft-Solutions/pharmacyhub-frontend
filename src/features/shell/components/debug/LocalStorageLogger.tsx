"use client";

/**
 * This utility component logs localStorage changes to help with debugging
 * role persistence issues.
 */
export function LocalStorageLogger() {
  if (typeof window === 'undefined') return null;
  
  // Show localStorage contents on mount
  console.log("[LocalStorageLogger] Current localStorage state", {
    activeRole: localStorage.getItem('activeRole'),
    expandedItems: localStorage.getItem('sidebar-storage'),
    roleStorage: localStorage.getItem('role-storage')
  });
  
  // Monitor localStorage changes
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    console.log('[LocalStorageLogger] localStorage.setItem', { key, value });
    originalSetItem.apply(this, arguments);
  };
  
  const originalRemoveItem = localStorage.removeItem;
  localStorage.removeItem = function(key) {
    console.log('[LocalStorageLogger] localStorage.removeItem', { key });
    originalRemoveItem.apply(this, arguments);
  };
  
  // Clean up the overrides when the component is unmounted
  return null;
}

export default LocalStorageLogger;