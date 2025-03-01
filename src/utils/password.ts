import { PASSWORD_CONFIG as PASSWORD } from '@/features/auth/config/auth';

interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

interface PasswordStrength {
  score: number; // 0-4 (very weak to very strong)
  label: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
  suggestions: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  // Check minimum length
  if (password.length < PASSWORD.MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD.MIN_LENGTH} characters long`);
  }

  // Check for uppercase letters
  if (PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase letters
  if (PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for numbers
  if (PASSWORD.REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for special characters
  if (PASSWORD.REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const suggestions: string[] = [];

  // Length contribution (up to 2 points)
  if (password.length >= PASSWORD.MIN_LENGTH) {
    score += 1;
    if (password.length >= PASSWORD.MIN_LENGTH * 1.5) {
      score += 1;
    }
  } else {
    suggestions.push('Make the password longer');
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

export const isCommonPassword = (password: string): boolean => {
  // List of the most common passwords to check against
  const commonPasswords = [
    'password',
    '123456',
    '12345678',
    'qwerty',
    'abc123',
    'admin',
    'welcome',
    'password1',
    // Add more common passwords as needed
  ];

  return commonPasswords.includes(password.toLowerCase());
};

export const generateStrongPassword = (): string => {
  const length = PASSWORD.MIN_LENGTH + 4; // Min length plus some extra
  const charset = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*(),.?":{}|<>'
  };

  let password = '';

  // Ensure at least one character from each required set
  if (PASSWORD.REQUIRE_UPPERCASE) {
    password += charset.uppercase[Math.floor(Math.random() * charset.uppercase.length)];
  }
  if (PASSWORD.REQUIRE_LOWERCASE) {
    password += charset.lowercase[Math.floor(Math.random() * charset.lowercase.length)];
  }
  if (PASSWORD.REQUIRE_NUMBER) {
    password += charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
  }
  if (PASSWORD.REQUIRE_SPECIAL) {
    password += charset.special[Math.floor(Math.random() * charset.special.length)];
  }

  // Fill the rest with random characters
  const allChars = [
    ...charset.uppercase,
    ...charset.lowercase,
    ...charset.numbers,
    ...charset.special
  ].join('');

  while (password.length < length) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

/*
Usage Example:

const password = 'MyPassword123!';

// Validate password
const validation = validatePassword(password);
if (!validation.isValid) {
  console.log('Password errors:', validation.errors);
}

// Check password strength
const strength = calculatePasswordStrength(password);
console.log('Password strength:', strength.label);
console.log('Suggestions:', strength.suggestions);

// Check if it's a common password
if (isCommonPassword(password)) {
  console.log('Please choose a less common password');
}

// Generate a strong password
const newPassword = generateStrongPassword();
console.log('Generated password:', newPassword);
*/