'use client';

import React from 'react';
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
import { LoginStatus } from '../types';
import { LOGIN_VALIDATION_MESSAGES } from '../constants';

interface LoginValidationErrorProps {
  isOpen: boolean;
  status: LoginStatus;
  message?: string;
  onContinue: () => void;
  onCancel: () => void;
}

export const LoginValidationError: React.FC<LoginValidationErrorProps> = ({
  isOpen,
  status,
  message,
  onContinue,
  onCancel,
}) => {
  const getTitle = () => {
    switch (status) {
      case LoginStatus.NEW_DEVICE:
        return 'New Device Detected';
      case LoginStatus.SUSPICIOUS_LOCATION:
        return 'Suspicious Login Detected';
      case LoginStatus.TOO_MANY_DEVICES:
        return 'Too Many Active Devices';
      case LoginStatus.OTP_REQUIRED:
        return 'Verification Required';
      default:
        return 'Login Error';
    }
  };

  const getDescription = () => {
    return message || LOGIN_VALIDATION_MESSAGES[status] || 'There was a problem with your login.';
  };

  const getContinueText = () => {
    switch (status) {
      case LoginStatus.NEW_DEVICE:
      case LoginStatus.SUSPICIOUS_LOCATION:
      case LoginStatus.OTP_REQUIRED:
        return 'Verify Identity';
      case LoginStatus.TOO_MANY_DEVICES:
        return 'Manage Devices';
      default:
        return 'Continue';
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{getTitle()}</AlertDialogTitle>
          <AlertDialogDescription>{getDescription()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onContinue}>{getContinueText()}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
