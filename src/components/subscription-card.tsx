import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionStatusBadge } from './subscription-status-badge';
import type { Subscription } from '@/types/subscription';
import { Calendar, CreditCard, AlertCircle } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
}

/**
 * Card component to display individual subscription details
 * Shows product info, pricing, status, and renewal/trial dates
 */
export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const { product, price, status, currentPeriodEnd, trialEnd } = subscription;

  // Format price with native currency (US format)
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency.toUpperCase(),
  }).format(price.unitAmount / 100);

  // Format billing interval
  const billingInterval = price.intervalCount === 1 
    ? price.interval 
    : `${price.intervalCount} ${price.interval}s`;

  // Format next billing date (US format: January 15, 2026)
  const nextBillingDate = currentPeriodEnd.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{product.name}</CardTitle>
            {product.description && (
              <CardDescription className="mt-1">{product.description}</CardDescription>
            )}
          </div>
          <SubscriptionStatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{formattedPrice}</span>
          <span className="text-muted-foreground">/ {billingInterval}</span>
        </div>

        {trialEnd && status === 'trialing' && (
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <AlertCircle className="h-4 w-4" />
            <span>
              Trial ends on {trialEnd.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
        )}

        {status === 'active' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Renews on {nextBillingDate}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
