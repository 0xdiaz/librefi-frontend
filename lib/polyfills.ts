/**
 * Polyfills for server-side rendering compatibility
 * These provide minimal implementations of browser APIs that aren't available in Node.js
 */

// IndexedDB polyfill for SSR
if (typeof window === 'undefined') {
  // Server-side polyfills
  if (typeof global !== 'undefined') {
    // Mock indexedDB for server-side rendering
    (global as unknown as { indexedDB: unknown }).indexedDB = {
      open: () => ({
        onsuccess: null,
        onerror: null,
        result: {
          createObjectStore: () => ({}),
          transaction: () => ({
            objectStore: () => ({
              get: () => ({ onsuccess: null, onerror: null }),
              put: () => ({ onsuccess: null, onerror: null }),
              delete: () => ({ onsuccess: null, onerror: null }),
            }),
          }),
        },
      }),
      deleteDatabase: () => ({ onsuccess: null, onerror: null }),
    };

    // Mock localStorage for server-side rendering
    if (typeof localStorage === 'undefined') {
      const mockStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        length: 0,
        key: () => null,
      };
      (global as unknown as { localStorage: unknown; sessionStorage: unknown }).localStorage = mockStorage;
      (global as unknown as { localStorage: unknown; sessionStorage: unknown }).sessionStorage = mockStorage;
    }

    // Mock crypto for server-side rendering
    if (typeof crypto === 'undefined') {
      (global as unknown as { crypto: unknown }).crypto = {
        getRandomValues: (arr: Uint8Array) => {
          // Simple polyfill for crypto.getRandomValues
          for (let i = 0; i < arr.length; i++) {
            arr[i] = Math.floor(Math.random() * 256);
          }
          return arr;
        },
        subtle: {
          digest: () => Promise.resolve(new ArrayBuffer(0)),
        },
      };
    }

    // Mock URL for server-side rendering
    if (typeof URL === 'undefined') {
      (global as unknown as { URL: unknown }).URL = class MockURL {
        constructor(public href: string) {}
        toString() {
          return this.href;
        }
      };
    }
  }
}

// Client-side initialization
if (typeof window !== 'undefined') {
  // Ensure Web3 APIs are properly initialized on the client
  if (!window.crypto) {
    console.warn('crypto API not available');
  }

  if (!window.indexedDB) {
    console.warn('indexedDB not available');
  }
}

export {};
