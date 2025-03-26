"use client";

import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  LogIn 
} from 'lucide-react';

export const VerificationSteps: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Verify your email address",
      description: "Click the link in the verification email we just sent you",
      icon: <CheckCircle2 className="h-5 w-5" />
    },
    {
      number: 2,
      title: "Wait for admin approval",
      description: "Our team will review your account (usually within 24 hours)",
      icon: <Clock className="h-5 w-5" />
    },
    {
      number: 3,
      title: "Log in and start using PharmacyHub",
      description: "Once approved, you'll have access to all features",
      icon: <LogIn className="h-5 w-5" />
    }
  ];

  return (
    <div className="w-full max-w-md mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-left">
        Next steps:
      </h3>
      
      <div className="relative">
        {/* Vertical timeline line */}
        <div 
          className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-600"
          aria-hidden="true"
        ></div>
        
        {/* Steps */}
        <div className="space-y-5">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start relative z-10">
              <div 
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                  index === 0 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-md' 
                    : 'bg-gradient-to-r from-blue-400/70 to-indigo-500/70'
                }`}
              >
                {step.number}
              </div>
              
              <div className="ml-4">
                <h4 className="font-medium text-gray-800 flex items-center">
                  {step.title}
                  <span className="ml-2 text-blue-600">
                    {step.icon}
                  </span>
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
