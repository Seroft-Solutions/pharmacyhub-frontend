"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/features/core/auth/api/services/authService';
import { AUTH_ENDPOINTS } from '@/features/core/auth/api/constants';
import { ResetStatus } from '../../model/types';
import { calculatePasswordStrength, validatePasswordReset } from '../../lib/validation';

// Import shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// Import icons
import { 
  AlertCircle, 
  Loader2,
  CheckCircle,
  Lock,
  ShieldCheck,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface ResetPasswordFormProps {
  token: string;
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<ResetStatus>('validating');
  const [passwordStrength, setPasswordStrength] = useState(calculatePasswordStrength(''));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const router = useRouter();

  // Use actual API hooks from authService
  const { mutateAsync: validateToken, isPending: isValidating } = authService.useValidateResetToken();
  const { mutateAsync: resetPassword, isPending: isResetting } = authService.useCompletePasswordReset();
  
  // Debug mode for development
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setStatus('invalid');
        setError('No reset token provided');
        return;
      }

      try {
        // Call the actual token validation API
        await validateToken(token);
        setStatus('valid');
      } catch (err) {
        setStatus('invalid');
        
        // Log full error for debugging
        const fullError = err instanceof Error ? err.message : String(err);
        console.error("Token validation error:", fullError);
        
        // User-friendly error messages based on error type
        if (err instanceof Error) {
          const errorMessage = err.message.toLowerCase();
          if (errorMessage.includes('expired')) {
            setError('This password reset link has expired');
          } else if (errorMessage.includes('no endpoint') || errorMessage.includes('404')) {
            setError('Service temporarily unavailable. Please try again later.');
          } else {
            setError('This password reset link is invalid or has expired');
          }
        } else {
          setError('This password reset link is invalid or has expired');
        }
        
        // Show debug info automatically in development
        if (process.env.NODE_ENV === 'development') {
          setDebugMode(true);
        }
      }
    };
    
    checkToken();
  }, [token, validateToken]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (passwordStrength.score < 2) {
      setError('Password is too weak. Please choose a stronger password.');
      return;
    }

    try {
      setStatus('resetting');
      // Call the actual password reset API
      await resetPassword({
        token,
        newPassword: password,
        confirmPassword
      });
      setStatus('success');
      console.log("Password reset successful");
    } catch (err) {
      setStatus('valid');
      
      // Log full error for debugging
      const fullError = err instanceof Error ? err.message : String(err);
      console.error("Password reset error:", fullError);
      
      // User-friendly error messages based on error type
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase();
        if (errorMessage.includes('no endpoint') || errorMessage.includes('404')) {
          setError('Service temporarily unavailable. Please try again later.');
        } else if (errorMessage.includes('expired')) {
          setError('The reset token has expired. Please request a new link.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to reset password. Please try again.');
      }
      
      // Show debug info automatically in development
      if (process.env.NODE_ENV === 'development') {
        setDebugMode(true);
      }
    }
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength.label) {
      case 'very-weak': return 'bg-red-500';
      case 'weak': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      case 'very-strong': return 'bg-green-600';
      default: return 'bg-gray-200';
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'validating':
        return (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 text-blue-600 mx-auto animate-spin" />
            <p className="mt-4 text-gray-600">Validating your reset link...</p>
          </div>
        );
        
      case 'invalid':
        return (
          <div className="text-center py-8 space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-900">Invalid Reset Link</h3>
              <p className="text-sm text-gray-600">
                This password reset link is invalid or has expired. Please request a new password reset link.
              </p>
            </div>
            <Button
              onClick={() => router.push('/forgot-password')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Request New Link
            </Button>
          </div>
        );
        
      case 'valid':
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-1.5 text-blue-600" />
                  New password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="pl-10 pr-10 border-gray-300 bg-white"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password strength indicator */}
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getPasswordStrengthColor()} ${
                          passwordStrength.label === 'very-weak' ? 'w-1/5' :
                          passwordStrength.label === 'weak' ? 'w-2/5' :
                          passwordStrength.label === 'medium' ? 'w-3/5' :
                          passwordStrength.label === 'strong' ? 'w-4/5' : 'w-full'
                        }`}
                      />
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-500 min-w-20">
                      {passwordStrength.label.replace(/-/g, ' ')}
                    </span>
                  </div>
                  {passwordStrength.suggestions.length > 0 && (
                    <p className="mt-1 text-xs text-gray-500">
                      {passwordStrength.suggestions[0]}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-700">
                  Confirm new password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-300 bg-white"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isResetting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                'Reset password'
              )}
            </Button>
          </form>
        );
        
      case 'resetting':
        return (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 text-blue-600 mx-auto animate-spin" />
            <p className="mt-4 text-gray-600">Updating your password...</p>
          </div>
        );
        
      case 'success':
        return (
          <div className="text-center py-8 space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3 animate-fade-in-scale">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-900">Password Updated Successfully</h3>
              <p className="text-sm text-gray-600">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
            </div>
            <Button
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Log in
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="border-none shadow-2xl backdrop-blur-sm bg-white/90">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex justify-center mb-4">
          <div className={`size-16 rounded-full ${status === 'success' ? 'bg-green-100' : 'bg-gradient-to-br from-blue-600 to-indigo-600'} flex items-center justify-center p-4 shadow-lg`}>
            {status === 'success' ? 
              <CheckCircle className="text-green-600 h-8 w-8" /> : 
              <ShieldCheck className="text-white h-8 w-8" />
            }
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-gray-800">
          {status === 'success' ? 'Password Updated' : 'Reset Your Password'}
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          {status === 'validating' && "Verifying your reset link..."}
          {status === 'valid' && "Create a new secure password for your account"}
          {status === 'invalid' && "This link has expired or is invalid"}
          {status === 'resetting' && "Processing your request..."}
          {status === 'success' && "Your password has been updated successfully"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-6 p-3 rounded flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {renderContent()}
        
        {/* Debug information in development mode */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 pt-2 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setDebugMode(!debugMode)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              {debugMode ? 'Hide Debug Info' : 'Show Debug Info'}
            </button>
            
            {debugMode && (
              <div className="mt-2 p-2 bg-gray-50 text-left rounded text-xs font-mono overflow-auto max-h-60">
                <p>Token: {token ? token.substring(0, 8) + '...' : 'None'}</p>
                <p>Validation Endpoint: {AUTH_ENDPOINTS.VALIDATE_RESET_TOKEN}</p>
                <p>Reset Endpoint: {AUTH_ENDPOINTS.RESET_PASSWORD}</p>
                <p>Current Status: {status}</p>
                <p>isValidating: {isValidating ? 'true' : 'false'}</p>
                <p>isResetting: {isResetting ? 'true' : 'false'}</p>
                <p>Error: {error || 'None'}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {(status !== 'success' && status !== 'invalid') && (
        <CardFooter className="flex flex-col items-center justify-center p-6 border-t bg-gray-50 rounded-b-lg">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Back to login
            </Link>
          </p>
        </CardFooter>
      )}
    </Card>
  );
};
