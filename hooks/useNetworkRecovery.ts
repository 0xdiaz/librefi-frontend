import { useCallback, useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { baseSepolia } from '@/lib/chains';
import { toast } from 'sonner';

export function useNetworkRecovery() {
  const [isRecovering, setIsRecovering] = useState(false);
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { isConnected } = useAccount();

  const isWrongNetwork = isConnected && chainId !== baseSepolia.id;
  const isUnsupportedNetwork = isConnected && !chainId;

  const recoverNetwork = useCallback(async () => {
    if (!switchChain) {
      toast.error('Please manually switch to Base Sepolia in your wallet');
      return false;
    }

    setIsRecovering(true);
    try {
      await switchChain({ chainId: baseSepolia.id });
      toast.success('Switched to Base Sepolia');
      return true;
    } catch (error) {
      console.error('Failed to switch network:', error);
      const errorMessage =
        error instanceof Error
          ? error.message.includes('User rejected')
            ? 'Network switch cancelled'
            : 'Failed to switch network. Please try manually.'
          : 'Failed to switch network';

      toast.error(errorMessage);
      return false;
    } finally {
      setIsRecovering(false);
    }
  }, [switchChain]);

  return {
    isWrongNetwork,
    isUnsupportedNetwork,
    isRecovering,
    recoverNetwork,
    currentChainId: chainId,
    targetChain: baseSepolia,
  };
}
