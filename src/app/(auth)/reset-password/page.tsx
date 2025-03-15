"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthLoading } from '../../../features/auth/components/feedback';
import { validatePassword, calculatePasswordStrength } from '@/utils/password';
import { ROUTES } from '@/features/auth/config/auth';
import { authService } from '@/features/auth/api/services/authService';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(calculatePasswordStrength(''));

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // If no token is provided, redirect to forgot password page
  if (!token) {
    router.replace(ROUTES.LOGIN);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(token, newPassword);
      router.push(`${ROUTES.LOGIN}?message=Password reset successful. Please login with your new password.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  if (loading) {
    return <AuthLoading message="Resetting your password..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Reset your password
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="newPassword" 
              className="block text-sm font-medium text-gray-700"
            >
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {/* Password strength indicator */}
            <div className="mt-2">
              <div className="flex items-center">
                <div className="flex-1 h-2 bg-gray-200 rounded">
                  <div
                    className={`h-full rounded transition-all ${
                      passwordStrength.label === 'very-weak' ? 'w-1/5 bg-red-500' :
                      passwordStrength.label === 'weak' ? 'w-2/5 bg-orange-500' :
                      passwordStrength.label === 'medium' ? 'w-3/5 bg-yellow-500' :
                      passwordStrength.label === 'strong' ? 'w-4/5 bg-green-500' :
                      'w-full bg-green-600'
                    }`}
                  />
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {passwordStrength.label.replace('-', ' ')}
                </span>
              </div>
              {passwordStrength.suggestions.length > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  {passwordStrength.suggestions[0]}
                </p>
              )}
            </div>
          </div>

          <div>
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium text-gray-700"
            >
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Reset password
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href={ROUTES.LOGIN}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}