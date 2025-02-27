import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Users, Building2, Store, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const FeatureCardSection = () => {
  const features = [
    {
      icon: "/Images/pharmacist.png",
      title: "For Pharmacists",
      description: "Join our network of qualified pharmacists",
      iconComponent: <UserCircle className="w-10 h-10 text-blue-500" />,
      color: "from-blue-500 to-blue-600",
      delay: 0.1
    },
    {
      icon: "/Images/pharmacist.png",
      title: "For Pharmacy Managers",
      description: "Manage your pharmacy efficiently",
      iconComponent: <Users className="w-10 h-10 text-indigo-500" />,
      color: "from-indigo-500 to-indigo-600",
      delay: 0.2
    },
    {
      icon: "/Images/pharmacist.png",
      title: "For Proprietors",
      description: "Grow your pharmacy business",
      iconComponent: <Building2 className="w-10 h-10 text-purple-500" />,
      color: "from-purple-500 to-purple-600",
      delay: 0.3
    },
    {
      icon: "/Images/pharmacist.png",
      title: "For Salesmen",
      description: "Connect with pharmacies and boost your sales",
      iconComponent: <Store className="w-10 h-10 text-rose-500" />,
      color: "from-rose-500 to-rose-600",
      delay: 0.4
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
  
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Join Our Growing Network
          </h2>
          <p className="text-gray-600 text-lg">
            Connect with pharmacies, managers, and professionals across the industry
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: feature.delay, duration: 0.5 }}
            >
              <Card className="relative p-6 overflow-hidden group hover:shadow-xl transition-all duration-300 border-none bg-white/90 backdrop-blur-sm">
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${feature.color}`} />
                <div className="flex flex-col items-center text-center relative space-y-4">
                  <div className="p-3 rounded-full bg-gray-50 group-hover:scale-110 transition-transform duration-300">
                    {feature.iconComponent}
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors group"
                  >
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCardSection;