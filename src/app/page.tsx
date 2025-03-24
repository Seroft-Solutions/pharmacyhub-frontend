'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/shared/auth';
import {
  ArrowRight, Mail, BellRing, Clock, CalendarDays,
  Sparkles, CheckCircle, Link2, FileText,
  Facebook, Twitter, Instagram, Linkedin,
  Phone, MapPin,MessageCircle
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

    // Define a fixed launch date for everyone
    const FIXED_LAUNCH_DATE = new Date('2025-03-27T00:00:00Z').toISOString(); // Example: Dec 31, 2024

    // Check if we already have a launch date stored
    const savedLaunchDate = localStorage.getItem('pharmacyHubLaunchDate');
    const now = new Date();

    if (savedLaunchDate) {
      // Compare with our fixed date
      const storedDate = new Date(savedLaunchDate);
      const fixedDate = new Date(FIXED_LAUNCH_DATE);

      // If the stored date doesn't match our fixed date or has passed, update it
      if (storedDate.getTime() !== fixedDate.getTime() || storedDate.getTime() <= now.getTime()) {
        localStorage.setItem('pharmacyHubLaunchDate', FIXED_LAUNCH_DATE);
        setLaunchDate(new Date(FIXED_LAUNCH_DATE));
      } else {
        // Use the existing date
        setLaunchDate(storedDate);
      }
    } else {
      // No stored date, use our fixed date
      localStorage.setItem('pharmacyHubLaunchDate', FIXED_LAUNCH_DATE);
      setLaunchDate(new Date(FIXED_LAUNCH_DATE));
    }
  }, [isAuthenticated, router]);


  const CountdownItem = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg px-4 py-2 text-white font-bold text-xl md:text-3xl min-w-[70px] text-center shadow-md">
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-xs md:text-sm text-gray-600 mt-1 font-medium">{label}</span>
    </div>
  );


  const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-colors duration-300 group">
      <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
        <Icon className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

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
              Launching Soon
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

            {/* Countdown Timer with Improved Styling */}
            <div className="mt-12 md:mt-16">
              <p className="text-gray-600 mb-6 flex items-center justify-center text-lg">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Launching in
              </p>
              <div className="flex justify-center gap-4 md:gap-6">
                <CountdownItem value={countdown.days} label="Days" />
                <CountdownItem value={countdown.hours} label="Hours" />
                <CountdownItem value={countdown.minutes} label="Minutes" />
                <CountdownItem value={countdown.seconds} label="Seconds" />
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-10">
              <Button
                size="lg"
                className="text-base md:text-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-all duration-300 py-2.5 md:py-3 px-6 md:px-8 rounded-full shadow-md hover:shadow-lg"
                onClick={() => window.scrollTo({ top: document.getElementById('subscribe')?.offsetTop || 2000, behavior: 'smooth' })}
              >
                Join the Waitlist
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Is PharmacyHub Section */}
      <section id="about" className="py-20 md:py-28 bg-white relative">
        {/* Removed diagonal background that was causing issues */}
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-block px-4 py-1 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-4">
              About the Platform
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-blue-600">PharmacyHub</span>?
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              PharmacyHub is a comprehensive platform designed specifically for pharmacy professionals,
              students, and educators. We're creating an integrated ecosystem that seamlessly connects
              exam preparation, certification management, and professional networking, all in one place.
            </p>
          </div>

          {/* Feature cards grid with better styling */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12">
            <FeatureCard
              icon={Sparkles}
              title="Exam Preparation"
              description="Access comprehensive exam materials, practice tests, and personalized study plans to excel in your pharmacy certifications."
            />
            <FeatureCard
              icon={CalendarDays}
              title="Pharmacy Licensing"
              description="Easily track, manage, and renew your pharmacy licenses and certifications with automated reminders and documentation."
            />
            <FeatureCard
              icon={Link2}
              title="Professional Connections"
              description="Connect with fellow pharmacy professionals, share knowledge, and discover career opportunities within the industry."
            />
            <FeatureCard
              icon={BellRing}
              title="Regulatory Compliance"
              description="Stay up-to-date with the latest regulatory requirements and compliance standards affecting the pharmacy profession."
            />
            <FeatureCard
              icon={FileText}
              title="Resource Library"
              description="Access a comprehensive library of pharmacy resources, research papers, and continuing education materials."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Support Network"
              description="Get assistance from our team of experts and connect with peers to solve complex pharmacy practice challenges."
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section - Enhanced */}
      <section id="subscribe" className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 relative">
        <div className="absolute inset-0 bg-[url('/Images/med.jpg')] opacity-3" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-gray-600 mb-8">
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
                  className="w-full h-12 border-gray-300 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-12 px-6 hover:shadow-lg transition-all duration-300"
              >
                Subscribe
                <Mail className="ml-2 h-4 w-4" />
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
                  <CheckCircle className="h-4 w-4 mr-2" />
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
                    <MessageCircle className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
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
