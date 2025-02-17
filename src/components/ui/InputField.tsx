import React from 'react';

interface InputFieldProps {
  name: string;
  label: string;
  register: any;
  placeholder?: string;
  required?: boolean;
  type?: string;
  error?: any;
  maxLength?: number;
  exactLength?: boolean;
}

export const InputField = ({
  name,
  label,
  register,
  placeholder,
  required = false,
  type = 'text',
  error,
  maxLength,
  exactLength
}: InputFieldProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name, {
          required: required && `${label} is required`,
          maxLength: maxLength && {
            value: maxLength,
            message: `${label} must be at most ${maxLength} characters`
          },
          validate: exactLength && ((value: string) => 
            value.length === maxLength || `${label} must be exactly ${maxLength} characters`
          )
        })}
        placeholder={placeholder}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
          error ? 'border-red-500' : ''
        }`}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};
