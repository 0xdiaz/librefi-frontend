import { useCallback } from 'react';
import { toast } from 'sonner';
import { TransactionReceipt, Hash } from 'viem';

interface TransactionOptions {
  onSuccess?: (receipt: TransactionReceipt) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  pendingMessage?: string;
}

export function useTransactionHandler() {
  const handleTransaction = useCallback(async (transactionPromise: Promise<Hash>, options: TransactionOptions = {}) => {
    const {
      onSuccess,
      onError,
      successMessage = 'Transaction successful!',
      errorMessage = 'Transaction failed',
      pendingMessage = 'Transaction pending...',
    } = options;

    const loadingToast = toast.loading(pendingMessage);

    try {
      const hash = await transactionPromise;

      toast.loading('Waiting for confirmation...', { id: loadingToast });

      const receipt = await fetch(`/api/waitForTransaction?hash=${hash}`).then(res => res.json());

      if (receipt.status === 'success') {
        toast.success(successMessage, { id: loadingToast });
        onSuccess?.(receipt);
        return receipt;
      } else {
        throw new Error('Transaction reverted');
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message.includes('User rejected')
            ? 'Transaction cancelled by user'
            : error.message
          : errorMessage;

      toast.error(errorMsg, { id: loadingToast });
      onError?.(error as Error);
      throw error;
    }
  }, []);

  return { handleTransaction };
}

export function useTransactionFlow() {
  const { handleTransaction } = useTransactionHandler();

  const executeTransaction = useCallback(
    async (
      transactionFn: () => Promise<Hash>,
      successCallback?: () => void,
      errorCallback?: (error: Error) => void,
    ) => {
      try {
        await handleTransaction(transactionFn(), {
          onSuccess: () => successCallback?.(),
          onError: errorCallback,
        });
      } catch {
        // Error already handled by handleTransaction
      }
    },
    [handleTransaction],
  );

  return { executeTransaction };
}
