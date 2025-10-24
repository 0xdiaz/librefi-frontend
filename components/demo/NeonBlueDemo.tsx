'use client';

import { Button } from '@/components/shared/Button';
import { Zap, Sparkles, Lightbulb, Rocket } from 'lucide-react';

export function NeonBlueDemo() {
  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show demo in production
  }

  return (
    <div className='container mx-auto px-4 py-8 space-y-8'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold mb-4'>
          <span className='text-primary neon-text'>Neon Blue</span> Theme Demo
        </h1>
        <p className='text-muted-foreground'>Showcasing the electric blue (#04D9FF) cyberpunk aesthetic</p>
      </div>

      {/* Button Variations */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-primary'>Button Effects</h3>
          <Button className='w-full neon-glow-sm neon-hover'>
            <Zap className='size-4 mr-2' />
            Neon Glow
          </Button>
          <Button variant='outline' className='w-full neon-border'>
            <Sparkles className='size-4 mr-2' />
            Neon Border
          </Button>
          <Button variant='ghost' className='w-full neon-pulse'>
            <Lightbulb className='size-4 mr-2' />
            Neon Pulse
          </Button>
        </div>

        {/* Card Variations */}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-primary'>Card Effects</h3>
          <div className='p-4 bg-card border rounded-lg neon-hover neon-border'>
            <h4 className='font-medium text-primary neon-text'>Glowing Card</h4>
            <p className='text-sm text-muted-foreground'>Hover to see the effect</p>
          </div>
          <div className='p-4 bg-primary/10 border rounded-lg neon-glow-sm'>
            <h4 className='font-medium text-primary'>Static Glow</h4>
            <p className='text-sm text-muted-foreground'>Always glowing</p>
          </div>
        </div>

        {/* Text Effects */}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-primary'>Text Effects</h3>
          <div className='space-y-2'>
            <p className='text-primary neon-text'>Neon Text Shadow</p>
            <p className='text-lg font-bold text-primary'>Electric Blue</p>
            <p className='text-sm text-neon-secondary'>Secondary Neon</p>
            <p className='text-sm text-neon-accent'>Accent Neon</p>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-primary'>Interactive</h3>
          <div className='p-4 bg-card border rounded-lg group cursor-pointer neon-hover'>
            <div className='flex items-center gap-2 mb-2'>
              <Rocket className='size-5 text-primary group-hover:neon-text transition-all duration-300' />
              <h4 className='font-medium text-primary group-hover:neon-text transition-all duration-300'>Hover Me</h4>
            </div>
            <p className='text-sm text-muted-foreground'>Watch the neon effects activate</p>
          </div>
        </div>
      </div>

      {/* Gradient Demo */}
      <div className='mt-12'>
        <h3 className='text-lg font-semibold text-primary mb-4'>Neon Gradients</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='h-24 rounded-lg neon-gradient flex items-center justify-center'>
            <span className='text-white font-semibold'>Primary Gradient</span>
          </div>
          <div className='h-24 rounded-lg bg-gradient-to-r from-neon-primary to-neon-secondary flex items-center justify-center'>
            <span className='text-white font-semibold'>Blue to Cyan</span>
          </div>
          <div className='h-24 rounded-lg bg-gradient-to-r from-neon-secondary to-neon-accent flex items-center justify-center'>
            <span className='text-white font-semibold'>Cyan to Teal</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='mt-12'>
        <h3 className='text-lg font-semibold text-primary mb-4'>Stats with Neon Effects</h3>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {[
            { label: 'Total Value', value: '$2.4M', change: '+12.5%' },
            { label: 'Active Users', value: '8,432', change: '+8.2%' },
            { label: 'Transactions', value: '156k', change: '+24.1%' },
            { label: 'Volume', value: '$890k', change: '+15.7%' },
          ].map((stat, index) => (
            <div
              key={`demo-stat-${stat.label}-${index}`}
              className='bg-primary/10 border rounded-lg p-6 cursor-pointer neon-hover neon-border group'
            >
              <div className='flex justify-between items-start'>
                <div>
                  <p className='text-sm text-muted-foreground'>{stat.label}</p>
                  <p className='text-2xl font-bold mt-1 group-hover:neon-text transition-all duration-300'>
                    {stat.value}
                  </p>
                  <p className='text-xs text-primary mt-1'>{stat.change}</p>
                </div>
                <div className='p-2 bg-primary/20 rounded-md'>
                  <Zap className='size-4 text-primary' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='text-center text-sm text-muted-foreground mt-12'>
        This demo component only appears in development mode
      </div>
    </div>
  );
}
