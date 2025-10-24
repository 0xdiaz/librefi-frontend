'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { ArrowRight, Wallet, DollarSign, BarChart3, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

export function SimpleHowItWorks() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [isClient, setIsClient] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section id='how-it-works' className='py-20 bg-muted/20'>
      <div className='container mx-auto px-4'>
        <div className='max-w-6xl mx-auto space-y-16'>
          {/* How It Works */}
          <div className='text-center space-y-12'>
            <h2 className='text-4xl md:text-5xl font-bold'>How It Works</h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='space-y-4 p-6'>
                <div className='text-6xl font-bold text-primary neon-text'>01</div>
                <Wallet className='size-8 text-primary mx-auto' />
                <h3 className='text-xl font-semibold'>Connect Wallet</h3>
                <p className='text-muted-foreground'>MetaMask, WalletConnect, or any Web3 wallet. Takes 30 seconds.</p>
              </div>

              <div className='space-y-4 p-6'>
                <div className='text-6xl font-bold text-primary neon-text'>02</div>
                <DollarSign className='size-8 text-primary mx-auto' />
                <h3 className='text-xl font-semibold'>Choose Position</h3>
                <p className='text-muted-foreground'>
                  Select your asset, leverage (1x-3x), and position size. Supply or borrow from lending pools.
                </p>
              </div>

              <div className='space-y-4 p-6'>
                <div className='text-6xl font-bold text-primary neon-text'>03</div>
                <BarChart3 className='size-8 text-primary mx-auto' />
                <h3 className='text-xl font-semibold'>Trade & Manage</h3>
                <p className='text-muted-foreground'>
                  Monitor positions, add collateral, or close anytime. Built-in liquidation protection.
                </p>
              </div>
            </div>
          </div>

          {/* What You Can Do */}
          <div className='text-center space-y-8'>
            <h3 className='text-2xl font-bold'>What You Can Do</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
              <div className='bg-card border rounded-lg p-6 text-left'>
                <h4 className='text-lg font-semibold mb-3 text-primary'>For Traders</h4>
                <ul className='space-y-2 text-sm text-muted-foreground'>
                  <li>• Open leveraged positions up to 3x</li>
                  <li>• Trade any supported crypto asset</li>
                  <li>• Manage risk with liquidation protection</li>
                  <li>• No minimum deposit requirements</li>
                </ul>
              </div>
              <div className='bg-card border rounded-lg p-6 text-left'>
                <h4 className='text-lg font-semibold mb-3 text-primary'>For Liquidity Providers</h4>
                <ul className='space-y-2 text-sm text-muted-foreground'>
                  <li>• Supply assets to earn passive yield</li>
                  <li>• Competitive APY on multiple tokens</li>
                  <li>• Withdraw anytime, no lock periods</li>
                  <li>• Create custom lending pools</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Risk Disclaimer */}
          <div className='bg-primary/10 border border-primary/20 rounded-lg p-6 max-w-4xl mx-auto'>
            <div className='flex items-start gap-3'>
              <AlertCircle className='size-5 text-primary flex-shrink-0 mt-1' />
              <div className='text-sm'>
                <p className='font-semibold mb-2'>Important Risk Information</p>
                <p className='text-muted-foreground leading-relaxed'>
                  Margin trading involves significant risk and may not be suitable for all investors. Leverage amplifies
                  both profits and losses. You can lose more than your initial investment. Only trade with funds you can
                  afford to lose.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className='text-center space-y-4'>
            <Button
              variant='default'
              size='lg'
              onClick={() => router.push(isClient && isConnected ? '/dashboard' : '/pools')}
              className='gap-2 neon-hover neon-glow text-lg px-10 py-5 h-auto'
            >
              {isClient && isConnected ? 'Go to Dashboard' : 'Start Trading'}
              <ArrowRight className='size-5' />
            </Button>
            <p className='text-sm text-muted-foreground'>Ready in under 2 minutes • No registration required</p>
          </div>
        </div>
      </div>
    </section>
  );
}
