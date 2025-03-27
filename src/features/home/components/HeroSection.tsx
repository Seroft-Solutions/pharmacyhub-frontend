'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="pt-32 md:pt-40 pb-16 md:pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-70" />
      <div className="absolute inset-0 bg-[url('/Images/med.jpg')] opacity-5" />

      {/* Floating Elements - Reduced opacity */}
      <div className="absolute top-1/4 right-[15%] w-24 h-24 bg-blue-400 rounded-full opacity-5"></div>
      <div className="absolute bottom-1/3 left-[10%] w-32 h-32 bg-indigo-500 rounded-full opacity-5"></div>
      <div className="absolute top-1/3 left-[20%] w-16 h-16 bg-purple-400 rounded-full opacity-5"></div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8"
        >
          <div className="inline-block px-5 py-2 bg-blue-100 rounded-full text-blue-700 font-semibold text-sm mb-4 shadow-sm">
            Now Available
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Pharmacy
            </span>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Hub
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto px-4 md:px-0 leading-relaxed">
            A comprehensive platform connecting pharmacists, pharmacy managers, and proprietors for a better healthcare ecosystem.
          </p>

          {/* CTA Button */}
          <div className="mt-10">
            <Link href="/register">
              <Button
                size="lg"
                className="text-base md:text-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-all duration-300 py-2.5 md:py-3 px-6 md:px-8 rounded-full shadow-md hover:shadow-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
