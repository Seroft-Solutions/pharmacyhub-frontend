'use client';

import React, {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import CarouselImage from "@/components/ui/Carousel_Image";
import FeatureCardSection from "@/components/Home/FeatureCardSelection";
import Footer from "@/components/Home/Footer";
import {Button} from "@/components/ui/button";
import {useAuthContext} from "@/providers/AuthContext";

const images = [
  {src: "/Images/med.jpg", alt: "Slide 1"},
  {src: "/Images/new.jpg", alt: "Slide 2", height: 400, width: 800},
  {src: "/api/placeholder/800/400", alt: "Slide 3", height: 400, width: 800},
  {src: "/api/placeholder/800/400", alt: "Slide 4"},
];

export default function Home() {
  const router = useRouter();
  const {isLoggedIn} = useAuthContext();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  return (
    <main>
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <img
              src="/Images/PharmacyHub.png"
              alt="Pharmacy Hub logo"
              className="h-10 w-10"
            />
            <span className="text-xl font-bold">Pharmacy Hub</span>
          </div>

          {/* Join Us Button - Visible on both mobile and desktop */}
          <Button
            variant="outline"
            className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white transform group-hover:scale-105 transition-all duration-300"
            onClick={() => router.push('/login')}
          >
            Join Us
          </Button>
        </div>
      </header>
      <CarouselImage images={images}/>
      <FeatureCardSection/>
      <Footer/>
    </main>
  );
}
