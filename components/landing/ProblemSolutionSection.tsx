'use client';

import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export function ProblemSolutionSection() {
  const problems = [
    'Lengthy KYC verification processes',
    'Geographic restrictions and compliance barriers',
    'Limited asset selection on traditional platforms',
    'High minimum deposits and account requirements',
    'Centralized custody of your funds',
  ];

  const solutions = [
    { title: 'No KYC Required', description: 'Trade with just your wallet connection' },
    { title: 'Global Access', description: 'Available worldwide, no geo-blocking' },
    { title: 'Any Asset', description: 'Trade meme coins, DeFi tokens, and more' },
    { title: 'Instant Settlement', description: 'Powered by smart contracts on Base' },
    { title: 'Self-Custody', description: 'You control your funds at all times' },
  ];

  return (
    <section className='py-20 bg-muted/30'>
      <div className='container mx-auto px-4 lg:px-16'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold mb-4'>
            Why Traditional Margin Trading <span className='text-destructive'>Doesn&apos;t Work</span>
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Traditional platforms create unnecessary barriers between you and profitable trading opportunities.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          {/* Problems */}
          <div className='space-y-6'>
            <h3 className='text-2xl font-bold text-destructive mb-6'>The Traditional Way</h3>
            {problems.map((problem, index) => (
              <div key={`problem-${index}`} className='flex items-start gap-3'>
                <XCircle className='size-6 text-destructive flex-shrink-0 mt-0.5' />
                <p className='text-muted-foreground'>{problem}</p>
              </div>
            ))}
          </div>

          {/* Arrow Transition */}
          <div className='hidden lg:flex justify-center'>
            <div className='flex flex-col items-center'>
              <ArrowRight className='size-12 text-primary neon-text' />
              <p className='text-sm text-primary font-semibold mt-2'>LibreFi Solution</p>
            </div>
          </div>

          {/* Solutions */}
          <div className='space-y-6 lg:col-start-2'>
            <h3 className='text-2xl font-bold text-primary mb-6 neon-text'>The LibreFi Way</h3>
            {solutions.map(solution => (
              <div key={`solution-${solution.title}`} className='flex items-start gap-3 group'>
                <CheckCircle className='size-6 text-primary flex-shrink-0 mt-0.5 group-hover:neon-text transition-all duration-300' />
                <div>
                  <h4 className='font-semibold text-foreground group-hover:text-primary transition-colors duration-300'>
                    {solution.title}
                  </h4>
                  <p className='text-muted-foreground text-sm'>{solution.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className='text-center mt-16'>
          <div className='bg-primary/10 border border-primary/20 rounded-lg p-8 max-w-2xl mx-auto neon-border'>
            <h3 className='text-2xl font-bold mb-4'>Ready to Break Free?</h3>
            <p className='text-muted-foreground mb-6'>
              Join thousands of traders who&apos;ve discovered the power of permissionless margin trading.
            </p>
            <div className='text-4xl font-bold text-primary neon-text mb-2'>No barriers.</div>
            <div className='text-4xl font-bold text-primary neon-text mb-2'>No limits.</div>
            <div className='text-4xl font-bold text-primary neon-text'>Just pure trading freedom.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
