/**
 * Password and authentication validation utilities
 */
import { PASSWORD_CONFIG } from '../config/auth';

interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

interface ValidationErrors {
  [key: string]: string;
}

/**
 * Password strength assessment
 */
export interface PasswordStrength {
  score: number; // 0-4 (very weak to very strong)
  label: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
  suggestions: string[];
}

/**
 * Validate password against security requirements
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  // Check minimum length
  if (password.length < PASSWORD_CONFIG.minLength) {
    errors.push(`Password must be at least ${PASSWORD_CONFIG.minLength} characters long`);
  }

  // Check for uppercase letters
  if (PASSWORD_CONFIG.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase letters
  if (PASSWORD_CONFIG.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for numbers
  if (PASSWORD_CONFIG.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for special characters
  if (PASSWORD_CONFIG.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calculate password strength
 */
export const calculatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const suggestions: string[] = [];

  // No score for empty passwords
  if (!password) {
    return {
      score: 0,
      label: 'very-weak',
      suggestions: ['Enter a password']
    };
  }

  // Length contribution (up to 2 points)
  if (password.length >= PASSWORD_CONFIG.minLength) {
    score += 1;
    if (password.length >= PASSWORD_CONFIG.minLength * 1.5) {
      score += 1;
    }
  } else {
    suggestions.push(`Make the password at least ${PASSWORD_CONFIG.minLength} characters long`);
  }

  // Character variety contribution (up to 2 points)
  let varietyScore = 0;
  
  if (/[A-Z]/.test(password)) varietyScore++;
  else suggestions.push('Add uppercase letters');
  
  if (/[a-z]/.test(password)) varietyScore++;
  else suggestions.push('Add lowercase letters');
  
  if (/\d/.test(password)) varietyScore++;
  else suggestions.push('Add numbers');
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) varietyScore++;
  else suggestions.push('Add special characters');

  score += Math.min(2, varietyScore / 2);

  // Determine label based on score
  let label: PasswordStrength['label'] = 'very-weak';
  if (score >= 3.5) label = 'very-strong';
  else if (score >= 3) label = 'strong';
  else if (score >= 2) label = 'medium';
  else if (score >= 1) label = 'weak';

  return {
    score,
    label,
    suggestions
  };
};

/**
 * Validate password reset form
 */
export const validatePasswordReset = (
  password: string, 
  confirmPassword: string
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Check password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors[0];
    return errors;
  }

  // Check password confirmation
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

/**
 * Validate login form
 */
export const validateLogin = (
  email: string,
  password: string
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Basic email validation
  if (!email) {
    errors.email = 'Email is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    errors.email = 'Invalid email address';
  }

  // Basic password validation
  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
};

/**
 * Validate registration form
 */
export const validateRegistration = (
  email: string,
  password: string,
  confirmPassword: string,
  firstName: string,
  lastName: string,
  acceptTerms: boolean
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Email validation
  if (!email) {
    errors.email = 'Email is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    errors.email = 'Invalid email address';
  }

  // First name validation
  if (!firstName) {
    errors.firstName = 'First name is required';
  }

  // Last name validation
  if (!lastName) {
    errors.lastName = 'Last name is required';
  }

  // Password validation
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors[0];
  }

  // Password confirmation validation
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // Terms acceptance validation
  if (!acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and conditions';
  }

  return errors;
};

export default {
  validatePassword,
  calculatePasswordStrength,
  validatePasswordReset,
  validateLogin,
  validateRegistration
};
