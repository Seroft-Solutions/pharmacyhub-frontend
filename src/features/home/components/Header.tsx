'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ModernMinimalistLogo from "@/shared/ui/logo/ModernMinimalistLogo";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <ModernMinimalistLogo />
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <a 
              href="#about" 
              className="hidden md:block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </a>
            <a 
              href="#features" 
              className="hidden md:block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Features
            </a>
            <Link href="/login">
              <Button variant="outline" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm px-4 py-2"
              >
                Sign Up
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
