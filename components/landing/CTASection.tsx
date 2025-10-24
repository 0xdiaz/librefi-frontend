'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { ArrowRight, Zap, Users, TrendingUp } from 'lucide-react';
import { useAccount } from 'wagmi';

export function CTASection() {
  const router = useRouter();
  const { isConnected } = useAccount();

  const handlePrimaryAction = () => {
    if (isConnected) {
      router.push('/dashboard');
    } else {
      router.push('/pools');
    }
  };

  const handleSecondaryAction = () => {
    router.push('/pools');
  };

  return (
    <section className='py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent'>
      <div className='container mx-auto px-4 lg:px-16'>
        <div className='max-w-4xl mx-auto text-center'>
          {/* Main CTA */}
          <div className='mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6'>
              Ready to <span className='text-primary neon-text'>Amplify</span> Your Crypto Trading?
            </h2>
            <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
              Join the revolution of permissionless margin trading. No barriers, no limits, just pure trading freedom.
            </p>
          </div>

          {/* Trust Signals */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
            <div className='flex items-center justify-center gap-3 text-muted-foreground'>
              <Users className='size-5 text-primary' />
              <span>Join 500+ traders earning amplified returns</span>
            </div>
            <div className='flex items-center justify-center gap-3 text-muted-foreground'>
              <Zap className='size-5 text-primary' />
              <span>Instant access, no waiting periods</span>
            </div>
            <div className='flex items-center justify-center gap-3 text-muted-foreground'>
              <TrendingUp className='size-5 text-primary' />
              <span>Up to 3x leverage on any position</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row justify-center gap-4 mb-12'>
            <Button
              variant='default'
              size='lg'
              onClick={handlePrimaryAction}
              className='gap-2 neon-hover neon-glow text-lg px-8 py-4 h-auto'
            >
              {isConnected ? 'Go to Dashboard' : 'Connect Wallet & Start Trading'}
              <ArrowRight className='size-5' />
            </Button>
            <Button
              variant='outline'
              size='lg'
              onClick={handleSecondaryAction}
              className='gap-2 neon-border hover:neon-glow-sm transition-all duration-300 text-lg px-8 py-4 h-auto'
            >
              View Live Pools
            </Button>
          </div>

          {/* Final Trust Signal */}
          <div className='bg-card/50 backdrop-blur border rounded-xl p-6 max-w-2xl mx-auto neon-border'>
            <div className='text-sm text-muted-foreground mb-2'>Live Platform Stats</div>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <div className='text-2xl font-bold text-primary neon-text'>$2.4M+</div>
                <div className='text-xs text-muted-foreground'>Total Value Locked</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-primary neon-text'>150+</div>
                <div className='text-xs text-muted-foreground'>Active Positions</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-primary neon-text'>24/7</div>
                <div className='text-xs text-muted-foreground'>Available Trading</div>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <p className='text-sm text-muted-foreground mt-8'>
            Start trading with leverage in under 30 seconds. No registration required.
          </p>
        </div>
      </div>
    </section>
  );
}
