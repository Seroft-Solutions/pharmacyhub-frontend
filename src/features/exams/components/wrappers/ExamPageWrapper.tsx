'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ReloadSiteDialog } from '@/core/ui/dialogs';

interface ExamPageWrapperProps {
  /**
   * The children to wrap with the reload protection
   */
  children: React.ReactNode;
}

/**
 * ExamPageWrapper Component
 * 
 * Wraps exam pages with reload protection to prevent accidental
 * navigation or refresh when there are unsaved changes.
 */
export function ExamPageWrapper({ children }: ExamPageWrapperProps) {
  const [showReloadDialog, setShowReloadDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Effect to handle beforeunload event (browser refresh/close) - DISABLED
  useEffect(() => {
    // Intentionally empty - no beforeunload handler to prevent browser dialog
    return () => {};
  }, []);

  // Custom router handler to intercept navigation
  const handleNavigation = (url: string) => {
    // Only show dialog if there are unsaved changes
    const hasUnsavedChanges = true; // Replace with actual check for unsaved changes
    
    if (hasUnsavedChanges) {
      setShowReloadDialog(true);
      setPendingUrl(url);
      return false; // Prevent immediate navigation
    }
    
    return true; // Allow navigation if no unsaved changes
  };

  // Handle dialog actions
  const handleReload = () => {
    setShowReloadDialog(false);
    
    if (pendingUrl) {
      // Navigate to the pending URL
      router.push(pendingUrl);
    } else {
      // Reload the current page
      window.location.reload();
    }
  };

  const handleCancel = () => {
    setShowReloadDialog(false);
    setPendingUrl(null);
  };

  return (
    <>
      {children}
      
      <ReloadSiteDialog
        isOpen={showReloadDialog}
        onReload={handleReload}
        onCancel={handleCancel}
      />
    </>
  );
}

export default ExamPageWrapper;