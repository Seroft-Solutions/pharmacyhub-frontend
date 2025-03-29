'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ExamReloadDialog } from '@/core/ui/dialogs';
import { RELOAD_ATTEMPTED_EVENT } from './disableNativeReloadDialog';

interface ReloadInterceptorProps {
  children: React.ReactNode;
  hasUnsavedChanges?: boolean;
  onSaveChanges?: () => Promise<boolean>;
}

/**
 * ReloadInterceptor component
 * 
 * This component handles reload attempts and shows a custom dialog.
 * It works together with disableNativeReloadDialog to provide a complete solution.
 */
export function ReloadInterceptor({
  children,
  hasUnsavedChanges = true,
  onSaveChanges
}: ReloadInterceptorProps) {
  const [showDialog, setShowDialog] = useState(false);
  const isProcessingRef = useRef(false);
  
  // Listen for reload attempts from various sources
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    
    // Handler for keyboard shortcuts (F5, Ctrl+R)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'F5' || (e.ctrlKey && e.key === 'r')) && !isProcessingRef.current) {
        e.preventDefault();
        isProcessingRef.current = true;
        setShowDialog(true);
      }
    };
    
    // Handler for our custom reload event (from browser button)
    const handleReloadAttempt = () => {
      if (!isProcessingRef.current) {
        isProcessingRef.current = true;
        setShowDialog(true);
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener(RELOAD_ATTEMPTED_EVENT, handleReloadAttempt);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener(RELOAD_ATTEMPTED_EVENT, handleReloadAttempt);
    };
  }, [hasUnsavedChanges]);
  
  // Handler for confirming reload
  const handleReload = () => {
    setShowDialog(false);
    isProcessingRef.current = false;
    
    // Use a small delay to ensure state updates
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  
  // Handler for save and reload
  const handleSaveAndReload = async () => {
    if (onSaveChanges) {
      try {
        const success = await onSaveChanges();
        if (success) {
          handleReload();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error saving changes:", error);
        return false;
      }
    }
    
    // If no save function, just reload
    handleReload();
    return true;
  };
  
  // Handler for cancel
  const handleCancel = () => {
    setShowDialog(false);
    isProcessingRef.current = false;
  };
  
  return (
    <>
      {children}
      
      <ExamReloadDialog
        isOpen={showDialog}
        onReload={handleReload}
        onCancel={handleCancel}
        onSaveAndReload={onSaveChanges ? handleSaveAndReload : undefined}
        message="Changes you made may not be saved."
        showPreventDialogOption={false}
      />
    </>
  );
}

export default ReloadInterceptor;