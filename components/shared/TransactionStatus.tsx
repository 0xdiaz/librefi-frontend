import { cn } from '@/lib/utils';
import { CheckCircle, Loader2, XCircle, LucideIcon } from 'lucide-react';

type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

interface TransactionStatusProps {
  status: TransactionStatus;
  message?: string;
  className?: string;
}

export function TransactionStatus({ status, message, className }: TransactionStatusProps) {
  const statusConfig: Record<
    TransactionStatus,
    { icon: LucideIcon | null; color: string; message: string; animate?: string }
  > = {
    idle: { icon: null, color: '', message: '' },
    pending: {
      icon: Loader2,
      color: 'text-blue-500',
      message: message || 'Transaction pending...',
      animate: 'animate-spin',
    },
    success: {
      icon: CheckCircle,
      color: 'text-green-500',
      message: message || 'Transaction successful!',
    },
    error: {
      icon: XCircle,
      color: 'text-red-500',
      message: message || 'Transaction failed',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  if (status === 'idle') return null;

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      {Icon && <Icon className={cn('size-4', config.color, config.animate)} />}
      <span className={config.color}>{config.message}</span>
    </div>
  );
}
