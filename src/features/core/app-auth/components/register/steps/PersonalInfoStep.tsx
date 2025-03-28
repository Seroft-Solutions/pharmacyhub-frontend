"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRegisterForm } from '../context/RegisterFormContext';

export const PersonalInfoStep: React.FC = () => {
  const { 
    formData, 
    updateFormData, 
    errors, 
    validateStep,
    setCurrentStep
  } = useRegisterForm();

  const handleBack = () => {
    setCurrentStep('account');
  };

  const handleContinue = () => {
    if (validateStep('personal')) {
      setCurrentStep('confirmation');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className={errors.firstName ? "text-red-500" : "text-gray-700"}>
              First name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              className={`border-gray-300 bg-white ${errors.firstName ? "border-red-500 ring-red-500" : ""}`}
              required
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className={errors.lastName ? "text-red-500" : "text-gray-700"}>
              Last name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              className={`border-gray-300 bg-white ${errors.lastName ? "border-red-500 ring-red-500" : ""}`}
              required
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className={errors.phoneNumber ? "text-red-500" : "text-gray-700"}>
          Phone number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="+1 (555) 123-4567"
            autoComplete="tel"
            value={formData.phoneNumber}
            onChange={(e) => updateFormData('phoneNumber', e.target.value)}
            className={`pl-10 border-gray-300 bg-white ${errors.phoneNumber ? "border-red-500 ring-red-500" : ""}`}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">We'll use this number for account verification and important notifications</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="userType" className="text-gray-700">
          Account type
        </Label>
        <Select
          value="PHARMACIST"
          disabled={true}
          onValueChange={(value) => updateFormData('userType', value)}
        >
          <SelectTrigger className="w-full border-gray-300 bg-white">
            <SelectValue placeholder="General User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PHARMACIST">Pharmacist</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 mt-1">Your account type determines which features you can access</p>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
