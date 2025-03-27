'use client';

import { useState, useEffect } from 'react'; 
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
import { LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { LoginStatus } from '@/features/core/auth/anti-sharing/types';
import {
  ErrorCategory,
  SESSION_ERRORS
} from '@/features/core/auth/anti-sharing/constants/exceptions';

interface AntiShareErrorDialogProps {
  message: string;
  onClose: () => void;
  onContinue: () => void;
  isProcessing?: boolean;
}

export function AntiShareErrorDialog({ 
  message, 
  onClose, 
  onContinue, 
  isProcessing = false 
}: AntiShareErrorDialogProps) {
  const [open, setOpen] = useState(false);

  // Force open when the component mounts
  useEffect(() => {
    console.log('[Anti-Sharing] Dialog mounted, setting open to true');
    setOpen(true);
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="mb-4">
            <LogOut className="w-10 h-10 text-red-500" />
          </div>
          <AlertDialogTitle className="text-xl">
            Single Session Restriction
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center pt-2">
            {message}
          </AlertDialogDescription>
          
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-800">
              <strong>Security Notice:</strong> For your account security, PharmacyHub only allows one active session at a time.
            </p>
            <p className="text-sm text-amber-800 mt-1">
              Choosing "Log Out Other Devices" will immediately terminate all your other active sessions and allow you to continue with this session.
            </p>
            <p className="text-sm text-amber-800 mt-1">
              If you did not attempt to log in from another device, please consider changing your password for added security.
            </p>
            <div className="mt-2 p-2 bg-amber-100 rounded">
              <p className="text-xs text-amber-800 flex items-center">
                <Shield className="h-3 w-3 mr-1" /> This security feature protects your account from unauthorized access.
              </p>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onClose}
            className="w-full sm:w-auto"
            disabled={isProcessing}
          >
            Cancel
          </AlertDialogCancel>
          
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={onContinue}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> 
                <span>Processing...</span>
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out Other Devices
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
