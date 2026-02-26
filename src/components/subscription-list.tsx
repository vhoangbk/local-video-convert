'use client';

import { useEffect, useState } from 'react';
import { getUserSubscriptions } from '@/lib/api';
import { SubscriptionCard } from './subscription-card';
import type { Subscription } from '@/types/subscription';
import { Loader2, AlertCircle } from 'lucide-react';

interface SubscriptionListProps {
  stripeCustomerId: string;
  token: string;
}

/**
 * Subscription list component
 * - Fetches subscriptions from API
 * - Filters to show only active and trialing subscriptions
 * - Sorts active first, then by creation date (newest first)
 * - Displays in responsive grid layout
 */
export function SubscriptionList({ stripeCustomerId, token }: SubscriptionListProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscriptions() {
      setLoading(true);
      setError(null);

      const result = await getUserSubscriptions(stripeCustomerId, token);

      if (result.success && result.data) {
        // Filter: Only show active and trialing subscriptions
        const filtered = result.data.subscriptions.filter(
          (sub) => sub.status === 'active' || sub.status === 'trialing'
        );

        // Sort: Active first, then by creation date (newest first)
        const sorted = filtered.sort((a, b) => {
          // Active subscriptions first
          if (a.status === 'active' && b.status !== 'active') return -1;
          if (a.status !== 'active' && b.status === 'active') return 1;
          
          // Then sort by creation date (newest first)
          return b.created.getTime() - a.created.getTime();
        });

        setSubscriptions(sorted);
      } else {
        setError(result.error || 'Failed to load subscriptions');
      }

      setLoading(false);
    }

    fetchSubscriptions();
  }, [stripeCustomerId, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10">
        <div className="flex items-center gap-2 text-red-800 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
        <p className="text-sm text-muted-foreground">No active subscriptions found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {subscriptions.map((subscription) => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
}
