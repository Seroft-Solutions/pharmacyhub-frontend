"use client";

import { safeToast } from '@/components/ui/toast-utils';

/**
 * Calculate password strength score and return feedback
 */
export function calculatePasswordStrength(password: string) {
  // Start with 0 score
  let score = 0;
  let suggestions: string[] = [];
  
  // Empty password
  if (!password) {
    return {
      score: 0,
      label: 'very-weak',
      suggestions: ['Please enter a password']
    };
  }
  
  // Add length points
  if (password.length === 8) score += 4; // Full points for exactly 8 characters
  else score = 0; // No points for incorrect length
  
  // Incorrect length
  if (password.length !== 8) {
    suggestions.push('Password must be exactly 8 characters');
  }
  
  // Add character variety points
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  // Add suggestions based on missing elements
  if (!/[a-z]/.test(password)) suggestions.push('Add lowercase letters');
  if (!/[A-Z]/.test(password)) suggestions.push('Add uppercase letters');
  if (!/[0-9]/.test(password)) suggestions.push('Add numbers');
  if (!/[^a-zA-Z0-9]/.test(password)) suggestions.push('Add special characters');
  
  // Common patterns check (reduce score)
  if (/^(password|12345678|qwerty)/i.test(password)) {
    score = Math.max(1, score - 2);
    suggestions.push('Avoid common password patterns');
  }
  
  // Sequential characters check (reduce score)
  if (/(?:abc|bcd|cde|def|efg|123|234|345|456|567|678|789)/i.test(password)) {
    score = Math.max(1, score - 1);
    suggestions.push('Avoid sequential characters');
  }
  
  // Convert score to label
  let label: string;
  if (score <= 2) label = 'very-weak';
  else if (score <= 4) label = 'weak';
  else if (score <= 6) label = 'medium';
  else if (score <= 8) label = 'strong';
  else label = 'very-strong';
  
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
  
  if (data.password.length !== 8) {
    safeToast.error('Password must be exactly 8 characters');
    return false;
  }
  
  if (!data.confirmPassword) {
    safeToast.error('Please confirm your password');
    return false;
  }
  
  if (data.password !== data.confirmPassword) {
    safeToast.error('Passwords do not match');
    return false;
  }
  
  const strength = calculatePasswordStrength(data.password);
  if (strength.score < 3) {
    safeToast.warning('Your password is too weak. Consider adding more variety.');
    // Still returning true as this is a warning, not an error
  }
  
  return true;
}
