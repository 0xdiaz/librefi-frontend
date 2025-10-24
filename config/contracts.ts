import { lendingPoolABI } from '@/lib/abis/lendingPool';
import { lendingPoolFactoryABI } from '@/lib/abis/lendingPoolFactory';
import { positionABI } from '@/lib/abis/position';
import { positionFactoryABI } from '@/lib/abis/positionFactory';
import { baseSepolia } from '@/lib/chains';
import { env } from '@/lib/env';

// Contract addresses from environment variables
export const contractAddresses = {
  [baseSepolia.id]: {
    LendingPoolFactory: env.LENDING_POOL_FACTORY_ADDRESS,
    PositionFactory: env.POSITION_FACTORY_ADDRESS,
    Vault: env.VAULT_ADDRESS,
    MockUniswapRouter: env.MOCK_UNISWAP_ROUTER_ADDRESS,
    MockFactory: env.MOCK_FACTORY_ADDRESS,
  },
} as const;

export const CONTRACTS = {
  LENDING_POOL_FACTORY: {
    address: contractAddresses[baseSepolia.id].LendingPoolFactory,
    abi: lendingPoolFactoryABI,
  },
  POSITION_FACTORY: {
    address: contractAddresses[baseSepolia.id].PositionFactory,
    abi: positionFactoryABI,
  },
  LENDING_POOL: {
    abi: lendingPoolABI,
  },
  POSITION: {
    abi: positionABI,
  },
  VAULT: {
    address: contractAddresses[baseSepolia.id].Vault,
  },
  MOCK_UNISWAP_ROUTER: {
    address: contractAddresses[baseSepolia.id].MockUniswapRouter,
  },
} as const;

// Types are now in @/types - import them there
// Re-export commonly used types for backward compatibility
export type { CreateLendingPoolParams, PoolDetails, PositionType } from '@/types';
