// Early wallet protection script - prevents ethereum property redefinition conflicts
// This script should be loaded before any wallet extensions inject their providers

(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;

  // Track if we've already protected the ethereum property
  let isProtected = false;
  
  function protectEthereumProperty() {
    if (isProtected) return;
    
    try {
      // If ethereum is already defined, make it non-configurable
      if (typeof window.ethereum !== 'undefined') {
        const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum');
        
        if (descriptor && descriptor.configurable) {
          Object.defineProperty(window, 'ethereum', {
            value: window.ethereum,
            writable: true,
            enumerable: true,
            configurable: false
          });
          console.log('LibreFi: Protected ethereum property from redefinition');
          isProtected = true;
        }
      } else {
        // If ethereum is not yet defined, set up a trap
        let ethereumValue = undefined;
        let hasBeenSet = false;
        
        Object.defineProperty(window, 'ethereum', {
          get: function() {
            return ethereumValue;
          },
          set: function(value) {
            if (!hasBeenSet) {
              ethereumValue = value;
              hasBeenSet = true;
              console.log('LibreFi: First ethereum provider detected');
              
              // Redefine as non-configurable after first set
              setTimeout(() => {
                try {
                  Object.defineProperty(window, 'ethereum', {
                    value: ethereumValue,
                    writable: true,
                    enumerable: true,
                    configurable: false
                  });
                  console.log('LibreFi: Locked ethereum property after first assignment');
                  isProtected = true;
                } catch (e) {
                  console.warn('LibreFi: Could not lock ethereum property:', e.message);
                }
              }, 100);
            } else {
              console.warn('LibreFi: Prevented ethereum property redefinition attempt');
            }
          },
          enumerable: true,
          configurable: true
        });
      }
    } catch (error) {
      console.warn('LibreFi: Wallet protection failed:', error.message);
    }
  }

  // Run immediately
  protectEthereumProperty();

  // Also run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', protectEthereumProperty);
  }

  // Run after a delay to catch late-loading extensions
  setTimeout(protectEthereumProperty, 1000);
  setTimeout(protectEthereumProperty, 3000);
})();