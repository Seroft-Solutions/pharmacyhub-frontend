"use client";

import React from 'react';
import { VerificationActions } from './VerificationActions';
import { CheckCircle, Sparkles, Mail } from 'lucide-react';

interface RegistrationSuccessProps {
  email: string;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({ 
  email 
}) => {
  return (
    <div className="flex flex-col items-center py-8 text-center max-w-md mx-auto px-4">
      {/* Success Icon with Animation */}
      <div 
        className="mb-6 p-4 rounded-full bg-green-100 text-green-600 relative"
        aria-hidden="true"
      >
        <CheckCircle className="h-16 w-16" />
        <div className="absolute -top-1 -right-1">
          <Sparkles className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="absolute -bottom-1 -left-1">
          <Sparkles className="h-4 w-4 text-yellow-400" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Registration Successful!
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md">
        Your account has been created successfully. Please check your email to verify your account and begin using PharmacyHub.
      </p>

      {/* Simple verification notice */}
      <div className="w-full bg-blue-50 rounded-lg p-4 mb-8 flex items-center text-left border border-blue-100">
        <div className="p-2 bg-blue-100 rounded-full text-blue-600 flex-shrink-0 mr-3">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <p className="text-blue-800 font-medium">Verification email sent</p>
          <p className="text-sm text-blue-700">
            We've sent a verification link to <strong>{email}</strong>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            The verification link will expire in 24 hours. Please check your spam folder if you don't see it.
          </p>
        </div>
      </div>

      {/* Action buttons component */}
      <VerificationActions email={email} />
    </div>
  );
};

export default RegistrationSuccess;
