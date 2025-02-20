import { LoginCredentials, RegistrationData, PasswordStrength } from '../model/types';

export const validateLoginForm = (data: LoginCredentials) => {
  const errors: Record<string, string> = {};
  
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
  }
  
  return errors;
};

export const validateRegistrationForm = (data: RegistrationData) => {
  const errors: Record<string, string> = {};
  
  // Username validation
  if (!data.username) {
    errors.username = 'Username is required';
  } else if (data.username.length < 4) {
    errors.username = 'Username must be at least 4 characters';
  }
  
  // Email validation
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  // Password validation
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors[0];
  }
  
  // Confirm password validation
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  // Name validation
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }
  
  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }
  
  // Phone number validation (optional)
  if (data.phoneNumber && !/^\+?[\d\s-]+$/.test(data.phoneNumber)) {
    errors.phoneNumber = 'Invalid phone number format';
  }
  
  // Terms acceptance
  if (!data.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and conditions';
  }
  
  return errors;
};

export const validatePasswordReset = (password: string, confirmPassword: string) => {
  const errors: Record<string, string> = {};
  
  // Password validation
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors[0];
  }
  
  // Confirm password validation
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return { isValid: errors.length === 0, errors };
};

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return {
      score: 0,
      label: 'very-weak',
      suggestions: ['Enter a password']
    };
  }
  
  let score = 0;
  const suggestions: string[] = [];
  
  // Length
  if (password.length >= 12) {
    score += 2;
  } else if (password.length >= 8) {
    score += 1;
  } else {
    suggestions.push('Make your password longer (at least 8 characters)');
  }
  
  // Complexity
  if (/[A-Z]/.test(password)) score += 1;
  else suggestions.push('Add uppercase letters');
  
  if (/[a-z]/.test(password)) score += 1;
  else suggestions.push('Add lowercase letters');
  
  if (/[0-9]/.test(password)) score += 1;
  else suggestions.push('Add numbers');
  
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else suggestions.push('Add special characters');
  
  // Variety
  const uniqueChars = new Set(password).size;
  if (uniqueChars > password.length * 0.7) score += 1;
  else if (uniqueChars < password.length * 0.5) {
    suggestions.push('Use more variety of characters');
  }
  
  // Determine label
  let label: PasswordStrength['label'] = 'very-weak';
  if (score >= 6) label = 'very-strong';
  else if (score >= 5) label = 'strong';
  else if (score >= 4) label = 'medium';
  else if (score >= 2) label = 'weak';
  
  return { score, label, suggestions };
};