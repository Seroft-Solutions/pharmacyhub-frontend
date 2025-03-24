'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/shared/auth';
import { 
  ArrowRight, Clock, WhatsApp
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ModernMinimalistLogo from "@/shared/ui/logo/ModernMinimalistLogo";

interface Router {
  replace: (path: string) => void;
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculate launch date - set to 3 days from now or retrieve from localStorage
  const [launchDate, setLaunchDate] = useState<Date | null>(null);

  // Countdown calculation
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Initialize or get saved launch date
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }

    // Check if we already have a launch date stored
    const savedLaunchDate = localStorage.getItem('pharmacyHubLaunchDate');
    
    if (savedLaunchDate) {
      // Use the stored date
      setLaunchDate(new Date(savedLaunchDate));
    } else {
      // Create a new date 3 days from now
      const newLaunchDate = new Date();
      newLaunchDate.setDate(newLaunchDate.getDate() + 3);
      
      // Save it to localStorage for persistence
      localStorage.setItem('pharmacyHubLaunchDate', newLaunchDate.toISOString());
      setLaunchDate(newLaunchDate);
    }
  }, [isAuthenticated, router]);

  // Countdown timer
  useEffect(() => {
    if (!launchDate) return;

    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Launch date has passed
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [launchDate]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the email to a backend service
    console.log('Subscribed with email:', email);
    setIsSubmitted(true);
    setEmail('');
    
    // Reset the submission state after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      {/* Header - Matching Image 1 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <ModernMinimalistLogo />
              </a>
            </div>

            <div className="flex items-center space-x-6">
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
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm px-4 py-2"
                onClick={() => window.scrollTo({ top: document.getElementById('subscribe')?.offsetTop || 2000, behavior: 'smooth' })}
              >
                Stay Updated
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Matching Image 1 */}
      <section className="pt-28 pb-16 relative bg-blue-50/50">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-block px-3 py-1 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-4">
              Launching Soon
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-blue-600">
              PharmacyHub
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              A comprehensive platform connecting pharmacists, pharmacy managers, and proprietors for a better healthcare ecosystem.
            </p>
            
            {/* Countdown Timer - Matching Image 1 */}
            <div className="mt-12">
              <p className="text-gray-600 mb-4 flex items-center justify-center text-base">
                <Clock className="w-4 h-4 mr-2 text-blue-600" />
                Launching in
              </p>
              <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-600 rounded-lg px-4 py-2 text-white font-bold text-2xl w-16 text-center">
                    {countdown.days.toString().padStart(2, '0')}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">Days</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-blue-600 rounded-lg px-4 py-2 text-white font-bold text-2xl w-16 text-center">
                    {countdown.hours.toString().padStart(2, '0')}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">Hours</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-blue-600 rounded-lg px-4 py-2 text-white font-bold text-2xl w-16 text-center">
                    {countdown.minutes.toString().padStart(2, '0')}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">Minutes</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-blue-600 rounded-lg px-4 py-2 text-white font-bold text-2xl w-16 text-center">
                    {countdown.seconds.toString().padStart(2, '0')}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">Seconds</span>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="mt-10">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg"
                onClick={() => window.scrollTo({ top: document.getElementById('subscribe')?.offsetTop || 2000, behavior: 'smooth' })}
              >
                Join the Waitlist
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What Is PharmacyHub Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block px-3 py-1 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-4">
              About the Platform
            </div>
            <h2 className="text-3xl font-bold mb-4">
              What is <span className="text-blue-600">PharmacyHub</span>?
            </h2>
            <p className="text-gray-600">
              PharmacyHub is a comprehensive platform designed specifically for pharmacy professionals, 
              students, and educators. We're creating an integrated ecosystem that seamlessly connects 
              exam preparation, certification management, and professional networking, all in one place.
            </p>
          </div>

          {/* Feature cards grid - Matching screenshot */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg p-6 transition-all">
              <div className="text-blue-100 mb-4">
                <svg className="w-6 h-6 text-blue-100" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16L6 10H18L12 16Z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Exam Preparation</h3>
              <p className="text-gray-600 text-sm">
                Access comprehensive exam materials, practice tests, and personalized study plans to excel in your pharmacy certifications.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 transition-all">
              <div className="text-blue-100 mb-4">
                <svg className="w-6 h-6 text-blue-100" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16L6 10H18L12 16Z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Pharmacy Licensing</h3>
              <p className="text-gray-600 text-sm">
                Easily track, manage, and renew your pharmacy licenses and certifications with automated reminders and documentation.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 transition-all">
              <div className="text-blue-100 mb-4">
                <svg className="w-6 h-6 text-blue-100" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16L6 10H18L12 16Z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Professional Connections</h3>
              <p className="text-gray-600 text-sm">
                Connect with fellow pharmacy professionals, share knowledge, and discover career opportunities within the industry.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 transition-all">
              <div className="text-blue-100 mb-4">
                <svg className="w-6 h-6 text-blue-100" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16L6 10H18L12 16Z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Regulatory Compliance</h3>
              <p className="text-gray-600 text-sm">
                Stay up-to-date with the latest regulatory requirements and compliance standards affecting the pharmacy profession.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 transition-all">
              <div className="text-blue-100 mb-4">
                <svg className="w-6 h-6 text-blue-100" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16L6 10H18L12 16Z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Resource Library</h3>
              <p className="text-gray-600 text-sm">
                Access a comprehensive library of pharmacy resources, research papers, and continuing education materials.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 transition-all">
              <div className="text-blue-100 mb-4">
                <svg className="w-6 h-6 text-blue-100" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16L6 10H18L12 16Z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Support Network</h3>
              <p className="text-gray-600 text-sm">
                Get assistance from our team of experts and connect with peers to solve complex pharmacy practice challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="subscribe" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">
              Be the first to know when PharmacyHub launches. Subscribe to our newsletter for exclusive updates, early access opportunities, and special offers.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 border-gray-300 focus:border-blue-500"
                />
              </div>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6"
              >
                Subscribe
              </Button>
            </form>

            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 text-center"
              >
                <div className="inline-flex items-center justify-center px-4 py-2 bg-green-100 text-green-700 rounded-full">
                  Thank you for subscribing! We'll keep you updated.
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Footer - Simplified with WhatsApp only */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8 w-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-5">
                <ModernMinimalistLogo />
              </div>
              <p className="text-gray-600 mb-6">
                Connecting pharmacists, pharmacy managers, and proprietors for a better healthcare ecosystem.
              </p>
              <div className="flex space-x-4">
                <a href="https://twitter.com/pharmacyhub" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="https://facebook.com/pharmacyhub" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                  </svg>
                </a>
                <a href="https://instagram.com/pharmacyhub" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/pharmacyhub" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
            </div>

            <div className="mb-8 md:mb-0">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Services</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center">
                    Pharmacy Licensing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center">
                    Professional Connections
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center">
                    Exam Preparation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center">
                    Regulatory Compliance
                  </a>
                </li>
              </ul>
            </div>

            <div className="mb-8 md:mb-0">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div className="mb-8 md:mb-0">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://wa.me/923137020758" 
                    className="flex items-start text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsApp className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                    <span>+923137020758</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Pharmacy Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
