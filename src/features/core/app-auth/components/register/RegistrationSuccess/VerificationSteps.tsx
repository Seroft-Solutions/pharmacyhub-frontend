"use client";

import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  LogIn,
  MailCheck,
  User,
  Fingerprint
} from 'lucide-react';

export const VerificationSteps: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Verify your email address",
      description: "Click the link in the verification email we just sent you",
      icon: <MailCheck className="h-5 w-5" />,
      isCurrentStep: true
    },
    {
      number: 2,
      title: "Complete your profile",
      description: "Add your professional information and preferences",
      icon: <User className="h-5 w-5" />,
      isCurrentStep: false
    },
    {
      number: 3,
      title: "Set up security",
      description: "Add additional security options like two-factor authentication",
      icon: <Fingerprint className="h-5 w-5" />,
      isCurrentStep: false
    },
    {
      number: 4,
      title: "Start using PharmacyHub",
      description: "Access all features of the platform",
      icon: <LogIn className="h-5 w-5" />,
      isCurrentStep: false
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
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-medium 
                  ${step.isCurrentStep 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 ring-4 ring-blue-100 shadow-md' 
                    : index < steps.findIndex(s => s.isCurrentStep)
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : 'bg-gradient-to-r from-blue-400/70 to-indigo-500/70'
                  }`}
              >
                {index < steps.findIndex(s => s.isCurrentStep) ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </div>
              
              <div className="ml-4">
                <h4 className={`font-medium flex items-center ${
                  step.isCurrentStep ? 'text-blue-700' :
                  index < steps.findIndex(s => s.isCurrentStep) ? 'text-green-700' : 'text-gray-700'
                }`}>
                  {step.title}
                  <span className={`ml-2 ${
                    step.isCurrentStep ? 'text-blue-600' :
                    index < steps.findIndex(s => s.isCurrentStep) ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.icon}
                  </span>
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {step.description}
                </p>

                {/* Current step indicator */}
                {step.isCurrentStep && (
                  <div className="mt-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-md inline-block text-xs font-medium animate-pulse">
                    Current step
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerificationSteps;
