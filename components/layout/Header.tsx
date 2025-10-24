'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@/components/shared/ConnectButton';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Menu, X, BarChart3, Coins, Droplets, Home, Info, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { NetworkWarning } from '@/components/shared/NetworkWarning';

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { isConnected } = useAccount();

  // Fix hydration mismatch by only using wallet state on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Navigation items - different sets for connected vs non-connected users
  // Default to non-connected state during SSR to prevent hydration mismatch
  const navItems =
    isClient && isConnected
      ? [
          {
            name: 'Dashboard',
            href: '/dashboard',
            icon: BarChart3,
            description: 'Your trading dashboard',
            requiresWallet: false,
          },
          {
            name: 'Trade',
            href: '/margin',
            icon: BarChart3,
            description: 'Margin trading with leverage',
            requiresWallet: true,
          },
          {
            name: 'Earn',
            href: '/pools',
            icon: Coins,
            description: 'Supply liquidity and earn yield',
            requiresWallet: true,
          },
          {
            name: 'Faucet',
            href: '/faucet',
            icon: Droplets,
            description: 'Get testnet tokens',
            requiresWallet: true,
          },
        ]
      : [
          {
            name: 'Home',
            href: '/',
            icon: Home,
            description: 'Welcome to LibreFi',
            requiresWallet: false,
          },
          {
            name: 'About',
            href: '#how-it-works',
            icon: Info,
            description: 'Learn how LibreFi works',
            requiresWallet: false,
          },
          {
            name: 'Docs',
            href: 'https://docs.librefi.app',
            icon: BookOpen,
            description: 'Platform documentation',
            requiresWallet: false,
            external: true,
          },
        ];

  const visibleNavItems = navItems.filter(item => !item.requiresWallet || (isClient && isConnected));

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  return (
    <>
      <nav className='sticky top-0 z-50 border-b bg-background/95 backdrop-blur-xl shadow-sm'>
        <div className='container mx-auto px-4 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            {/* Enhanced Logo */}
            <Link href={isClient && isConnected ? '/dashboard' : '/'} className='flex items-center gap-3 group'>
              <div className='relative h-9 w-9'>
                <Image
                  src='/librefi-logo.png'
                  alt='LibreFi Logo'
                  fill
                  className='object-contain group-hover:scale-105 transition-transform duration-200'
                  priority
                />
              </div>
              <span className='text-2xl font-bold text-primary tracking-tight'>LibreFi</span>
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center gap-1'>
              {visibleNavItems.map(item => {
                const Icon = item.icon;
                const isAnchor = item.href.startsWith('#');
                const isExternal = item.external;

                const handleClick = (e: React.MouseEvent) => {
                  if (isAnchor) {
                    e.preventDefault();
                    const element = document.querySelector(item.href);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  } else if (isExternal) {
                    e.preventDefault();
                    window.open(item.href, '_blank');
                  }
                };

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleClick}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      'hover:bg-primary/10 hover:text-primary group',
                      isActive(item.href) ? 'bg-primary/15 text-primary neon-border' : 'text-muted-foreground',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4 transition-all duration-200',
                        isActive(item.href) ? 'text-primary' : 'group-hover:text-primary',
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className='hidden md:flex items-center gap-3'>
              <ThemeToggle />
              <ConnectButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              className='md:hidden p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label='Toggle menu'
            >
              {isMobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </button>
          </div>

          {/* Enhanced Mobile Menu */}
          {isMobileMenuOpen && (
            <div className='md:hidden absolute top-16 left-0 right-0 bg-background/98 backdrop-blur-xl border-b shadow-lg'>
              <div className='container mx-auto px-4 py-4'>
                <div className='space-y-1'>
                  {visibleNavItems.map(item => {
                    const Icon = item.icon;
                    const isAnchor = item.href.startsWith('#');
                    const isExternal = item.external;

                    const handleClick = (e: React.MouseEvent) => {
                      setIsMobileMenuOpen(false);
                      if (isAnchor) {
                        e.preventDefault();
                        setTimeout(() => {
                          const element = document.querySelector(item.href);
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                      } else if (isExternal) {
                        e.preventDefault();
                        window.open(item.href, '_blank');
                      }
                    };

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                          'hover:bg-primary/10 hover:text-primary group',
                          isActive(item.href) ? 'bg-primary/15 text-primary neon-border' : 'text-muted-foreground',
                        )}
                        onClick={handleClick}
                      >
                        <Icon
                          className={cn(
                            'size-5 transition-all duration-200',
                            isActive(item.href) ? 'text-primary' : 'group-hover:text-primary',
                          )}
                        />
                        <div>
                          <div className='font-medium'>{item.name}</div>
                          <div className='text-xs text-muted-foreground'>{item.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Actions */}
                <div className='flex items-center justify-between pt-4 mt-4 border-t'>
                  <ThemeToggle />
                  <ConnectButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <NetworkWarning />
    </>
  );
}
