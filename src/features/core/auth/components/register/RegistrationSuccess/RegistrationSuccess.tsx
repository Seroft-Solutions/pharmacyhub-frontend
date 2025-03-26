"use client";

import React from 'react';
import { EmailVerificationStatus } from './EmailVerificationStatus';
import { VerificationSteps } from './VerificationSteps';
import { VerificationActions } from './VerificationActions';
import { CheckCheck } from 'lucide-react';

interface RegistrationSuccessProps {
  email: string;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({ 
  email 
}) => {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      {/* Success Icon with Animation */}
      <div 
        className="mb-6 p-4 rounded-full bg-green-100 text-green-600 animate-fade-in-scale"
        aria-hidden="true"
      >
        <CheckCheck className="h-16 w-16" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Registration Successful!
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md">
        Your account has been created and is pending approval from our team.
      </p>

      {/* Email verification status component */}
      <EmailVerificationStatus email={email} />

      {/* Verification steps component */}
      <VerificationSteps />

      {/* Action buttons component */}
      <VerificationActions email={email} />
    </div>
  );
};
