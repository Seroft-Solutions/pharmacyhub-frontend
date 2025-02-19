"use client";

import { useState } from 'react';
import Link from 'next/link';
import { AuthLoading } from '@/components/auth';
import AuthService from '@/services/authService';
import { ROUTES } from '@/config/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      await AuthService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AuthLoading message="Processing your request..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Reset your password
        </h1>

        {success ? (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
              Password reset instructions have been sent to your email address.
            </div>
            <Link
              href={ROUTES.LOGIN}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Return to login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 text-center mb-6">
              Enter your email address and we&apos;ll send you instructions to reset your password.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Send reset instructions
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
          </>
        )}
      </div>
    </div>
  );
}