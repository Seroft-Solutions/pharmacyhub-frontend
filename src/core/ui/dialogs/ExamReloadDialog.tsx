'use client';

import React, { useState, memo } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface ExamReloadDialogProps {
  /**
   * Controls whether the dialog is displayed
   */
  isOpen: boolean;
  /**
   * Callback function called when the user confirms reload without saving
   */
  onReload: () => void;
  /**
   * Callback function called when the user cancels
   */
  onCancel: () => void;
  /**
   * Callback function called when the user wants to save before reloading
   */
  onSaveAndReload?: () => Promise<boolean>;
  /**
   * Optional custom message to display
   */
  message?: string;
  /**
   * Whether to show a checkbox for preventing additional dialogs
   */
  showPreventDialogOption?: boolean;
}

/**
 * ExamReloadDialog Component
 * 
 * An enhanced version of ReloadSiteDialog with save functionality and
 * a "prevent additional dialogs" checkbox mimicking the browser's native dialog.
 */
export const ExamReloadDialog = memo(function ExamReloadDialog({
  isOpen,
  onReload,
  onCancel,
  onSaveAndReload,
  message = "Changes you made may not be saved.",
  showPreventDialogOption = true,
}: ExamReloadDialogProps) {
  const [preventDialogs, setPreventDialogs] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAndReload = async () => {
    if (!onSaveAndReload) return;
    
    try {
      setIsSaving(true);
      const success = await onSaveAndReload();
      if (success) {
        onReload();
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreventDialogChange = (checked: boolean) => {
    setPreventDialogs(checked);
    // In a real implementation, you would store this preference
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('preventExamReloadDialogs', checked ? 'true' : 'false');
      }
    } catch (e) {
      console.error('Error saving dialog preference:', e);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to exit the exam?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        
        {showPreventDialogOption && (
          <div className="flex items-center space-x-2 my-2">
            <Checkbox 
              id="prevent-dialogs" 
              checked={preventDialogs} 
              onCheckedChange={handlePreventDialogChange} 
            />
            <label 
              htmlFor="prevent-dialogs" 
              className="text-sm text-gray-600 cursor-pointer"
            >
              Prevent this page from creating additional dialogs
            </label>
          </div>
        )}
        
        <AlertDialogFooter className="flex space-x-2">
          <AlertDialogCancel 
            className="mt-0"
            onClick={onCancel}
          >
            No
          </AlertDialogCancel>
          
          {onSaveAndReload && (
            <Button 
              disabled={isSaving}
              onClick={handleSaveAndReload}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save & Reload'
              )}
            </Button>
          )}
          
          <AlertDialogAction 
            onClick={onReload}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

export default ExamReloadDialog;