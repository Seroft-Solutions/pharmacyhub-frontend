import React from 'react';
import Image from 'next/image';
import { Card } from '@/shared/ui/card';

export const FeatureCardSection = () => {
  const features = [
    {
      icon: "/Images/pharmacist.png",
      title: "For Pharmacists",
      description: "Join our network of qualified pharmacists",
    },
    {
      icon: "/Images/pharmacist.png",
      title: "For Pharmacy Managers",
      description: "Manage your pharmacy efficiently",
    },
    {
      icon: "/Images/pharmacist.png",
      title: "For Proprietors",
      description: "Grow your pharmacy business",
    },
    {
      icon: "/Images/pharmacist.png",
      title: "For Salesmen",
      description: "Connect with pharmacies and boost your sales",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={64}
                  height={64}
                  className="w-16 h-16 mb-4"
                  priority
                />
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCardSection;