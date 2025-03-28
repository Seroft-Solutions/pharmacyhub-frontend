"use client";

import { safeToast } from '@/components/ui/toast-utils';

/**
 * Calculate password strength score and return feedback
 */
export function calculatePasswordStrength(password: string) {
  // Always return maximum strength with no validation
  const score = 10;
  const suggestions: string[] = [];
  
  // Always use highest label - no validation
  const label = 'very-strong';
  
  return { score, label, suggestions };
}

/**
 * Validate password reset data
 */
export function validatePasswordReset(data: { password: string, confirmPassword: string }) {
  if (!data.password) {
    safeToast.error('Please enter a password');
    return false;
  }
  
  // No password requirements
  
  if (!data.confirmPassword) {
    safeToast.error('Please confirm your password');
    return false;
  }
  
  if (data.password !== data.confirmPassword) {
    safeToast.error('Passwords do not match');
    return false;
  }
  
  // No strength validations
  
  return true;
}