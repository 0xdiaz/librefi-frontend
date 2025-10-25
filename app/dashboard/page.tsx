'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ArrowRight } from 'lucide-react';
import { useSafeAccount } from '@/hooks/useSafeWagmi';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { isConnected } = useSafeAccount();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by waiting for client-side mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect non-connected users to landing page
  useEffect(() => {
    if (isMounted && !isConnected) {
      router.push('/');
    }
  }, [isMounted, isConnected, router]);

  if (!isMounted) {
    return (
      <main className='flex-1'>
        <div className='container mx-auto px-4 lg:px-16 py-16'>
          {/* Loading skeleton while mounting */}
          <div className='space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {[...Array(4)].map((_, i) => (
                <div key={`skeleton-${i}`} className='bg-card rounded-lg border p-6 animate-pulse'>
                  <div className='h-4 bg-muted rounded w-3/4 mb-2'></div>
                  <div className='h-8 bg-muted rounded w-1/2 mb-2'></div>
                  <div className='h-3 bg-muted rounded w-2/3'></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!isConnected) {
    return null; // Will redirect to landing page
  }

  return (
    <main className='flex-1'>
      <div className='container mx-auto px-4 lg:px-16 py-16'>
        {/* Welcome Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold mb-4'>
            Welcome to Your <span className='text-primary neon-text'>LibreFi</span> Dashboard
          </h1>
          <p className='text-lg text-muted-foreground mb-8 max-w-2xl mx-auto'>
            Manage your positions, track your performance, and explore new trading opportunities.
          </p>

          <div className='flex justify-center gap-4'>
            <Button
              variant='default'
              size='lg'
              onClick={() => router.push('/margin')}
              className='gap-2 neon-hover neon-glow-sm'
            >
              Start Trading
              <ArrowRight className='size-4' />
            </Button>
            <Button
              variant='outline'
              size='lg'
              onClick={() => router.push('/pools')}
              className='gap-2 neon-border hover:neon-glow-sm transition-all duration-300'
            >
              View Pools
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <Dashboard />
      </div>
    </main>
  );
}
