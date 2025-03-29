'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { ExamReloadDialog } from '@/core/ui/dialogs';
import { useExamStore } from '../../store/examStore';
import { toast } from 'sonner';

interface ExamPageContainerProps {
  children: React.ReactNode;
  examId: number;
  userId: string;
}

/**
 * ExamPageContainer
 * 
 * Provides a container for exam pages with enhanced reload/navigation protection.
 * Handles saving exam data before navigation and provides a custom reload dialog.
 */
export const ExamPageContainer = memo(function ExamPageContainer({ 
  children, 
  examId, 
  userId 
}: ExamPageContainerProps) {
  const [showReloadDialog, setShowReloadDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingAction, setPendingAction] = useState<'reload' | 'navigate' | null>(null);
  const [navigationPath, setNavigationPath] = useState<string | null>(null);
  
  const router = useRouter();
  
  // Get exam state from store with proper selector functions to avoid unnecessary rerenders
  const hasUnsavedChanges = useExamStore(state => state.hasUnsavedChanges);
  const attemptId = useExamStore(state => state.attemptId);
  const saveExamProgress = useExamStore(state => state.saveExamProgress);
  
  // Set up beforeunload event handler - DISABLED to prevent browser dialog
  useEffect(() => {
    // Intentionally empty - no beforeunload handler to prevent browser dialog
    return () => {};
  }, []);
  
  // Save exam progress
  const saveProgress = useCallback(async (): Promise<boolean> => {
    if (!attemptId || !hasUnsavedChanges) return true;
    
    try {
      setIsSaving(true);
      await saveExamProgress();
      toast.success('Progress saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving exam progress:', error);
      toast.error('Failed to save progress');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [attemptId, hasUnsavedChanges, saveExamProgress]);
  
  // Handle reload attempt
  const handleReloadAttempt = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowReloadDialog(true);
      setPendingAction('reload');
      return false;
    }
    return true;
  }, [hasUnsavedChanges]);
  
  // Handle navigation attempt
  const handleNavigationAttempt = useCallback((path: string) => {
    if (hasUnsavedChanges) {
      setShowReloadDialog(true);
      setPendingAction('navigate');
      setNavigationPath(path);
      return false;
    }
    
    router.push(path);
    return true;
  }, [hasUnsavedChanges, router]);
  
  // Handle reload dialog confirmation
  const handleReload = useCallback(() => {
    setShowReloadDialog(false);
    
    if (pendingAction === 'reload') {
      window.location.reload();
    } else if (pendingAction === 'navigate' && navigationPath) {
      router.push(navigationPath);
    }
    
    setPendingAction(null);
    setNavigationPath(null);
  }, [pendingAction, navigationPath, router]);
  
  // Handle save and reload
  const handleSaveAndReload = useCallback(async (): Promise<boolean> => {
    const success = await saveProgress();
    
    if (success) {
      setShowReloadDialog(false);
      
      if (pendingAction === 'reload') {
        // Use setTimeout to ensure state updates before reload
        setTimeout(() => window.location.reload(), 100);
      } else if (pendingAction === 'navigate' && navigationPath) {
        router.push(navigationPath);
      }
      
      setPendingAction(null);
      setNavigationPath(null);
    }
    
    return success;
  }, [saveProgress, pendingAction, navigationPath, router]);
  
  // Handle cancel
  const handleCancel = useCallback(() => {
    setShowReloadDialog(false);
    setPendingAction(null);
    setNavigationPath(null);
  }, []);
  
  // Clone children to add handlers
  const enhancedChildren = useMemo(() => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          onReloadAttempt: handleReloadAttempt,
          onNavigateAttempt: handleNavigationAttempt,
          hasUnsavedChanges,
        });
      }
      return child;
    });
  }, [children, handleReloadAttempt, handleNavigationAttempt, hasUnsavedChanges]);
  
  return (
    <>
      {enhancedChildren}
      
      <ExamReloadDialog
        isOpen={showReloadDialog}
        onReload={handleReload}
        onCancel={handleCancel}
        onSaveAndReload={handleSaveAndReload}
        message={
          hasUnsavedChanges
            ? "You have unsaved changes. Would you like to save your progress before continuing?"
            : "Changes you made may not be saved."
        }
      />
    </>
  );
});

export default ExamPageContainer;