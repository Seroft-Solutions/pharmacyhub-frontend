'use client';

import React from 'react';
import { Pill } from 'lucide-react';

interface ModernMinimalistLogoProps {
  size?: "small" | "default" | "large";
  animate?: boolean;
}

const ModernMinimalistLogo: React.FC<ModernMinimalistLogoProps> = ({ 
  size = "default",
  animate = true
}) => {
  // Size classes based on parameter and responsive considerations
  const sizeClasses = {
    small: {
      container: "h-7 md:h-8",
      iconBox: "h-7 w-7 md:h-8 md:w-8",
      icon: "w-3.5 h-3.5 md:w-4 md:h-4",
      text: "text-base md:text-lg"
    },
    default: {
      container: "h-8 md:h-10",
      iconBox: "h-8 w-8 md:h-10 md:w-10",
      icon: "w-5 h-5 md:w-6 md:h-6",
      text: "text-lg md:text-xl"
    },
    large: {
      container: "h-10 md:h-12",
      iconBox: "h-10 w-10 md:h-12 md:w-12",
      icon: "w-6 h-6 md:w-7 md:h-7",
      text: "text-xl md:text-2xl"
    }
  };
  
  const selectedSize = sizeClasses[size];
  
  return (
    <div className={`flex items-center space-x-2 ${selectedSize.container}`}>
      <div className={`relative ${selectedSize.iconBox} flex items-center justify-center`}>
        {/* Background square with rotation */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg transform ${animate ? 'animate-rotate-slow' : 'rotate-45'}`}
        />
        
        {/* Counter-rotated pill icon */}
        <Pill 
          className={`relative ${selectedSize.icon} text-white transform ${animate ? 'animate-counter-rotate-slow' : '-rotate-45'}`} 
        />
      </div>
      
      {/* Text logo */}
      <span className={`font-sans ${selectedSize.text} font-bold text-gray-800`}>
        Pharmacy<span className="text-blue-600">Hub</span>
      </span>
      
      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes rotate-slow {
          0% { transform: rotate(45deg); }
          100% { transform: rotate(405deg); }
        }
        @keyframes counter-rotate-slow {
          0% { transform: rotate(-45deg); }
          100% { transform: rotate(-405deg); }
        }
        .animate-rotate-slow {
          animation: rotate-slow 12s linear infinite;
        }
        .animate-counter-rotate-slow {
          animation: counter-rotate-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ModernMinimalistLogo;