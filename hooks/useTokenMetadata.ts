'use client';

import { Address } from 'viem';
import { TOKENS_INFO } from '@/lib/constants/addresses';

type TokenMetadata = {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
};

// Basic token metadata for Base Sepolia testnet
// TODO: Replace with dynamic loading from actual token contracts
const BASIC_TOKEN_METADATA: Record<string, TokenMetadata> = {
  ETH: {
    address: '0x0000000000000000000000000000000000000000' as Address,
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  // Load from constants
  ...Object.fromEntries(
    Object.values(TOKENS_INFO).map(token => [
      token.symbol,
      {
        address: token.address,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
      },
    ]),
  ),
};

export function useTokenMetadata() {
  // Return static data for now - this can be enhanced later
  // to fetch actual token metadata from contracts

  return {
    data: BASIC_TOKEN_METADATA,
    isLoading: false,
    isError: false,
    error: null,
    refreshCache: () => {}, // No-op for now
    getCacheState: () => ({ updatedAt: Date.now(), isStale: false }),
  };
}
