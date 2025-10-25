import { useAccount, useChainId, useChains } from 'wagmi';
import { useState, useEffect } from 'react';

/**
 * Safe wrapper for useAccount that doesn't throw if WagmiProvider is not available
 */
export function useSafeAccount() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  try {
    const account = useAccount();
    return isClient ? account : { isConnected: false, address: undefined };
  } catch {
    return { isConnected: false, address: undefined };
  }
}

/**
 * Safe wrapper for useChainId that doesn't throw if WagmiProvider is not available
 */
export function useSafeChainId() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  try {
    const chainId = useChainId();
    return isClient ? chainId : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Safe wrapper for useChains that doesn't throw if WagmiProvider is not available
 */
export function useSafeChains() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  try {
    const chains = useChains();
    return isClient ? chains : [];
  } catch {
    return [];
  }
}
