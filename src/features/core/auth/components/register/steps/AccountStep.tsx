"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useRegisterForm } from '../context/RegisterFormContext';

export const AccountStep: React.FC = () => {
  const {
    formData,
    errors,
    passwordStrength,
    showPassword,
    showConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    handleChange,
    nextStep
  } = useRegisterForm();

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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
        <div className="mt-2">
          <div className="flex items-center">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getPasswordStrengthColor()} ${
                  passwordStrength.label === 'very-weak' ? 'w-1/5' :
                  passwordStrength.label === 'weak' ? 'w-2/5' :
                  passwordStrength.label === 'medium' ? 'w-3/5' :
                  passwordStrength.label === 'strong' ? 'w-4/5' : 'w-full'
                }`}
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
            onChange={handleChange}
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
          onClick={nextStep}
          className="w-full sm:w-auto"
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AccountStep;
