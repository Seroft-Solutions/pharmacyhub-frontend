'use client';

import React from 'react';
import { AlertTriangleIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ExamAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  actionLabel?: string;
}

export function ExamAlertDialog({
  isOpen,
  onClose,
  title = 'Notice',
  message,
  actionLabel = 'OK',
}: ExamAlertDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="flex flex-row items-start space-y-0 gap-3">
          <div className="flex-shrink-0 rounded-full bg-amber-50 p-2">
            <AlertTriangleIcon className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <AlertDialogTitle className="text-lg text-left">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm mt-1.5 text-left">
              {message}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-1">
          <AlertDialogAction
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
