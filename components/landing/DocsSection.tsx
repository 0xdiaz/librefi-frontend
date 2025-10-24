'use client';

import { BookOpen, ExternalLink, Shield, Code, Zap } from 'lucide-react';
import { Button } from '@/components/shared/Button';

export function DocsSection() {
  const handleOpenDocs = () => {
    window.open('https://docs.librefi.app', '_blank');
  };

  return (
    <section className='py-20 border-t'>
      <div className='container mx-auto px-4'>
        <div className='max-w-6xl mx-auto space-y-12'>
          <div className='text-center space-y-4'>
            <h2 className='text-3xl md:text-4xl font-bold'>Documentation & Resources</h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Everything you need to understand and use LibreFi safely and effectively.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-card border rounded-lg p-6 text-center space-y-4'>
              <Shield className='size-12 text-primary mx-auto' />
              <h3 className='text-xl font-semibold'>Security</h3>
              <p className='text-muted-foreground text-sm'>
                Learn about our smart contract audits, security measures, and best practices for safe trading.
              </p>
            </div>

            <div className='bg-card border rounded-lg p-6 text-center space-y-4'>
              <Code className='size-12 text-primary mx-auto' />
              <h3 className='text-xl font-semibold'>Technical Docs</h3>
              <p className='text-muted-foreground text-sm'>
                Smart contract interfaces, API documentation, and integration guides for developers.
              </p>
            </div>

            <div className='bg-card border rounded-lg p-6 text-center space-y-4'>
              <Zap className='size-12 text-primary mx-auto' />
              <h3 className='text-xl font-semibold'>Quick Start</h3>
              <p className='text-muted-foreground text-sm'>
                Step-by-step tutorials to get started with trading, lending, and earning on LibreFi.
              </p>
            </div>
          </div>

          <div className='text-center'>
            <Button variant='outline' size='lg' onClick={handleOpenDocs} className='gap-2 text-lg px-8 py-4 h-auto'>
              <BookOpen className='size-5' />
              View Full Documentation
              <ExternalLink className='size-4' />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
