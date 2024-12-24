import React from "react";
import Link from "next/link"; // Import Next.js Link for routing
import { Button } from "@/components/ui/button"; // Shadcn button component

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
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c0 4.418-3.582 8-8 8M16 16a4 4 0 100-8m-4-4h0m4 0a4 4 0 110 8h0"
          />
        </svg>
    ),
    title: "Pharma Team",
    description:
        "Company was founded by scientists dedicated to create new therapeutics.",
    buttonText: "OUR TEAM",
    buttonHref: "/team",
  },
  {
    icon: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m-4 4h.01M6 8h.01M9 16h.01M17 8h.01M4 6h16m-2 2h.01M6 6h.01"
          />
        </svg>
    ),
    title: "Pharma Focus",
    description:
        "We Interrogate the inner life of GPCR signaling to develop newest therapeutics.",
    buttonText: "DISCOVER NOW",
    buttonHref: "/focus",
  },
  {
    icon: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h.01M6 10h.01M9 10h.01m6 4h.01M14 14h.01M9 14h.01m-4-4h.01"
          />
        </svg>
    ),
    title: "Pharma Pipeline",
    description:
        "Consetetur sadipscing elitr sediam nonumy eirmod tempor invidunt labore magna.",
    buttonText: "CHECK IT",
    buttonHref: "/pipeline",
  },
];

const FeatureCardSection: React.FC = () => {
  return (
      <section className="text-center py-16 bg-white">
        <h1 className="text-3xl font-semibold mb-4">Welcome to Our Site!</h1>
        <p className="text-gray-600 mb-8">
          We are a biopharmaceutical company focused on the discovery, development
          and commercialization of innovative therapies intended to improve
          outcomes in patients sufferings.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 max-w-screen-lg mx-auto">
          {features.map((feature, index) => (
              <div
                  key={index}
                  className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h2 className="text-xl font-medium text-gray-800 mb-2">
                  {feature.title}
                </h2>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link href={feature.buttonHref} passHref>
                  <Button
                      variant="outline"
                      className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                  >
                    {feature.buttonText}
                  </Button>
                </Link>
              </div>
          ))}
        </div>
      </section>
  );
};

export default FeatureCardSection;
