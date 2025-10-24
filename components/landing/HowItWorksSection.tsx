'use client';

import { Wallet, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

export function HowItWorksSection() {
  const router = useRouter();
  const { isConnected } = useAccount();

  const steps = [
    {
      number: 1,
      icon: Wallet,
      title: 'Connect',
      subtitle: 'Link your wallet in seconds',
      description:
        'Connect any compatible wallet - MetaMask, WalletConnect, or Coinbase Wallet. No sign-ups, no personal information required.',
      time: '< 30 seconds',
    },
    {
      number: 2,
      icon: Target,
      title: 'Choose',
      subtitle: 'Pick your asset and leverage',
      description:
        'Select from available trading pairs and choose your leverage multiplier from 1x to 3x. Set your position size and risk parameters.',
      time: '< 2 minutes',
    },
    {
      number: 3,
      icon: TrendingUp,
      title: 'Profit',
      subtitle: 'Amplify your gains, manage your risk',
      description:
        'Watch your amplified position in real-time. Add collateral, adjust leverage, or close positions anytime with built-in liquidation protection.',
      time: 'Ongoing',
    },
  ];

  return (
    <section id='how-it-works' className='py-20'>
      <div className='container mx-auto px-4 lg:px-16'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold mb-4'>
            Get Started in <span className='text-primary neon-text'>3 Simple Steps</span>
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            From wallet connection to your first leveraged trade in under 3 minutes. No complexity, no barriers.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={`step-${step.number}`} className='relative group cursor-pointer'>
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className='hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent transform translate-x-4 z-0' />
                )}

                <div className='bg-card border rounded-xl p-8 hover:shadow-lg transition-all duration-300 group-hover:neon-border group-hover:bg-primary/5 relative z-10'>
                  {/* Step Number */}
                  <div className='flex items-center justify-between mb-6'>
                    <div className='bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg group-hover:neon-glow-sm transition-all duration-300'>
                      {step.number}
                    </div>
                    <div className='text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full'>{step.time}</div>
                  </div>

                  {/* Icon */}
                  <div className='mb-6'>
                    <Icon className='size-12 text-primary group-hover:neon-text transition-all duration-300' />
                  </div>

                  {/* Content */}
                  <h3 className='text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300'>
                    {step.title}
                  </h3>
                  <h4 className='text-lg text-primary font-semibold mb-4'>{step.subtitle}</h4>
                  <p className='text-muted-foreground leading-relaxed'>{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Demo Placeholder */}
        <div className='bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-xl p-8 text-center neon-border'>
          <h3 className='text-2xl font-bold mb-4'>See It In Action</h3>
          <p className='text-muted-foreground mb-6 max-w-2xl mx-auto'>
            Experience the power of 3x leverage with our interactive trading simulator. See how your $1,000 could become
            $3,000 in buying power.
          </p>

          {/* Demo Preview */}
          <div className='bg-card/50 backdrop-blur border rounded-lg p-6 max-w-md mx-auto mb-6'>
            <div className='text-sm text-muted-foreground mb-2'>Position Preview</div>
            <div className='text-2xl font-bold text-primary neon-text mb-1'>$1,000 → $3,000</div>
            <div className='text-sm text-muted-foreground'>3x Leverage Applied</div>
          </div>

          <Button
            variant='default'
            size='lg'
            onClick={() => router.push(isConnected ? '/margin' : '/pools')}
            className='gap-2 neon-hover neon-glow-sm'
          >
            {isConnected ? 'Start Trading Now' : 'Try Interactive Demo'}
          </Button>
        </div>
      </div>
    </section>
  );
}
