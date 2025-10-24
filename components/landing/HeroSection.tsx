'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [isClient, setIsClient] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGetStarted = () => {
    if (isClient && isConnected) {
      router.push('/dashboard');
    } else {
      router.push('/pools');
    }
  };

  return (
    <section className='relative min-h-screen flex items-center justify-center'>
      <div className='container mx-auto px-4 text-center'>
        <div className='max-w-5xl mx-auto space-y-12'>
          {/* Main Message */}
          <div className='space-y-6'>
            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight'>Welcome to LibreFi</h1>
            <h2 className='text-3xl md:text-4xl font-bold text-primary neon-text'>Permissionless Margin Trading</h2>
            <p className='text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
              Connect your wallet and start trading with leverage instantly. No KYC, no geographic restrictions, no
              approval needed.
            </p>
          </div>

          {/* Key Features */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 py-8'>
            <div className='space-y-3'>
              <Shield className='size-8 text-primary mx-auto' />
              <h3 className='font-semibold'>No KYC Required</h3>
              <p className='text-sm text-muted-foreground'>Trade with just your wallet connection</p>
            </div>
            <div className='space-y-3'>
              <Zap className='size-8 text-primary mx-auto' />
              <h3 className='font-semibold'>Instant Settlement</h3>
              <p className='text-sm text-muted-foreground'>Smart contracts on Base network</p>
            </div>
            <div className='space-y-3'>
              <TrendingUp className='size-8 text-primary mx-auto' />
              <h3 className='font-semibold'>Any Asset</h3>
              <p className='text-sm text-muted-foreground'>Trade meme coins, DeFi tokens & more</p>
            </div>
          </div>

          {/* CTA */}
          <div className='space-y-6'>
            <Button
              variant='default'
              size='lg'
              onClick={handleGetStarted}
              className='gap-2 neon-hover neon-glow text-xl px-12 py-6 h-auto'
            >
              {isClient && isConnected ? 'Go to Dashboard' : 'Start Trading Now'}
              <ArrowRight className='size-6' />
            </Button>

            {/* Trust Signals */}
            <div className='space-y-2'>
              <div className='text-sm text-muted-foreground'>Deployed on Base Sepolia Testnet</div>
              <div className='flex justify-center items-center gap-8 text-sm'>
                <div>
                  <span className='text-primary font-semibold'>$2.4M+</span> TVL
                </div>
                <div>
                  <span className='text-primary font-semibold'>150+</span> Active Positions
                </div>
                <div>
                  <span className='text-primary font-semibold'>$890K</span> 24h Volume
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
