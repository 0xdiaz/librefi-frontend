import { Address, isAddress } from 'viem';

interface EnvironmentConfig {
  WALLETCONNECT_PROJECT_ID: string;
  LENDING_POOL_FACTORY_ADDRESS: Address;
  POSITION_FACTORY_ADDRESS: Address;
  VAULT_ADDRESS: Address;
  MOCK_UNISWAP_ROUTER_ADDRESS: Address;
  MOCK_FACTORY_ADDRESS: Address;
}

function validateAddress(address: string | undefined, name: string): Address {
  if (!address) {
    throw new Error(`Missing environment variable: NEXT_PUBLIC_${name}`);
  }

  if (!isAddress(address)) {
    throw new Error(`Invalid address format for NEXT_PUBLIC_${name}: ${address}`);
  }

  return address as Address;
}

function validateString(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: NEXT_PUBLIC_${name}`);
  }
  return value;
}

// Validate and export environment configuration
export const env: EnvironmentConfig = {
  WALLETCONNECT_PROJECT_ID: validateString(
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    'WALLETCONNECT_PROJECT_ID',
  ),
  LENDING_POOL_FACTORY_ADDRESS: validateAddress(
    process.env.NEXT_PUBLIC_LENDING_POOL_FACTORY_ADDRESS,
    'LENDING_POOL_FACTORY_ADDRESS',
  ),
  POSITION_FACTORY_ADDRESS: validateAddress(
    process.env.NEXT_PUBLIC_POSITION_FACTORY_ADDRESS,
    'POSITION_FACTORY_ADDRESS',
  ),
  VAULT_ADDRESS: validateAddress(process.env.NEXT_PUBLIC_VAULT_ADDRESS, 'VAULT_ADDRESS'),
  MOCK_UNISWAP_ROUTER_ADDRESS: validateAddress(
    process.env.NEXT_PUBLIC_MOCK_UNISWAP_ROUTER_ADDRESS,
    'MOCK_UNISWAP_ROUTER_ADDRESS',
  ),
  MOCK_FACTORY_ADDRESS: validateAddress(process.env.NEXT_PUBLIC_MOCK_FACTORY_ADDRESS, 'MOCK_FACTORY_ADDRESS'),
};

// Log configuration in development
// if (process.env.NODE_ENV === 'development') {
//   console.log('🔧 Environment Configuration Loaded:')
//   console.log('- WalletConnect Project ID:', env.WALLETCONNECT_PROJECT_ID)
//   console.log('- LendingPoolFactory:', env.LENDING_POOL_FACTORY_ADDRESS)
//   console.log('- PositionFactory:', env.POSITION_FACTORY_ADDRESS)
//   console.log('- Vault:', env.VAULT_ADDRESS)
//   console.log('- MockUniswapRouter:', env.MOCK_UNISWAP_ROUTER_ADDRESS)
//   console.log('- MockFactory:', env.MOCK_FACTORY_ADDRESS)
// }
