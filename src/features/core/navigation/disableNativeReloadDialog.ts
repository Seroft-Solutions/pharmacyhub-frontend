'use client';

/**
 * Global script to disable native reload dialogs
 * 
 * This needs to be imported as early as possible in the application,
 * ideally in _app.tsx or a similar root component.
 */

// Custom event for reload detection
export const RELOAD_ATTEMPTED_EVENT = 'reloadAttempted';

// Function to disable the browser's native beforeunload dialog
export function disableNativeReloadDialog() {
  if (typeof window === 'undefined') return;
  
  // Create a capturing event listener that prevents browser dialogs
  // but dispatches our custom event
  const captureBeforeUnload = (e: BeforeUnloadEvent) => {
    // If this is a real user-initiated event (like clicking refresh)
    if (e.isTrusted) {
      // Prevent the browser dialog
      e.preventDefault();
      e.stopImmediatePropagation();
      
      // Dispatch our custom event that ReloadInterceptor will listen for
      window.dispatchEvent(new CustomEvent(RELOAD_ATTEMPTED_EVENT));
      
      // Cancel the actual reload
      e.returnValue = '';
      return '';
    }
  };
  
  // Add our listener to capture browser reload attempts with highest priority
  window.addEventListener('beforeunload', captureBeforeUnload, { capture: true, passive: false });
  
  // Return a cleanup function
  return () => {
    window.removeEventListener('beforeunload', captureBeforeUnload, { capture: true, passive: false });
  };
}

export default disableNativeReloadDialog;