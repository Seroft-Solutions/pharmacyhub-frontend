"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useLoginForm } from '@/features/core/auth/hooks/useLoginForm';
import { useMobileStore, selectIsMobile } from '@/features/core/mobile-support';
import { ForceLogoutModal } from '../modals/ForceLogoutModal';
import { useForceLogout } from '../../hooks/useForceLogout';

// Import shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

// Import icons
import { AlertCircle, Loader2, LockKeyhole, LogIn, Mail, Eye, EyeOff } from 'lucide-react';

// Import anti-sharing components
import { LoginValidationError } from '@/features/core/auth/anti-sharing/components/LoginValidationError';
import { OTPChallenge } from '@/features/core/auth/anti-sharing/components/OTPChallenge';

/**
 * Enhanced login form that handles:
 * - Regular login
 * - Account verification errors
 * - Session conflicts with force logout option
 */
export const EnhancedLoginForm = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    error,
    isLoading,
    handleSubmit,
    handleSocialLogin,
    // Anti-sharing properties
    showOtpChallenge,
    showValidationError,
    loginStatus,
    handleOtpVerification,
    handleValidationContinue,
    handleCancel
  } = useLoginForm();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showForceLogoutModal, setShowForceLogoutModal] = useState(false);
  const isMobile = useMobileStore(selectIsMobile);
  
  // Force logout functionality
  const { forceLogout, isLoading: isForceLoggingOut } = useForceLogout();
  
  // Handle TOO_MANY_DEVICES error specially
  const handleContinueWithConflict = () => {
    if (loginStatus === 'TOO_MANY_DEVICES') {
      // Show force logout modal instead of standard flow
      setShowValidationError(false);
      setShowForceLogoutModal(true);
    } else {
      // Proceed with standard validation flow
      handleValidationContinue();
    }
  };
  
  // Handle force logout confirmation
  const handleForceLogoutConfirm = async () => {
    const success = await forceLogout();
    if (!success) {
      setShowForceLogoutModal(false);
    }
    // On success, forceLogout will redirect automatically
  };
  
  // Handle force logout cancellation
  const handleForceLogoutCancel = () => {
    setShowForceLogoutModal(false);
  };

  return (
    <>
      <Card className={`border-none shadow-2xl backdrop-blur-sm bg-white/90 ${isMobile ? 'w-[95%] mx-auto max-w-md' : ''}`}>
        <CardHeader className={`space-y-1 ${isMobile ? 'pb-4 pt-5' : 'pb-6'}`}>
          <div className="flex justify-center mb-4">
            <div
              className={`${isMobile ? 'size-16' : 'size-20'} rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center ${isMobile ? 'p-4' : 'p-5'} shadow-lg`}>
              <LogIn className={`text-white ${isMobile ? 'h-8 w-8' : 'h-10 w-10'}`}/>
            </div>
          </div>
          <CardTitle className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-center text-gray-800`}>
            Welcome to PharmacyHub
          </CardTitle>
          <CardDescription className={`text-center text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
            Sign in to access your pharmacy dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className={isMobile ? 'px-4' : ''}>
          {error && (
            <div className={`mb-${isMobile ? '4' : '6'} p-3 rounded flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700`}>
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0"/>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={`space-y-${isMobile ? '4' : '5'}`}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <div className="relative group">
                <Mail
                  className="absolute left-3 top-3 h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors"/>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 border-gray-300 bg-white focus:border-blue-500 transition-all ${isMobile ? 'h-10 text-sm' : ''}`}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-medium text-blue-600 hover:text-blue-700 transition-colors`}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <LockKeyhole
                  className="absolute left-3 top-3 h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors"/>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 border-gray-300 bg-white focus:border-blue-500 transition-all ${isMobile ? 'h-10 text-sm' : ''}`}
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
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember_me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
                className="text-blue-600 border-gray-300"
              />
              <Label
                htmlFor="remember_me"
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-normal text-gray-600 cursor-pointer`}
              >
                Remember me for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full ${isMobile ? 'h-10 text-sm' : 'h-11'} font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className={`mt-${isMobile ? '6' : '8'}`}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full"/>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className={`mt-${isMobile ? '4' : '6'} grid grid-cols-2 gap-3`}>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                className={`bg-white font-normal hover:bg-gray-50 transition-colors ${isMobile ? 'text-xs h-9' : ''}`}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('facebook')}
                className={`bg-white font-normal hover:bg-gray-50 transition-colors ${isMobile ? 'text-xs h-9' : ''}`}
              >
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="#1877F2"
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className={`flex flex-col items-center justify-center ${isMobile ? 'p-4' : 'p-6'} border-t bg-gray-50 rounded-b-lg`}>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign up now
            </Link>
          </p>
        </CardFooter>
      </Card>
      
      {/* Force logout modal */}
      <ForceLogoutModal 
        isOpen={showForceLogoutModal}
        isLoading={isForceLoggingOut}
        onConfirm={handleForceLogoutConfirm}
        onCancel={handleForceLogoutCancel}
      />
      
      {/* Anti-sharing protection modals */}
      <LoginValidationError 
        isOpen={showValidationError}
        status={loginStatus}
        onContinue={handleContinueWithConflict}
        onCancel={handleCancel}
      />
      
      <OTPChallenge 
        isOpen={showOtpChallenge}
        onVerify={handleOtpVerification}
        onCancel={handleCancel}
      />
    </>
  );
};

export default EnhancedLoginForm;