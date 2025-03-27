'use client';

import React from 'react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-colors duration-300 group">
    <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
      <Icon className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
    </div>
    <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);
