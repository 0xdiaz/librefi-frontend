'use client';

import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { ConnectButton } from '@/components/shared/ConnectButton';
import { Wallet, AlertCircle } from 'lucide-react';

interface WalletProtectedPageProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function WalletProtectedPage({
  children,
  title = 'Wallet Connection Required',
  description = 'Please connect your wallet to access this feature.',
}: WalletProtectedPageProps) {
  const { isConnected } = useAccount();
  const [isClient, setIsClient] = useState(false);

  // Client-side rendering detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading during hydration
  if (!isClient) {
    return (
      <main className='flex-1'>
        <div className='container mx-auto px-4 lg:px-8 py-8'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='animate-pulse'>
              <div className='h-8 bg-muted rounded w-48 mb-4'></div>
              <div className='h-4 bg-muted rounded w-64'></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show connect wallet prompt if not connected
  if (!isConnected) {
    return (
      <main className='flex-1'>
        <div className='container mx-auto px-4 lg:px-8 py-8'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='max-w-md mx-auto text-center space-y-6'>
              <div className='bg-card rounded-lg border p-8 shadow-sm'>
                <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Wallet className='w-8 h-8 text-primary' />
                </div>
                <h2 className='text-2xl font-bold mb-2'>{title}</h2>
                <p className='text-muted-foreground mb-6'>{description}</p>
                <div className='w-full'>
                  <ConnectButton />
                </div>

                <div className='mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg'>
                  <div className='flex items-start gap-3'>
                    <AlertCircle className='w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5' />
                    <div className='text-sm text-amber-800 dark:text-amber-200'>
                      <p className='font-medium mb-1'>Need a wallet?</p>
                      <p>We recommend using MetaMask, Coinbase Wallet, or WalletConnect to get started.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Render protected content if wallet is connected
  return <>{children}</>;
}
