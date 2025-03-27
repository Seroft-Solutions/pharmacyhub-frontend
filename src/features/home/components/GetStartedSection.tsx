'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const GetStartedSection = () => {
  return (
    <section id="get-started" className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 relative">
      <div className="absolute inset-0 bg-[url('/Images/med.jpg')] opacity-3" />
      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl mx-auto text-center bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of pharmacy professionals already using PharmacyHub to advance their careers,
            prepare for exams, and connect with colleagues around the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button variant="outline" className="h-12 px-8 text-lg">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-12 px-8 text-lg hover:shadow-lg transition-all duration-300">
                Sign Up
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
