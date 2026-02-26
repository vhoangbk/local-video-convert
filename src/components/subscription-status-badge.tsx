import type { SubscriptionStatus } from '@/types/subscription';

interface SubscriptionStatusBadgeProps {
  status: SubscriptionStatus;
}

/**
 * Status badge component for subscription statuses
 * Only displays badges for active and trialing subscriptions
 */
export function SubscriptionStatusBadge({ status }: SubscriptionStatusBadgeProps) {
  const statusConfig = {
    active: {
      label: 'Active',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    trialing: {
      label: 'Trial',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
  };

  const config = statusConfig[status as 'active' | 'trialing'];

  if (!config) {
    return null; // Don't render badge for other statuses
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
