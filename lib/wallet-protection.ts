'use client';

// Wallet protection utility to handle ethereum property conflicts
export function protectEthereumProperty() {
  if (typeof window === 'undefined') return;

  // Only run in browser environment
  if (typeof window.ethereum !== 'undefined') {
    // If ethereum is already defined, try to protect against redefinition
    try {
      const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'ethereum');

      if (originalDescriptor && !originalDescriptor.configurable) {
        // Property is already non-configurable, safe to use
        return;
      }

      // Make the property non-configurable to prevent redefinition
      Object.defineProperty(window, 'ethereum', {
        value: window.ethereum,
        writable: true,
        enumerable: true,
        configurable: false, // This prevents redefinition
      });
    } catch (error) {
      // Silently handle any errors in property protection
      console.warn('Wallet protection: Unable to protect ethereum property:', error);
    }
  }
}

// Enhanced wallet detection with conflict resolution
export function detectWallets() {
  if (typeof window === 'undefined') return null;

  const wallets: { [key: string]: unknown } = {};

  // Check for MetaMask
  if (window.ethereum?.isMetaMask) {
    wallets.metamask = window.ethereum;
  }

  // Check for Coinbase Wallet
  if (window.ethereum?.isCoinbaseWallet) {
    wallets.coinbase = window.ethereum;
  }

  // Check for WalletConnect
  if (window.ethereum?.isWalletConnect) {
    wallets.walletconnect = window.ethereum;
  }

  // Check for other wallets
  if (window.ethereum && !window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet) {
    wallets.other = window.ethereum;
  }

  return wallets;
}

// Safe ethereum property getter
export function getSafeEthereum() {
  if (typeof window === 'undefined') return null;

  try {
    return window.ethereum || null;
  } catch (error) {
    console.warn('Error accessing ethereum property:', error);
    return null;
  }
}

// Initialize wallet protection
export function initWalletProtection() {
  if (typeof window === 'undefined') return;

  // Run protection immediately
  protectEthereumProperty();

  // Also run after a short delay to catch late-loading extensions
  setTimeout(() => {
    protectEthereumProperty();
  }, 1000);

  // Listen for ethereum property changes
  if ('ethereum' in window) {
    // Set up a mutation observer if possible
    try {
      const observer = new MutationObserver(() => {
        protectEthereumProperty();
      });

      observer.observe(document, {
        childList: true,
        subtree: true,
      });
    } catch (error) {
      // MutationObserver not available or failed
      console.warn('Wallet protection: MutationObserver setup failed:', error);
    }
  }
}
