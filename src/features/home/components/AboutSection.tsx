'use client';

import { FeatureCard } from './FeatureCard';
import {
  Sparkles, BellRing, CalendarDays,
  CheckCircle, Link2, FileText,
} from 'lucide-react';

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-white relative">
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
            students, and educators. We've created an integrated ecosystem that seamlessly connects
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
  );
};
