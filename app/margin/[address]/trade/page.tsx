'use client';

import { Button } from '@/components/shared/Button';
import { CONTRACTS } from '@/config/contracts';
import { useLendingPool } from '@/hooks/useLendingPool';
import { useLendingPoolFactory } from '@/hooks/useLendingPoolFactory';
import { convertPrice } from '@/lib/convertPrice';
import { LiquidationCalculator } from '@/lib/health';
import { formatTokenAmount } from '@/lib/utils/format';
import { PoolDetails } from '@/types';
import { ArrowLeft, Info } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Address, erc20Abi, formatUnits, maxUint256, parseUnits, zeroAddress } from 'viem';
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

export default function MarginTradePage() {
  const router = useRouter();
  const params = useParams();
  const poolAddress = params.address as Address;
  const { address: userAddress } = useAccount();

  // State management
  const [collateralAmount, setCollateralAmount] = useState('');
  const [leverage, setLeverage] = useState(1.5);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [needsApproval, setNeedsApproval] = useState(true);
  const [currentStep, setCurrentStep] = useState<'ready' | 'approving' | 'creating' | 'success'>('ready');

  // Get pool data
  const { poolAddresses, pools } = useLendingPoolFactory();
  const poolIndex = poolAddresses.findIndex(addr => addr.toLowerCase() === poolAddress.toLowerCase());
  const pool = poolIndex !== -1 ? pools[poolIndex] : undefined;

  // Get pool details for risk calculations
  const { ltp } = useLendingPool(poolAddress);

  // Contract functions
  const { writeContract, isPending: isWritePending } = useWriteContract();

  // Transaction confirmation
  const { isLoading: isConfirming, data: receipt } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Get token balance
  const { data: walletBalance } = useReadContract({
    address: pool?.collateralToken,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [userAddress || zeroAddress],
  });

  // Get token allowance for wallet
  const { data: walletAllowance, refetch: refetchWalletAllowance } = useReadContract({
    address: pool?.collateralToken,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [userAddress || zeroAddress, CONTRACTS.POSITION_FACTORY.address],
  });

  // Check if approval is needed
  useEffect(() => {
    if (!walletAllowance || !pool?.collateralTokenDecimals) return;

    try {
      // Only need approval if allowance is very small
      if (walletAllowance < parseUnits('1', pool.collateralTokenDecimals)) {
        setNeedsApproval(true);
      } else {
        setNeedsApproval(false);
      }
    } catch (error) {
      console.error('Error checking allowance:', error);
    }
  }, [walletAllowance, pool?.collateralTokenDecimals]);

  // Create position after approval (internal function)
  const handleCreatePosition = useCallback(async () => {
    if (!collateralAmount || !pool || !userAddress) return;

    try {
      setCurrentStep('creating');
      const collateralAmountBigInt = parseUnits(collateralAmount, pool?.collateralTokenDecimals || 18);

      // Convert leverage from decimal (e.g., 1.5) to basis points (e.g., 150)
      // Important: Contract expects leverage in basis points (100 = 1x)
      const leverageBasisPoints = BigInt(Math.floor(leverage * 100));

      console.log('Creating position with:', {
        poolAddress,
        collateralAmount: collateralAmountBigInt.toString(),
        leverageUI: leverage,
        leverageBasisPoints: leverageBasisPoints.toString(),
      });

      toast.loading('Creating position...', { id: 'create-position' });

      writeContract(
        {
          address: CONTRACTS.POSITION_FACTORY.address,
          abi: CONTRACTS.POSITION_FACTORY.abi,
          functionName: 'createPosition',
          args: [
            poolAddress,
            collateralAmountBigInt,
            leverageBasisPoints, // Fixed: Send basis points to contract (e.g., 150 for 1.5x)
          ],
        },
        {
          onSuccess: hash => {
            console.log('Position creation transaction hash:', hash);
            setTxHash(hash);
            toast.dismiss('create-position');
            toast.loading('Transaction submitted, waiting for confirmation...', {
              id: 'tx-confirm',
            });
          },
          onError: error => {
            console.error('Position creation Error:', error);
            setCurrentStep('ready');
            toast.dismiss('create-position');
            toast.error('Failed to create position: ' + error.message);
          },
        },
      );
    } catch (error) {
      console.error('Error creating position:', error);
      setCurrentStep('ready');
      toast.dismiss('create-position');
      toast.error('Failed to create position');
    }
  }, [collateralAmount, pool, userAddress, leverage, poolAddress, writeContract]);

  // Watch for transaction completion
  useEffect(() => {
    if (receipt?.status === 'success') {
      toast.dismiss('tx-confirm');

      if (currentStep === 'approving') {
        // Approval completed, now check if we can proceed to create position
        toast.success('Token approved successfully!');
        refetchWalletAllowance().then(() => {
          setNeedsApproval(false);
          setCurrentStep('ready');
          setTxHash(undefined);
          // Automatically proceed to create position after short delay
          setTimeout(() => {
            handleCreatePosition();
          }, 1000);
        });
      } else if (currentStep === 'creating') {
        // Position created successfully
        toast.success('Position created successfully!');
        setCurrentStep('success');
        setTimeout(() => {
          router.push(`/margin/${poolAddress}`);
        }, 1500);
      }
    }
  }, [receipt, router, poolAddress, currentStep, refetchWalletAllowance, handleCreatePosition]);

  // Calculate position details based on contract logic
  const calculatePositionDetails = (pool?: PoolDetails) => {
    if (!collateralAmount || !pool || !leverage) {
      return {
        borrowAmount: 0n,
        liquidationPrice: '0.00',
        healthFactor: 1.0,
        loanToValue: 0.33,
        effectiveCollateral: 0,
      };
    }

    try {
      const collateralValue = parseFloat(collateralAmount);

      // Following the contract logic in PositionFactory.createPosition
      // Convert leverage from decimal (1.5) to basis points (150)
      const leverageBasisPoints = Math.floor(leverage * 100);

      // baseCollateral * (leverage - 100) / 100
      const borrowCollateral = (collateralValue * (leverageBasisPoints - 100)) / 100;

      // Simple approximation for borrowAmount
      const borrowAmount = convertPrice(pool.loanTokenSymbol, pool.collateralTokenSymbol, borrowCollateral);

      const effectiveCollateral = (collateralValue * leverageBasisPoints) / 100;
      const effectiveCollateralPrice = convertPrice(
        pool.loanTokenSymbol,
        pool.collateralTokenSymbol,
        effectiveCollateral,
      );

      // Use LiquidationCalculator from health.ts
      const calculator = new LiquidationCalculator(ltp || 80n);
      const liquidationPrice = calculator.getLiquidationPrice(effectiveCollateral, borrowAmount);
      const healthFactor = calculator.getHealth(effectiveCollateralPrice, borrowAmount);
      const loanToValue = calculator.getLTV(effectiveCollateralPrice, borrowAmount);

      return {
        borrowAmount: parseUnits(borrowAmount.toFixed(pool?.loanTokenDecimals || 18), pool?.loanTokenDecimals || 18),
        liquidationPrice: liquidationPrice.toFixed(2),
        healthFactor: healthFactor,
        loanToValue: loanToValue,
        effectiveCollateral: effectiveCollateral,
      };
    } catch (error) {
      console.error('Error calculating position details:', error);
      return {
        borrowAmount: 0n,
        liquidationPrice: '0.00',
        healthFactor: 1.0,
        loanToValue: 0.33,
        effectiveCollateral: 0,
      };
    }
  };

  const positionDetails = calculatePositionDetails(pool);

  // Handle percentage buttons
  const handlePercentageClick = (percentage: number) => {
    if (!walletBalance) return;
    const amount = (Number(formatUnits(walletBalance, pool?.collateralTokenDecimals || 18)) * percentage) / 100;
    setCollateralAmount(amount.toString());
  };

  // Input validation
  const isExceedingBalance = () => {
    if (!walletBalance || !collateralAmount) return false;
    try {
      const amount = parseUnits(collateralAmount, pool?.collateralTokenDecimals || 18);
      return amount > walletBalance;
    } catch {
      return false;
    }
  };

  // Approve collateral tokens
  const handleApproveToken = async () => {
    if (!pool || !userAddress) return;

    try {
      setCurrentStep('approving');
      toast.loading('Approving token...', { id: 'approve-tx' });

      writeContract(
        {
          address: pool.collateralToken,
          abi: erc20Abi,
          functionName: 'approve',
          args: [CONTRACTS.POSITION_FACTORY.address, maxUint256],
        },
        {
          onSuccess: hash => {
            console.log('Token approval transaction hash:', hash);
            setTxHash(hash);
            toast.dismiss('approve-tx');
            toast.loading('Approval transaction submitted...', {
              id: 'tx-confirm',
            });
          },
          onError: error => {
            console.error('Token approval error:', error);
            setCurrentStep('ready');
            toast.dismiss('approve-tx');
            toast.error('Failed to approve token');
          },
        },
      );
    } catch (error) {
      console.error('Token approval error:', error);
      setCurrentStep('ready');
      toast.dismiss('approve-tx');
      toast.error('Failed to approve token');
    }
  };

  // Unified action: Handle both approval and position creation
  const handleCreatePositionAction = async () => {
    if (!collateralAmount || !pool || !userAddress) return;

    // Check if approval is needed first
    if (needsApproval) {
      // Start with token approval
      await handleApproveToken();
      // Position creation will be triggered automatically after approval
    } else {
      // Directly create position
      await handleCreatePosition();
    }
  };

  if (!pool) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>Pool not found</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className='size-4 mr-2' />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className='container mx-auto px-4 py-8'>
      <Button variant='ghost' className='mb-6' onClick={() => router.back()}>
        <ArrowLeft className='size-4 mr-2' />
        Back
      </Button>

      <div className='max-w-xl mx-auto'>
        <div className='bg-card rounded-lg border p-6 space-y-6'>
          <div>
            <h1 className='text-xl font-bold mb-2 px-2'>
              {pool.loanTokenSymbol}/{pool.collateralTokenSymbol} Trade
            </h1>
            <p className='text-sm text-muted-foreground px-2'>Open a margin position with this pool</p>
          </div>

          {/* Collateral Input */}
          <div className='space-y-4'>
            <div className='flex justify-between items-center px-2'>
              <h2 className='text-lg font-medium'>Collateral</h2>
              <div className='text-sm text-muted-foreground'>
                Balance:{' '}
                {formatTokenAmount(walletBalance || 0n, {
                  decimals: pool.collateralTokenDecimals,
                })}{' '}
                {pool.collateralTokenSymbol}
              </div>
            </div>

            <div className='relative'>
              <input
                type='number'
                value={collateralAmount}
                onChange={e => setCollateralAmount(e.target.value)}
                className='w-full bg-background p-3 rounded border'
                placeholder='0.00'
                disabled={isWritePending || isConfirming}
              />
              <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                <span className='text-sm font-medium pr-6'>{pool.collateralTokenSymbol}</span>
              </div>
            </div>

            {isExceedingBalance() && (
              <p className='text-sm text-red-500 flex items-center gap-1'>
                <Info className='size-4' />
                Insufficient balance
              </p>
            )}

            <div className='flex gap-2'>
              {[25, 50, 75, 100].map(percentage => (
                <Button
                  key={percentage}
                  variant='outline'
                  onClick={() => handlePercentageClick(percentage)}
                  className='flex-1'
                  disabled={isWritePending || isConfirming}
                >
                  {percentage}%
                </Button>
              ))}
            </div>
          </div>

          {/* Leverage Slider */}
          <div className='space-y-2'>
            <div className='flex justify-between px-2'>
              <span>Leverage</span>
              <span>{leverage.toFixed(2)}x</span>
            </div>
            <input
              type='range'
              min='1.0'
              max='3'
              step='0.1'
              value={leverage}
              onChange={e => setLeverage(parseFloat(e.target.value))}
              className='w-full'
              disabled={isWritePending || isConfirming}
            />
            <div className='flex justify-between text-xs text-muted-foreground px-1'>
              <span>1x</span>
              <span>2x</span>
              <span>3x</span>
            </div>
          </div>

          {/* Position Summary */}
          <div className='bg-muted/50 rounded-lg p-4 space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Base Collateral</span>
              <span>
                {parseFloat(collateralAmount || '0').toFixed(4)} {pool?.collateralTokenSymbol}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Effective Collateral</span>
              <span>
                {positionDetails.effectiveCollateral.toFixed(4)} {pool?.collateralTokenSymbol}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Borrow Amount</span>
              <span>
                {formatUnits(positionDetails.borrowAmount, pool.loanTokenDecimals)} {pool.loanTokenSymbol}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Liquidation Price</span>
              <span>${positionDetails.liquidationPrice}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Health Factor</span>
              <span
                className={
                  positionDetails.healthFactor < 1.1
                    ? 'text-red-500'
                    : positionDetails.healthFactor < 1.3
                      ? 'text-yellow-500'
                      : 'text-green-500'
                }
              >
                {positionDetails.healthFactor.toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-muted-foreground'>Loan to Value</span>
              <span>{(positionDetails.loanToValue * 100).toFixed(2)}%</span>
            </div>
          </div>

          {/* Unified Action Button */}
          <Button
            className='w-full'
            size='lg'
            onClick={handleCreatePositionAction}
            disabled={
              !collateralAmount ||
              isExceedingBalance() ||
              isWritePending ||
              isConfirming ||
              Number(collateralAmount) <= 0 ||
              currentStep === 'approving' ||
              currentStep === 'creating' ||
              currentStep === 'success'
            }
          >
            {(() => {
              if (currentStep === 'approving') {
                return 'Approving Token...';
              }
              if (currentStep === 'creating') {
                return 'Creating Position...';
              }
              if (currentStep === 'success') {
                return 'Position Created ✓';
              }
              if (isWritePending || isConfirming) {
                return needsApproval ? 'Processing...' : 'Processing...';
              }
              if (needsApproval) {
                // return `Approve ${pool.collateralTokenSymbol} & Create Position`;
                return `Create Position`;
              }
              return 'Create Position';
            })()}
          </Button>

          {/* Progress indicator for multi-step flow */}
          {needsApproval && currentStep !== 'ready' && (
            <div className='text-center text-sm text-muted-foreground'>
              {currentStep === 'approving' && (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-2 h-2 bg-primary rounded-full animate-pulse'></div>
                  Step 1 of 2: Approving token permission
                </div>
              )}
              {currentStep === 'creating' && (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-2 h-2 bg-primary rounded-full animate-pulse'></div>
                  Step 2 of 2: Creating margin position
                </div>
              )}
              {currentStep === 'success' && (
                <div className='flex items-center justify-center gap-2 text-green-600'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  Complete! Redirecting to position...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
