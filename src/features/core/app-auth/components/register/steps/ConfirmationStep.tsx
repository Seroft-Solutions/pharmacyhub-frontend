"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useRegisterForm } from '../context/RegisterFormContext';

export const ConfirmationStep: React.FC = () => {
  const {
    formData,
    errors,
    showSuccessAnimation,
    isRegistering,
    handleSubmit,
    prevStep
  } = useRegisterForm();

  const handleCheckChange = (checked: boolean) => {
    // This would be handled by handleChange in the context, but we need a special case for Checkbox
    const e = {
      target: {
        name: 'acceptTerms',
        type: 'checkbox',
        checked
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    // Manually trigger the handleChange function from context
    document.dispatchEvent(new CustomEvent('form-change', { detail: e }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Account Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Username:</span>
            <span className="col-span-2 font-medium text-gray-800">{formData.username}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Email:</span>
            <span className="col-span-2 font-medium text-gray-800">{formData.email}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Name:</span>
            <span className="col-span-2 font-medium text-gray-800">{formData.firstName} {formData.lastName}</span>
          </div>
          {formData.phoneNumber && (
            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-500">Phone:</span>
              <span className="col-span-2 font-medium text-gray-800">{formData.phoneNumber}</span>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500">Account Type:</span>
            <span className="col-span-2 font-medium text-gray-800">General User</span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={handleCheckChange}
            className={errors.acceptTerms ? "border-red-500" : ""}
          />
          <Label
            htmlFor="acceptTerms"
            className={`text-sm font-normal ${errors.acceptTerms ? "text-red-500" : "text-gray-600"}`}
          >
            I accept the{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
              Privacy Policy
            </Link>
          </Label>
        </div>
        {errors.acceptTerms && (
          <p className="mt-1 text-xs text-red-500 pl-6">{errors.acceptTerms}</p>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={showSuccessAnimation || isRegistering}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          onClick={(e) => handleSubmit(e)}
        >
          {isRegistering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : showSuccessAnimation ? (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-2">Success!</span>
            </div>
          ) : (
            'Create account'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
