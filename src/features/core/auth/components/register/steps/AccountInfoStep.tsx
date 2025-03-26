"use client";

import React from 'react';
import { ChevronRight, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegisterForm } from '../context/RegisterFormContext';
import { PasswordStrengthIndicator } from '../utils/PasswordStrengthIndicator';

export const AccountInfoStep: React.FC = () => {
  const { 
    formData, 
    updateFormData, 
    errors, 
    showPassword, 
    showConfirmPassword, 
    toggleShowPassword, 
    toggleShowConfirmPassword,
    validateStep,
    setCurrentStep
  } = useRegisterForm();

  const handleContinue = () => {
    if (validateStep('account')) {
      setCurrentStep('personal');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username" className={errors.username ? "text-red-500" : "text-gray-700"}>
          Username
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="johndoe"
            value={formData.username}
            onChange={(e) => updateFormData('username', e.target.value)}
            className={`pl-10 border-gray-300 bg-white ${errors.username ? "border-red-500 ring-red-500" : ""}`}
            required
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className={errors.email ? "text-red-500" : "text-gray-700"}>
          Email address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className={`pl-10 border-gray-300 bg-white ${errors.email ? "border-red-500 ring-red-500" : ""}`}
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className={errors.password ? "text-red-500" : "text-gray-700"}>
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            className={`pl-10 border-gray-300 bg-white ${errors.password ? "border-red-500 ring-red-500" : ""}`}
            required
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        
        {/* Password strength indicator */}
        <PasswordStrengthIndicator />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className={errors.confirmPassword ? "text-red-500" : "text-gray-700"}>
          Confirm password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            className={`pl-10 border-gray-300 bg-white ${errors.confirmPassword ? "border-red-500 ring-red-500" : ""}`}
            required
          />
          <button
            type="button"
            onClick={toggleShowConfirmPassword}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          onClick={handleContinue}
          className="w-full sm:w-auto"
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
