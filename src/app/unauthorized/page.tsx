'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Unauthorized() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6 text-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>
        
        <h1 className="mb-2 text-2xl font-bold text-gray-800">Access Denied</h1>
        
        <p className="mb-6 text-gray-600">
          You don't have permission to access this page. This area is restricted.
        </p>
        
        {user && (
          <div className="mb-6 rounded-md bg-gray-100 p-4 text-sm text-gray-700">
            <p>Logged in as: <span className="font-semibold">{user.email}</span></p>
            <p>Role: <span className="font-semibold">{user.roles.join(', ') || 'Unknown'}</span></p>
          </div>
        )}
        
        <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
          <Link
            href="/dashboard"
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Dashboard
          </Link>
          
          <button
            onClick={logout}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}