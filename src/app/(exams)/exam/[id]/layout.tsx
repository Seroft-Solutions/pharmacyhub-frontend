'use client';

import Script from 'next/script';
import React, { useEffect } from 'react';

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Inline script to capture reload attempts before React loads */}
      <Script id="reload-interceptor" strategy="beforeInteractive">
        {`
          // Store original reload function
          window._originalReload = window.location.reload;
          
          // Override reload to show our dialog
          window.location.reload = function() {
            // Dispatch a custom event that our React components can listen for
            const event = new CustomEvent('customReloadAttempt');
            window.dispatchEvent(event);
            
            // Return undefined to prevent actual reload
            return undefined;
          };
          
          // Capture F5 and Ctrl+R
          window.addEventListener('keydown', function(e) {
            if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
              e.preventDefault();
              
              // Dispatch a custom event that our React components can listen for
              const event = new CustomEvent('customReloadAttempt');
              window.dispatchEvent(event);
            }
          });
          
          // Prevent native browser dialog
          window.addEventListener('beforeunload', function(e) {
            // Only capture browser-initiated reload events, not navigation or close
            const isReloadEvent = (
              // This helps identify browser reload button clicks
              document.activeElement === document.body ||
              // These are refresh button-specific detection techniques
              (e.currentTarget === window && !e.target) ||
              document.activeElement?.tagName === 'BODY'
            );
            
            if (isReloadEvent) {
              e.preventDefault();
              e.stopImmediatePropagation();
              
              // Dispatch custom event
              const event = new CustomEvent('customReloadAttempt');
              window.dispatchEvent(event);
              
              // Don't set returnValue to prevent browser dialog
            }
          }, true);
          
          // Store flag to let us know this script ran
          window.__reloadScriptInitialized = true;
        `}
      </Script>
      {children}
    </>
  );
}
