"use client";

import React from 'react';
import { useRegisterForm } from '../context/RegisterFormContext';

export const PasswordStrengthIndicator: React.FC = () => {
  const { passwordStrength } = useRegisterForm();
  
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
  
  const getProgressWidth = () => {
    switch(passwordStrength.label) {
      case 'very-weak': return 'w-1/5';
      case 'weak': return 'w-2/5';
      case 'medium': return 'w-3/5';
      case 'strong': return 'w-4/5';
      case 'very-strong': return 'w-full';
      default: return 'w-0';
    }
  };
  
  return (
    <div className="mt-2">
      <div className="flex items-center">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${getPasswordStrengthColor()} ${getProgressWidth()}`}
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
  );
};
