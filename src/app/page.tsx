'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/shared/auth';
import { 
  ArrowRight, Mail, BellRing, Clock, CalendarDays, 
  Sparkles, CheckCircle, Link2, FileText, 
  Facebook, Twitter, Instagram, Linkedin, 
  Phone, MapPin
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

  // Calculate launch date - set to 60 days from now
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 60);

  // Countdown calculation
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

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

  const FooterSection = ({ title, links }: { title: string, links: { label: string, href: string }[] }) => (
    <div className="mb-8 md:mb-0">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a 
              href={link.href} 
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center"
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 md:h-20 items-center justify-between">
            <div className="flex items-center">
              <ModernMinimalistLogo />
            </div>

            <div className="flex space-x-3">
              <Button
                variant="ghost"
                className="hidden md:flex text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => window.scrollTo({ top: document.getElementById('about')?.offsetTop || 800, behavior: 'smooth' })}
              >
                About
              </Button>
              <Button
                variant="ghost"
                className="hidden md:flex text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => window.scrollTo({ top: document.getElementById('features')?.offsetTop || 1200, behavior: 'smooth' })}
              >
                Features
              </Button>
              <Button
                variant="outline"
                className="text-sm md:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:opacity-90 transition-all duration-300 py-1.5 md:py-2 px-3 md:px-4 shadow-md hover:shadow-lg"
                onClick={() => window.scrollTo({ top: document.getElementById('subscribe')?.offsetTop || 2000, behavior: 'smooth' })}
              >
                Stay Updated
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
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

      {/* Enhanced Footer - Based on the Screenshot */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8 w-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-5">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Pharmacy Hub</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Connecting pharmacists, pharmacy managers, and proprietors for a better healthcare ecosystem.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <FooterSection 
              title="Services" 
              links={[
                { label: "Pharmacy Licensing", href: "#" },
                { label: "Professional Connections", href: "#" },
                { label: "Exam Preparation", href: "#" },
                { label: "Regulatory Compliance", href: "#" }
              ]} 
            />

            <FooterSection 
              title="Resources" 
              links={[
                { label: "Documentation", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Support", href: "#" },
                { label: "FAQs", href: "#" }
              ]} 
            />

            <div className="mb-8 md:mb-0">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                  <span className="text-gray-600">contact@pharmacyhub.com</span>
                </li>
                <li className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                  <span className="text-gray-600">+1 (123) 456-7890</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                  <span className="text-gray-600">123 Pharmacy Street, Health City</span>
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
