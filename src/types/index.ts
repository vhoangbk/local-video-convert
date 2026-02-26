export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  stripeCurrentSubscriptionId: string | null;
  stripeCustomerId: string | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    isVerified: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token?: string;
  user?: User;
}

export interface StripeSessionResponse {
  sessionId: string;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  status: string | null;
  paymentStatus: string | null;
}

export interface StripeSubscriptionDetail {
  id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  amount: number | null;           // in cents, e.g. 29999
  currency: string | null;         // e.g. "usd"
  interval: 'day' | 'week' | 'month' | 'year' | null;
  intervalCount: number | null;
  priceId: string | null;
  productId: string | null;
  productName: string | null;
  billingCycleAnchor: number | null;
  currentPeriodStart: number | null;
  currentPeriodEnd: number | null;
  startDate: number | null;
  endedAt: number | null;
  cancelAt: number | null;
  cancelAtPeriodEnd: boolean;
  trialEnd: number | null;
  trialStart: number | null;
}

export interface StripeSubscriptionResponse {
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  subscription: StripeSubscriptionDetail;
}

// Export subscription types
export * from './prices';
