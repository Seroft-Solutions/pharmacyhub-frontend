"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from '@/shared/auth';
import { calculatePasswordStrength } from '@/features/core/app-auth/lib/validation';

// Form step types
export type FormStep = 'account' | 'personal' | 'confirmation' | 'success';

// Form data interface
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  acceptTerms: boolean;
}

// Initial form data
export const initialFormData: RegisterFormData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  acceptTerms: false
};

// Password strength type
export interface PasswordStrength {
  score: number;
  label: string;
  suggestions: string[];
}

// Context interface
interface RegisterFormContextType {
  formData: RegisterFormData;
  errors: Partial<Record<keyof RegisterFormData, string>>;
  currentStep: FormStep;
  passwordStrength: PasswordStrength;
  showPassword: boolean;
  showConfirmPassword: boolean;
  showSuccessAnimation: boolean;
  isRegistering: boolean;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof RegisterFormData, string>>>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<FormStep>>;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  toggleShowPassword: () => void;
  toggleShowConfirmPassword: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  validateStep: (step: FormStep) => boolean;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

// Create context
const RegisterFormContext = createContext<RegisterFormContextType | undefined>(undefined);

// Context provider
export const RegisterFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [currentStep, setCurrentStep] = useState<FormStep>('account');
  const [passwordStrength, setPasswordStrength] = useState(calculatePasswordStrength(''));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const { register, isLoading: isRegistering } = useAuth();

  // Helper function to validate form data
  const validateRegistrationForm = (data: RegisterFormData) => {
    const errors: Partial<Record<keyof RegisterFormData, string>> = {};
    
    // Email validation
    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
      errors.email = 'Invalid email address';
    }
    
    // Username validation
    if (!data.username) {
      errors.username = 'Username is required';
    } else if (data.username.length < 4) {
      errors.username = 'Username must be at least 4 characters';
    }
    
    // Password validation
    if (!data.password) {
      errors.password = 'Password is required';
    }
    
    // Confirm password validation
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Name validation
    if (!data.firstName) {
      errors.firstName = 'First name is required';
    }
    
    if (!data.lastName) {
      errors.lastName = 'Last name is required';
    }
    
    // Phone validation
    if (data.phoneNumber && !/^\+?\d{10,15}$/.test(data.phoneNumber.replace(/[\s()-]/g, ''))) {
      errors.phoneNumber = 'Invalid phone number';
    }
    
    // Terms validation
    if (!data.acceptTerms) {
      errors.acceptTerms = 'You must accept the Terms and Privacy Policy';
    }
    
    return errors;
  };

  const validateStep = (step: FormStep): boolean => {
    let fieldsToValidate: Array<keyof RegisterFormData> = [];
    
    switch(step) {
      case 'account':
        fieldsToValidate = ['username', 'email', 'password', 'confirmPassword'];
        break;
      case 'personal':
        fieldsToValidate = ['firstName', 'lastName', 'phoneNumber'];
        break;
      case 'confirmation':
        fieldsToValidate = ['acceptTerms'];
        break;
    }
    
    // Run validation on all fields
    const validationErrors = validateRegistrationForm(formData);
    
    // Filter validation errors to only include fields relevant to this step
    const stepErrors: Partial<Record<keyof RegisterFormData, string>> = {};
    fieldsToValidate.forEach(field => {
      if (validationErrors[field]) {
        stepErrors[field] = validationErrors[field];
      }
    });
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Handle special case for checkbox
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Update password strength when password changes
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when field is modified
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const nextStep = () => {
    if (currentStep === 'account' && validateStep('account')) {
      setCurrentStep('personal');
    } else if (currentStep === 'personal' && validateStep('personal')) {
      setCurrentStep('confirmation');
    }
  };

  const prevStep = () => {
    if (currentStep === 'personal') {
      setCurrentStep('account');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('personal');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep('confirmation')) {
      return;
    }

    try {
      // Prepare data for API
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.email,
        password: formData.password,
        userType: 'PHARMACIST', // Always use PHARMACIST as the mapped value for General User
        contactNumber: formData.phoneNumber || undefined,
        openToConnect: false
      };
      
      console.log('Registering with data:', JSON.stringify(registrationData, null, 2));
      
      await register(registrationData);
      
      // Show success animation
      setShowSuccessAnimation(true);
      
      // Move to success step
      setCurrentStep('success');
      
    } catch (err) {
      console.error("Registration failed", err);
      
      // Determine user-friendly error message based on error
      let errorMessage = 'Registration failed';
      
      if (err instanceof Error) {
        const errorText = err.message.toLowerCase();
        
        if (errorText.includes('failed to fetch') || 
            errorText.includes('typeerror') || 
            errorText.includes('network') ||
            errorText.includes('cors')) {
          errorMessage = 'Could not connect to authentication server. Please check your network connection or try again later.';
        } else if (errorText.includes('already exists')) {
          errorMessage = 'An account with this username or email already exists.';
        } else if (errorText.includes('admin token') || errorText.includes('authentication')) {
          errorMessage = 'Authentication service error. Our team has been notified. Please try again later.';
        } else if (errorText.includes('timeout')) {
          errorMessage = 'Registration timed out. Please check your internet connection and try again.';
        } else {
          // Use the original error message
          errorMessage = err.message;
        }
      }
      
      setErrors({
        email: errorMessage
      });
      setCurrentStep('account'); // Return to first step on error
    }
  };

  // Create context value
  const value: RegisterFormContextType = {
    formData,
    errors,
    currentStep,
    passwordStrength,
    showPassword,
    showConfirmPassword,
    showSuccessAnimation,
    isRegistering,
    setFormData,
    setErrors,
    setCurrentStep,
    setShowPassword,
    setShowConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    handleChange,
    handleSelectChange,
    validateStep,
    nextStep,
    prevStep,
    handleSubmit
  };

  return (
    <RegisterFormContext.Provider value={value}>
      {children}
    </RegisterFormContext.Provider>
  );
};

// Hook for using the register form context
export const useRegisterForm = () => {
  const context = useContext(RegisterFormContext);
  if (context === undefined) {
    throw new Error('useRegisterForm must be used within a RegisterFormProvider');
  }
  return context;
};
