"use client";

import React from 'react';
import { Inbox } from 'lucide-react';

interface EmailVerificationStatusProps {
  email: string;
}

export const EmailVerificationStatus: React.FC<EmailVerificationStatusProps> = ({ 
  email 
}) => {
  return (
    <div className="w-full max-w-md bg-blue-50 rounded-xl p-6 mb-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
        <div className="absolute transform rotate-45 bg-blue-100 w-24 h-24"></div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="p-2 bg-blue-100 rounded-full text-blue-600 flex-shrink-0">
          <Inbox className="h-6 w-6" />
        </div>
        
        <div className="text-left relative z-10">
          <h3 className="font-semibold text-blue-800 mb-1">
            Check your inbox
          </h3>
          
          <p className="text-blue-700 text-sm">
            We've sent a verification email to{' '}
            <strong className="font-medium">{email}</strong>
          </p>
          
          <div className="mt-3 p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-blue-100 shadow-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 flex-shrink-0 rounded bg-blue-600/10 flex items-center justify-center">
                <span className="text-blue-800 text-xs font-bold">@</span>
              </div>
              <div className="ml-2 text-left">
                <p className="text-xs text-gray-500">From: PharmacyHub Team</p>
                <p className="text-xs font-medium text-gray-700 truncate">
                  Subject: Verify your email address
                </p>
              </div>
            </div>
          </div>
          
          <p className="mt-3 text-xs text-blue-700/80 italic">
            Please check your spam folder if you don't see it in your inbox
          </p>
        </div>
      </div>
    </div>
  );
};
