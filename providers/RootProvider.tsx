'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from '@/config/wagmi';
import { ReactNode, useState, useEffect } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { Web3ErrorBoundary } from '@/components/shared/Web3ErrorBoundary';
import { ClientOnly } from '@/components/shared/ClientOnly';
import { initWalletProtection } from '@/lib/wallet-protection';

function Web3Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 30_000,
          },
        },
      }),
  );

  // Initialize wallet protection on mount
  useEffect(() => {
    initWalletProtection();
  }, []);

  return (
    <Web3ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider modalSize='compact'>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Web3ErrorBoundary>
  );
}

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme='system' storageKey='librefi-ui-theme'>
      <ClientOnly>
        <Web3Providers>{children}</Web3Providers>
      </ClientOnly>
    </ThemeProvider>
  );
}
