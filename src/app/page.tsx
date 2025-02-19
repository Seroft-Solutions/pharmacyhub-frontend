'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CarouselImage from "@/shared/ui/Carousel_Image";
import { FeatureCardSection } from "@/features/home/ui/FeatureCardSection";
import { Footer } from "@/features/home/ui/Footer";
import { useAuthContext } from '@/shared/lib/providers/AuthContext';
import { Button } from "@/shared/ui/button";

const images = [
  {
    src: "/Images/med.jpg",
    alt: "Slide 1"
  },
  {
    src: "/Images/new.jpg",
    alt: "Slide 2",
    height: 400,
    width: 800
  },
  {
    src: "/api/placeholder/800/400",
    alt: "Slide 3",
    height: 400,
    width: 800
  },
  {
    src: "/api/placeholder/800/400",
    alt: "Slide 4"
  },
];

export default function Home() {
  const router = useRouter();
  const { isLoggedIn } = useAuthContext();

  useEffect(() => {
    if (isLoggedIn) {
      // Using App Router navigation
      router.replace(`/dashboard`);
    }
  }, [isLoggedIn, router]);

  return (
    <main>
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <Image
              src="/Images/PharmacyHub.png"
              alt="Pharmacy Hub logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-xl font-bold">Pharmacy Hub</span>
          </div>

          {/* Join Us Button - Using shadcn Button component */}
          <Button
            variant="outline"
            className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white transform group-hover:scale-105 transition-all duration-300"
            onClick={() => router.replace(`/login`)}
          >
            Join Us
          </Button>
        </div>
      </header>
      <CarouselImage images={images} />
      <FeatureCardSection />
      <Footer />
    </main>
  );
}
