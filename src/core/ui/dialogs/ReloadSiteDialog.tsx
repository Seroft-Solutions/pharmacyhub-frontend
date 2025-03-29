'use client';

import React, { memo } from 'react';
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

interface ReloadSiteDialogProps {
  /**
   * Controls whether the dialog is displayed
   */
  isOpen: boolean;
  /**
   * Callback function called when the user confirms reload
   */
  onReload: () => void;
  /**
   * Callback function called when the user cancels
   */
  onCancel: () => void;
  /**
   * Optional custom message to display
   * @default "Changes you made may not be saved."
   */
  message?: string;
}

/**
 * ReloadSiteDialog Component
 * 
 * A reusable dialog that confirms if the user wants to reload the site
 * when there are unsaved changes.
 */
export const ReloadSiteDialog = memo(function ReloadSiteDialog({
  isOpen,
  onReload,
  onCancel,
  message = "Changes you made may not be saved."
}: ReloadSiteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to exit the exam?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onCancel}
            className="h-10 px-4"
          >
            No
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onReload}
            className="bg-blue-600 hover:bg-blue-700 h-10 px-4"
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
