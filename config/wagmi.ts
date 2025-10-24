import { baseSepolia } from '@/lib/chains';
import { env } from '@/lib/env';
import type { Config } from 'wagmi';

// Create wagmi config only on client side to avoid SSR issues
async function createWagmiConfig() {
  if (typeof window === 'undefined') return null;

  try {
    const { createConfig, http } = await import('wagmi');
    const { injected, walletConnect } = await import('wagmi/connectors');

    return createConfig({
      chains: [baseSepolia],
      transports: {
        [baseSepolia.id]: http(),
      },
      connectors: [
        injected(),
        walletConnect({
          projectId: env.WALLETCONNECT_PROJECT_ID,
          metadata: {
            name: 'LibreFi',
            description: 'Permissionless margin trading platform',
            url: 'https://librefi.app',
            icons: ['/librefi-logo.png'],
          },
        }),
      ],
    });
  } catch (error) {
    console.warn('Failed to load wagmi:', error);
    return null;
  }
}

// Export config promise for client-side use
export const getConfig = (): Promise<Config | null> => createWagmiConfig();

// For backward compatibility, export a synchronous config that returns null on server
export const config: Config | null = null;
