'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/auth';
import {
  Header,
  HeroSection,
  AboutSection,
  GetStartedSection,
  Footer
} from '@/features/home/components';

interface Router {
  replace: (path: string) => void;
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Header />
      <HeroSection />
      <AboutSection />
      <GetStartedSection />
      <Footer />
    </main>
  );
}
