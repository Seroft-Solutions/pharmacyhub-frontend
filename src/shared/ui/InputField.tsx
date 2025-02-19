import React from 'react';
import { Input } from '@/components/ui/input';
import { FieldError } from 'react-hook-form';
import { cn } from "@/lib/utils";
import { AlertCircle } from 'lucide-react';

interface InputFieldProps {
  name: string;
  label: string;
  icon?: React.ReactNode;
  register: any;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  type?: string;
  error?: FieldError;
  isPercentage?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  exactLength?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
                                                        name,
                                                        label,
                                                        icon: Icon,
                                                        register,
                                                        placeholder,
                                                        required = false,
                                                        type = 'text',
                                                        disabled = false,
                                                        value,
                                                        error,
                                                        isPercentage = false,
                                                        min = 0,
                                                        max,
                                                        maxLength,
                                                        exactLength = false
                                                      }) => {
  // Convert type='number' to pattern input for length control
  const inputType = (type === 'number' || isPercentage) ? 'text' : type;
  const inputPattern = (type === 'number' || isPercentage) ? '[0-9]*' : undefined;

  return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {maxLength && (
              <span className="text-gray-500 text-xs ml-1">
                        {exactLength ? `(Exactly ${maxLength} digits)` : `(Max ${maxLength} digits)`}
                    </span>
          )}
        </label>

        <div className="relative">
          {Icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {Icon}
              </div>
          )}
          <Input
              id={name}
              type={inputType}
              pattern={inputPattern}
              inputMode={type === 'number' || isPercentage ? 'numeric' : undefined}
              disabled={disabled}
              placeholder={placeholder}
              maxLength={maxLength}
              {...register(name, {
                required: required ? 'This field is required' : false,
                validate: (value: string) => {
                  // Empty check for optional fields
                  if (!value && !required) return true;

                  // Length validation
                  if (exactLength && maxLength && value.length !== maxLength) {
                    return `Input must be exactly ${maxLength} digits`;
                  }
                  if (maxLength && value.length > maxLength) {
                    return `Input cannot exceed ${maxLength} digits`;
                  }

                  // Number validation
                  if (type === 'number' || isPercentage) {
                    // Check if input contains only numbers
                    if (!/^\d*$/.test(value)) {
                      return 'Please enter only numbers';
                    }

                    const numValue = parseFloat(value);
                    if (isNaN(numValue)) {
                      return 'Please enter a valid number';
                    }
                    if (numValue < min) {
                      return `Value cannot be less than ${min}${isPercentage ? '%' : ''}`;
                    }

                  }

                  if (type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                      return 'Invalid email format';
                    }
                  }
                  return true;
                },
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  // Remove non-numeric characters for number inputs
                  if (type === 'number' || isPercentage) {
                    e.target.value = e.target.value.replace(/[^\d]/g, '');
                  }
                }
              })}
              className={cn(
                  'block w-full pl-10 pr-8 py-2 border rounded-md shadow-sm sm:text-sm',
                  error ? 'border-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
                  disabled && 'bg-gray-100 cursor-not-allowed'
              )}
          />
          {isPercentage && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                %
              </div>
          )}
        </div>
        {error && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-4 w-4 text-red-600" aria-hidden="true" />
              <span>{error.message}</span>
            </p>
        )}
      </div>
  );
};

export default InputField;