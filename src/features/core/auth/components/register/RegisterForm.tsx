"use client";

import React, { useState, useEffect, useRef } from 'react';
import { RegistrationSuccess } from './RegistrationSuccess';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, RegistrationData, USER_TYPE_PERMISSIONS } from '@/shared/auth';
import { calculatePasswordStrength } from '../../lib/validation';

// Import shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import icons
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  AlertCircle, 
  Loader2,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff
} from 'lucide-react';

type FormStep = 'account' | 'personal' | 'confirmation' | 'success';

const initialFormData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  acceptTerms: false
};

// Helper function to validate form data
const validateRegistrationForm = (data: typeof initialFormData) => {
  const errors: Partial<Record<keyof typeof initialFormData, string>> = {};
  
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
  // No other password requirements
  
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
  if (data.phoneNumber) {
    // Remove spaces, dashes, and parentheses for validation
    const cleanNumber = data.phoneNumber.replace(/[\s()-]/g, '');
    
    // Pakistani number format validation: either +923XXXXXXXXX or 03XXXXXXXXX
    const pakWithCodeRegex = /^\+92\d{10}$/; // +923119712470 format
    const pakWithoutCodeRegex = /^03\d{9}$/;  // 03119712470 format
    
    if (!pakWithCodeRegex.test(cleanNumber) && !pakWithoutCodeRegex.test(cleanNumber)) {
      errors.phoneNumber = 'Invalid phone number. Use format 03XXXXXXXXX or +923XXXXXXXXX';
    }
  }
  
  // Terms validation
  if (!data.acceptTerms) {
    errors.acceptTerms = 'You must accept the Terms and Privacy Policy';
  }
  
  return errors;
};

export const RegisterForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof initialFormData, string>>>({});
  const [currentStep, setCurrentStep] = useState<FormStep>('account');
  const [passwordStrength, setPasswordStrength] = useState(calculatePasswordStrength(''));
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Debounce timer for phone validation
  const phoneValidationTimer = useRef<NodeJS.Timeout | null>(null);
  
  const { register, login, connectivityStatus = { hasIssues: false } } = useAuth();
  const router = useRouter();

  const validateStep = (step: FormStep): boolean => {
    let fieldsToValidate: Array<keyof typeof initialFormData> = [];
    
    switch(step) {
      case 'account':
        fieldsToValidate = ['username', 'email', 'password', 'confirmPassword'];
        break;
      case 'personal':
        fieldsToValidate = ['firstName', 'lastName', 'phoneNumber', 'userType'];
        break;
      case 'confirmation':
        fieldsToValidate = ['acceptTerms'];
        break;
    }
    
    // Run validation on all fields
    const validationErrors = validateRegistrationForm(formData);
    
    // Filter validation errors to only include fields relevant to this step
    const stepErrors: Partial<Record<keyof typeof initialFormData, string>> = {};
    fieldsToValidate.forEach(field => {
      if (validationErrors[field]) {
        stepErrors[field] = validationErrors[field];
      }
    });
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Update password strength when password changes
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Instant validation for phone number
    if (name === 'phoneNumber') {
      // Clear previous validation timer
      if (phoneValidationTimer.current) {
        clearTimeout(phoneValidationTimer.current);
      }
      
      // Don't validate empty field
      if (!value) {
        setErrors(prev => ({ ...prev, phoneNumber: '' }));
        return;
      }
      
      // Set a timer for validation to avoid interrupting typing
      phoneValidationTimer.current = setTimeout(() => {
        const cleanNumber = value.replace(/[\s()-]/g, '');
        const pakWithCodeRegex = /^\+92\d{10}$/;  // +923119712470 format
        const pakWithoutCodeRegex = /^03\d{9}$/;   // 03119712470 format
        
        if (!pakWithCodeRegex.test(cleanNumber) && !pakWithoutCodeRegex.test(cleanNumber)) {
          setErrors(prev => ({ 
            ...prev, 
            phoneNumber: 'Invalid phone number. Use format 03XXXXXXXXX or +923XXXXXXXXX'
          }));
        } else {
          setErrors(prev => ({ ...prev, phoneNumber: '' }));
        }
      }, 300); // 300ms delay to let user type
    }

    // Clear error when field is modified (except for phone since we handle it above)
    if (errors[name as keyof typeof initialFormData] && name !== 'phoneNumber') {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Clear any expired tokens when starting registration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear any tokens that might be causing authentication issues
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_expiry');
    }
  }, []);

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

  // Modify the handleSubmit function to transition to the success step
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
        emailAddress: formData.email, // Changed from email to emailAddress
        password: formData.password,
        userType: 'PHARMACIST', // Always use PHARMACIST as the mapped value for General User
        contactNumber: formData.phoneNumber || undefined,
        openToConnect: false
      };
      
      console.log('Registering with data:', JSON.stringify(registrationData, null, 2));
      
      await register(registrationData);
      
      // Show success animation
      setShowSuccessAnimation(true);
      
      // Move to success step instead of automatic login
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

  const renderStepIndicator = () => {
    // Don't show step indicator on success screen
    if (currentStep === 'success') return null;
    
    return (
      <div className="flex justify-between items-center w-full mb-8 relative">
        <div className="absolute h-1 bg-gray-200 left-0 top-1/2 transform -translate-y-1/2 w-full z-0" />
        
        {['account', 'personal', 'confirmation'].map((step, index) => {
          const isActive = currentStep === step;
          const isCompleted = 
            (step === 'account' && ['personal', 'confirmation', 'success'].includes(currentStep)) ||
            (step === 'personal' && ['confirmation', 'success'].includes(currentStep)) ||
            (step === 'confirmation' && currentStep === 'success');
          
          return (
            <div key={step} className="z-10 flex flex-col items-center">
              <div 
                className={`flex items-center justify-center size-10 rounded-full border-2 transition-all ${
                  isActive 
                    ? 'border-blue-600 bg-blue-100 text-blue-700'
                    : isCompleted
                      ? 'border-green-500 bg-green-500 text-white' 
                      : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span className={`text-xs mt-2 font-medium ${
                isActive ? 'text-blue-700' :
                isCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAccountStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username" className={errors.username ? "text-red-500" : "text-gray-700"}>
          Username
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
            className={`pl-10 border-gray-300 bg-white ${errors.username ? "border-red-500 ring-red-500" : ""}`}
            required
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className={errors.email ? "text-red-500" : "text-gray-700"}>
          Email address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            className={`pl-10 border-gray-300 bg-white ${errors.email ? "border-red-500 ring-red-500" : ""}`}
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className={errors.password ? "text-red-500" : "text-gray-700"}>
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className={`pl-10 border-gray-300 bg-white ${errors.password ? "border-red-500 ring-red-500" : ""}`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className={errors.confirmPassword ? "text-red-500" : "text-gray-700"}>
          Confirm password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`pl-10 border-gray-300 bg-white ${errors.confirmPassword ? "border-red-500 ring-red-500" : ""}`}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          onClick={nextStep}
          className="w-full sm:w-auto"
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderPersonalStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className={errors.firstName ? "text-red-500" : "text-gray-700"}>
              First name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
              className={`border-gray-300 bg-white ${errors.firstName ? "border-red-500 ring-red-500" : ""}`}
              required
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className={errors.lastName ? "text-red-500" : "text-gray-700"}>
              Last name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              className={`border-gray-300 bg-white ${errors.lastName ? "border-red-500 ring-red-500" : ""}`}
              required
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className={errors.phoneNumber ? "text-red-500" : "text-gray-700"}>
          Phone number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="03XXXXXXXXX or +923XXXXXXXXX"
            autoComplete="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`pl-10 border-gray-300 bg-white ${errors.phoneNumber ? "border-red-500 ring-red-500" : ""}`}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">We'll use this number for verification. Must be in format 03XXXXXXXXX or +923XXXXXXXXX.</p>
      </div>
      
      <div className="space-y-2">
      <Label htmlFor="userType" className="text-gray-700">
      Account type
      </Label>
      <Select
      value="GENERAL_USER"
      disabled={true}
      >
      <SelectTrigger className="w-full border-gray-300 bg-white">
      <SelectValue placeholder="General User" />
      </SelectTrigger>
      <SelectContent>
      <SelectItem value="GENERAL_USER">General User</SelectItem>
      </SelectContent>
      </Select>
      <p className="text-xs text-gray-500 mt-1">Your account type determines which features you can access</p>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={nextStep}
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Account Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Username:</span>
            <span className="col-span-2 font-medium text-gray-800">{formData.username}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Email:</span>
            <span className="col-span-2 font-medium text-gray-800">{formData.email}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Name:</span>
            <span className="col-span-2 font-medium text-gray-800">{formData.firstName} {formData.lastName}</span>
          </div>
          {formData.phoneNumber && (
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-500">Phone:</span>
              <span className="col-span-2 font-medium text-gray-800">{formData.phoneNumber}</span>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Account Type:</span>
            <span className="col-span-2 font-medium text-gray-800">General User</span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) => {
              setFormData(prev => ({ ...prev, acceptTerms: !!checked }));
              if (errors.acceptTerms) {
                setErrors(prev => ({ ...prev, acceptTerms: '' }));
              }
            }}
            className={errors.acceptTerms ? "border-red-500" : ""}
          />
          <Label
            htmlFor="acceptTerms"
            className={`text-sm font-normal ${errors.acceptTerms ? "text-red-500" : "text-gray-600"}`}
          >
            I accept the{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
              Privacy Policy
            </Link>
          </Label>
        </div>
        {errors.acceptTerms && (
          <p className="mt-1 text-xs text-red-500 pl-6">{errors.acceptTerms}</p>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={showSuccessAnimation}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {showSuccessAnimation ? (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-2">Success!</span>
            </div>
          ) : (
            'Create account'
          )}
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'account':
        return renderAccountStep();
      case 'personal':
        return renderPersonalStep();
      case 'confirmation':
        return renderConfirmationStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderAccountStep();
    }
  };

  const renderSuccessStep = () => {
    const userEmail = formData.email;
    return <RegistrationSuccess email={userEmail} />;
  };

  return (
    <Card className="border-none shadow-2xl backdrop-blur-sm bg-white/90">
      {connectivityStatus?.hasIssues && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                Connection issues detected. Registration may not work correctly. 
                {connectivityStatus.message && (
                  <span className="block mt-1 text-xs">{connectivityStatus.message}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <CardHeader className="space-y-1 pb-6">
        <div className="flex justify-center mb-2">
          <div className="size-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center p-4 shadow-lg">
            <UserPlus className="text-white h-8 w-8" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-gray-800">
          Create your account
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Join PharmacyHub to manage your pharmacy efficiently
        </CardDescription>
      </CardHeader>

      <CardContent>
        {renderStepIndicator()}
        <form onSubmit={(e) => {
          e.preventDefault();
          if (currentStep === 'confirmation') {
            handleSubmit(e);
          }
        }}>
          {renderCurrentStep()}
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center p-6 border-t bg-gray-50 rounded-b-lg">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
