'use client';

import React, { useState, useEffect, memo } from 'react';
import { ReloadSiteDialog } from '@/core/ui/dialogs';
import { useRouter } from 'next/navigation';

interface ExamReloadHandlerProps {
  children: React.ReactNode;
  hasUnsavedChanges: boolean;
  onSaveChanges?: () => Promise<boolean>;
}

/**
 * ExamReloadHandler
 * 
 * Intercepts reload/navigation attempts in exam pages and shows a custom dialog
 * instead of the browser's native dialog when possible.
 */
export const ExamReloadHandler = memo(function ExamReloadHandler({ 
  children, 
  hasUnsavedChanges,
  onSaveChanges 
}: ExamReloadHandlerProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingOperation, setPendingOperation] = useState<'reload' | 'navigation' | null>(null);
  const [navigationPath, setNavigationPath] = useState<string | null>(null);
  const router = useRouter();

  // Handle browser refresh event intercepts
  useEffect(() => {
    if (!hasUnsavedChanges || typeof window === 'undefined') return;

    // Handler for detecting refresh attempts
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Don't do anything here - we want our global handler to run
      // But since we have unsaved changes, we want to intercept the reload
      setShowDialog(true);
      setPendingOperation('reload');
      return;
    };
    
    // Register to browser reload event but with LOWER priority than global handler
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Intercept our app's custom reload functionality
  const interceptReload = () => {
    if (hasUnsavedChanges) {
      setShowDialog(true);
      setPendingOperation('reload');
      return false; // Prevent immediate reload
    }
    return true; // Allow reload
  };

  // Intercept navigation within our app
  const interceptNavigation = (path: string) => {
    if (hasUnsavedChanges) {
      setShowDialog(true);
      setPendingOperation('navigation');
      setNavigationPath(path);
      return false; // Prevent immediate navigation
    }
    
    // Navigate normally if no unsaved changes
    router.push(path);
    return true;
  };

  // Handle confirm reload/navigation
  const handleConfirm = async () => {
    // Try to save changes if handler is provided
    let saveSuccessful = true;
    if (onSaveChanges) {
      try {
        saveSuccessful = await onSaveChanges();
      } catch (error) {
        console.error('Error saving changes:', error);
        saveSuccessful = false;
      }
    }

    // Close dialog
    setShowDialog(false);

    // Proceed with operation if save was successful
    if (saveSuccessful) {
      if (pendingOperation === 'reload') {
        window.location.reload();
      } else if (pendingOperation === 'navigation' && navigationPath) {
        router.push(navigationPath);
      }
    }

    // Reset state
    setPendingOperation(null);
    setNavigationPath(null);
  };

  // Handle cancel
  const handleCancel = () => {
    setShowDialog(false);
    setPendingOperation(null);
    setNavigationPath(null);
  };

  return (
    <>
      {/* Clone children with interceptors */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onReloadAttempt: interceptReload,
            onNavigationAttempt: interceptNavigation,
          });
        }
        return child;
      })}
      
      {/* Custom reload dialog */}
      <ReloadSiteDialog
        isOpen={showDialog}
        onReload={handleConfirm}
        onCancel={handleCancel}
        message="Changes you made may not be saved. Would you like to save your changes before continuing?"
      />
    </>
  );
});

export default ExamReloadHandler;