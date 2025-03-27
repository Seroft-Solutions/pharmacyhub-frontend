"use client";

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useMobileStore, selectIsMobile } from '@/features/core/mobile-support';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
}

export const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  const isMobile = useMobileStore(selectIsMobile);
  
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${isMobile ? 'px-2 py-6' : 'px-4 py-12'} relative overflow-hidden`}>
      {/* Back to home button - more prominent */}
      <div className="absolute top-4 left-4 z-20">
        <Link href="/">
          <Button size="default" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </Button>
        </Link>
      </div>

      {/* Animated background elements - reduced size and opacity on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -left-40 ${isMobile ? 'w-60 h-60 opacity-40' : 'w-80 h-80 opacity-70'} bg-blue-200 rounded-full mix-blend-multiply animate-blob`}></div>
        <div className={`absolute top-0 -right-20 ${isMobile ? 'w-60 h-60 opacity-40' : 'w-80 h-80 opacity-70'} bg-purple-200 rounded-full mix-blend-multiply animate-blob animation-delay-2000`}></div>
        <div className={`absolute -bottom-40 left-20 ${isMobile ? 'w-60 h-60 opacity-40' : 'w-80 h-80 opacity-70'} bg-indigo-200 rounded-full mix-blend-multiply animate-blob animation-delay-4000`}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {children}
      </div>

      {/* Add keyframes animation styles */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @media (prefers-reduced-motion) {
          .animate-blob {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};