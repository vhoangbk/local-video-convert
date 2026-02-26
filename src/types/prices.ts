/**
 * Stripe Price recurring configuration
 */
export interface StripePriceRecurring {
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count: number;
  meter: string | null;
  trial_period_days: number | null;
  usage_type: 'licensed' | 'metered';
}

/**
 * Stripe Price object
 */
export interface StripePrice {
  id: string;
  object: 'price';
  active: boolean;
  billing_scheme: 'per_unit' | 'tiered';
  created: number;
  currency: string;
  custom_unit_amount: number | null;
  livemode: boolean;
  lookup_key: string | null;
  metadata: Record<string, string>;
  nickname: string | null;
  product: string;
  recurring: StripePriceRecurring | null;
  tax_behavior: 'unspecified' | 'exclusive' | 'inclusive';
  tiers_mode: 'graduated' | 'volume' | null;
  transform_quantity: unknown | null;
  type: 'one_time' | 'recurring';
  unit_amount: number;
  unit_amount_decimal: string;
}

/**
 * Stripe API List response for prices
 */
export interface StripePriceList {
  object: 'list';
  data: StripePrice[];
  has_more: boolean;
  url: string;
}

/**
 * Formatted price for display
 */
export interface FormattedPrice {
  id: string;
  nickname: string;
  amount: number;
  currency: string;
  interval?: 'month' | 'year' | 'week' | 'day';
  type: 'one_time' | 'recurring';
  productId: string;
  displayPrice: string;
}
