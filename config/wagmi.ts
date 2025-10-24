import { baseSepolia } from '@/lib/chains';
import { createConfig, http } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { env } from '@/lib/env';

export const config = createConfig({
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
