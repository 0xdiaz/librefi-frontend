'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { HeroSection } from '@/components/landing/HeroSection';
import { SimpleHowItWorks } from '@/components/landing/SimpleHowItWorks';
import { DocsSection } from '@/components/landing/DocsSection';
import { ClientOnly } from '@/components/shared/ClientOnly';

function LandingPageContent() {
  const router = useRouter();
  const { isConnected } = useAccount();

  // Redirect connected users to dashboard
  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  return (
    <main className='flex-1'>
      <HeroSection />
      <SimpleHowItWorks />
      <DocsSection />
    </main>
  );
}

export default function LandingPage() {
  return (
    <ClientOnly
      fallback={
        <main className='flex-1'>
          <HeroSection />
          <SimpleHowItWorks />
          <DocsSection />
        </main>
      }
    >
      <LandingPageContent />
    </ClientOnly>
  );
}
