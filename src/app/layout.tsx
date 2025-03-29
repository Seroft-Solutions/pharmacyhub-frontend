'use client';

import React, { useEffect } from 'react';
import AuthProvider from './providers/AuthProvider';
import { QueryProvider } from '@/features/core/tanstack-query-api/components/QueryProvider';
import { Inter } from 'next/font/google';
import './globals.css';

// Define the Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Global handler to disable ALL native reload dialogs app-wide
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // This handler will intercept ALL beforeunload events
    const preventNativeDialog = (e: BeforeUnloadEvent) => {
      // Prevent the default browser behavior
      e.preventDefault();
      e.stopImmediatePropagation();
      
      // For Chrome and modern browsers
      // Setting returnValue to empty string is important
      e.returnValue = '';
      
      // For older browsers that might still use non-standard dialogs
      return '';
    };
    
    // Add our handler with the highest priority (capture phase) and passive:false
    window.addEventListener('beforeunload', preventNativeDialog, { capture: true, passive: false });
    
    return () => {
      window.removeEventListener('beforeunload', preventNativeDialog, { capture: true, passive: false });
    };
  }, []);

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
