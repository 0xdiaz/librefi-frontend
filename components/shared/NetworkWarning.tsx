import { AlertTriangle, Wifi } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { useNetworkRecovery } from '@/hooks/useNetworkRecovery';
import { useSafeChains } from '@/hooks/useSafeWagmi';
import { useState, useEffect } from 'react';

export function NetworkWarning() {
  const [isClient, setIsClient] = useState(false);
  const { isWrongNetwork, isUnsupportedNetwork, isRecovering, recoverNetwork, currentChainId, targetChain } =
    useNetworkRecovery();
  const chains = useSafeChains();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || (!isWrongNetwork && !isUnsupportedNetwork)) return null;

  const currentChain = chains.find(chain => chain.id === currentChainId);

  return (
    <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6'>
      <div className='flex items-start gap-3'>
        <AlertTriangle className='size-5 text-destructive flex-shrink-0 mt-0.5' />
        <div className='flex-1 space-y-2'>
          <h3 className='font-semibold text-destructive'>
            {isUnsupportedNetwork ? 'Unsupported Network' : 'Wrong Network'}
          </h3>
          <p className='text-sm text-muted-foreground'>
            {isUnsupportedNetwork
              ? 'Please connect to a supported network to use LibreFi.'
              : `You're connected to ${currentChain?.name || 'unknown network'}. LibreFi only works on ${targetChain.name}.`}
          </p>
          <Button onClick={recoverNetwork} disabled={isRecovering} size='sm' className='gap-2'>
            <Wifi className='size-4' />
            {isRecovering ? 'Switching...' : `Switch to ${targetChain.name}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
