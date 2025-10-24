import { Address } from 'viem';

/**
 * Token and Price Feed addresses for Base Sepolia testnet
 * Updated with actual deployed contract addresses
 */

// Token addresses
export const TOKEN_ADDRESSES = {
  laDAI: '0x6EA630f4F0A4aaCf64826a4bb1911b0551ED8aB8' as Address,
  laUSDC: '0xe8202F7648f704d4496c2993e20a24BE90e89dC0' as Address,
  laUSDT: '0x97dD2d75A455a9B88c4365CAfDfd443F3a1Bc2a5' as Address,
  laWBTC: '0x443258Aa7f6Ca40410eAEf7B6ebdF490D1AA4bC9' as Address,
  laWETH: '0xa620841143755c0C0Cf4433D867AA66E3807DDDe' as Address,
} as const;

// Price feed addresses
export const PRICE_FEED_ADDRESSES = {
  laDAI: '0x3b956Cf1EA31202b3f311eC7e5FBa9325953b67E' as Address,
  laUSDC: '0xFa98273938a6221B738f7437770078451661E189' as Address,
  laUSDT: '0x9cf2F7d3378eCAFaac8cbfc5DE78fEB8802E4def' as Address,
  laWBTC: '0x64A80516294c88A524fe2812f80ab95b65763934' as Address,
  laWETH: '0x81B0D5f7bB83bF5DB22FD04D453848F2f8B2B17A' as Address,
} as const;

// Combined token information
export const TOKENS_INFO = {
  laDAI: {
    address: TOKEN_ADDRESSES.laDAI,
    priceFeed: PRICE_FEED_ADDRESSES.laDAI,
    symbol: 'laDAI',
    name: 'LibreFi DAI',
    decimals: 18,
  },
  laUSDC: {
    address: TOKEN_ADDRESSES.laUSDC,
    priceFeed: PRICE_FEED_ADDRESSES.laUSDC,
    symbol: 'laUSDC',
    name: 'LibreFi USDC',
    decimals: 6,
  },
  laUSDT: {
    address: TOKEN_ADDRESSES.laUSDT,
    priceFeed: PRICE_FEED_ADDRESSES.laUSDT,
    symbol: 'laUSDT',
    name: 'LibreFi USDT',
    decimals: 6,
  },
  laWBTC: {
    address: TOKEN_ADDRESSES.laWBTC,
    priceFeed: PRICE_FEED_ADDRESSES.laWBTC,
    symbol: 'laWBTC',
    name: 'LibreFi WBTC',
    decimals: 8,
  },
  laWETH: {
    address: TOKEN_ADDRESSES.laWETH,
    priceFeed: PRICE_FEED_ADDRESSES.laWETH,
    symbol: 'laWETH',
    name: 'LibreFi WETH',
    decimals: 18,
  },
} as const;

// Helper functions
export function getTokenAddress(symbol: keyof typeof TOKEN_ADDRESSES): Address {
  return TOKEN_ADDRESSES[symbol];
}

export function getPriceFeedAddress(symbol: keyof typeof PRICE_FEED_ADDRESSES): Address {
  return PRICE_FEED_ADDRESSES[symbol];
}

export function getTokenInfo(symbol: keyof typeof TOKENS_INFO) {
  return TOKENS_INFO[symbol];
}

// Array of all tokens for iteration
export const ALL_TOKENS = Object.values(TOKENS_INFO);

// Array of token symbols
export const TOKEN_SYMBOLS = Object.keys(TOKENS_INFO) as (keyof typeof TOKENS_INFO)[];
