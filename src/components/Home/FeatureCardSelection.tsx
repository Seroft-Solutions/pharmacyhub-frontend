import React from "react";
import Link from "next/link"; // Import Next.js Link for routing
import { Button } from "@/components/ui/button";
import {ChartNoAxesCombined, ClipboardList, ClipboardPen, Megaphone} from "lucide-react"; // Shadcn button component

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

const features: FeatureCard[] = [
  {
    icon: (
        <Megaphone height={50} width={50} color={"green"}/>
    ),
    title: "Pharmacy Promotion Service",
    description:
        "Company was founded by scientists dedicated to create new therapeutics.",
    buttonText: "DISCOVER NOW",
    buttonHref: "/team",
  },
  {
    icon: (
        <ChartNoAxesCombined height={50} width={50}/>
    ),
    title: "Pharmacy Development Cost",
    description:
        "We Interrogate the inner life of GPCR signaling to develop newest therapeutics.",
    buttonText: "DISCOVER NOW",
    buttonHref: "/focus",
  },
  {
    icon: (
        <ClipboardList height={50} width={50}/>
    ),
    title: "Experience Verification",
    description:
        "Consetetur sadipscing elitr sediam nonumy eirmod tempor invidunt labore magna.",
    buttonText: "DISCOVER NOW",
    buttonHref: "/pipeline",
  },
  {
    icon: (
        <ClipboardPen height={50} width={50}/>

    ),
    title: "Pharmacy Licencing Services",
    description:
        "Consetetur sadipscing elitr sediam nonumy eirmod tempor invidunt labore magna.",
    buttonText: "DISCOVER NOW",
    buttonHref: "/pipeline",
  },

];

const FeatureCardSection: React.FC = () => {
  return (
      <section className="text-center py-16 bg-white">
        <h1 className="text-3xl font-semibold mb-4">Welcome to Pharmacy Hub!</h1>
        <p className="text-gray-600 mb-8">
          Pharmacy Hub is a comprehensive platform offering a wide range of services related to the retail pharmacy sector.
          Its mission is to support proprietors, pharmacists, sales staff, and individuals aspiring to establish their own pharmacies.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4 max-w-screen-lg mx-auto">
          {features.map((feature, index) => (
              <div
                  key={index}
                  className="group p-6 border rounded-lg bg-white transition-all duration-300 ease-in-out
                             hover:shadow-xl hover:-translate-y-2 hover:border-red-500
                             relative overflow-hidden cursor-pointer"
              >
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with animation */}
                  <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <div className="group-hover:text-red-500 transition-colors duration-300">
                      {feature.icon}
                    </div>
                  </div>
        
                  {/* Title with animation */}
                  <h2 className="text-xl font-medium text-gray-800 mb-2 group-hover:text-red-500 transition-colors duration-300">
                    {feature.title}
                  </h2>
        
                  {/* Description */}
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
        
                  {/* Button with hover effect */}
                  <Link href={feature.buttonHref} passHref>
                    <Button
                        variant="outline"
                        className="text-red-500 border-red-500
                                   hover:bg-red-500 hover:text-white
                                   transform group-hover:scale-105
                                   transition-all duration-300"
                    >
                      {feature.buttonText}
                    </Button>
                  </Link>
                </div>
              </div>
          ))}
        </div>
      </section>
  );
};

export default FeatureCardSection;
