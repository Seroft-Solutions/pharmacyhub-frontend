'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FeatureCardSection } from "@/features/home/ui/FeatureCardSection";
import { Footer } from "@/features/home/ui/Footer";
import { useAuth } from '@/shared/auth';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ModernMinimalistLogo from "@/shared/ui/logo/ModernMinimalistLogo";

interface Router {
  replace: (path: string) => void;
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleNavigation = (route: string) => {
    (router as Router).replace(route);
  };

  return (
    <main className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-14 md:h-16 items-center justify-between">
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ModernMinimalistLogo />
              </motion.div>
            </div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Button
                variant="outline"
                className="text-sm md:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:opacity-90 transition-all duration-300 py-1.5 md:py-2 px-3 md:px-4"
                onClick={() => handleNavigation('/login')}
              >
                Join Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button
>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
        <div className="absolute inset-0 bg-[url('/Images/med.jpg')] opacity-5" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center space-y-4 md:space-y-6 py-8 md:py-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome to PharmacyHub
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 md:px-0">
              Connect with pharmacies, manage licenses, and prepare for exams all in one place.
              Join our growing network of pharmacy professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                size="lg"
                className="text-sm md:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-all duration-300 py-1.5 md:py-2"
                onClick={() => handleNavigation('/register')}
              >
                Get Started
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-sm md:text-base border-blue-600 text-blue-600 hover:bg-blue-50 py-1.5 md:py-2"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <FeatureCardSection />
      <Footer />
    </main>
  );
}
