"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useRegisterForm, FormStep } from '../context/RegisterFormContext';

export const StepIndicator: React.FC = () => {
  const { currentStep } = useRegisterForm();
  
  // Don't show step indicator on success screen
  if (currentStep === 'success') return null;
  
  const steps: { key: FormStep; label: string }[] = [
    { key: 'account', label: 'Account' },
    { key: 'personal', label: 'Personal' },
    { key: 'confirmation', label: 'Confirmation' },
  ];
  
  // Helper function to determine if a step is completed
  const isStepCompleted = (stepKey: FormStep): boolean => {
    switch (stepKey) {
      case 'account':
        return ['personal', 'confirmation', 'success'].includes(currentStep);
      case 'personal':
        return ['confirmation', 'success'].includes(currentStep);
      case 'confirmation':
        return currentStep === 'success';
      default:
        return false;
    }
  };
  
  return (
    <div className="flex justify-between items-center w-full mb-8 relative">
      <div className="absolute h-1 bg-gray-200 left-0 top-1/2 transform -translate-y-1/2 w-full z-0" />
      
      {steps.map((step, index) => {
        const isActive = currentStep === step.key;
        const isCompleted = isStepCompleted(step.key);
        
        return (
          <div key={step.key} className="z-10 flex flex-col items-center">
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
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
