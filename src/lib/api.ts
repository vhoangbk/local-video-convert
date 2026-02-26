import type { ApiResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, StripePriceList, StripeSessionResponse, StripeSubscriptionDetail, StripeSubscriptionResponse, User } from '@/types';

// const API_BASE_URL = 'https://email-auth-backend-fawn.vercel.app/api';
const API_BASE_URL = 'https://hoangnv.space/api';

/**
 * Get user profile with authentication token
 */
export async function getUserProfile(
  token: string
): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    console.log('user profile:', responseData);

    if (!response.ok) {
      return {
        success: false,
        error: responseData.message || 'Failed to fetch profile',
      };
    }

    return {
      success: true,
      data: responseData.user,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Network error. Please try again.',
    };
  }
}

/**
 * Login user with email and password
 */
export async function loginUser(
  data: LoginRequest
): Promise<ApiResponse<LoginResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: responseData.message || 'Login failed',
      };
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Network error. Please try again.',
    };
  }
}

/**
 * Register a new user account
 */
export async function registerUser(
  data: RegisterRequest
): Promise<ApiResponse<RegisterResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: responseData.message || 'Registration failed',
      };
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Network error. Please try again.',
    };
  }
}

export async function verifyEmail(
  token: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify?token=${token}`);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Verification failed',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Network error. Please try again.',
    };
  }
}

export async function resendVerification(
  email: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Resend failed',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Network error. Please try again.',
    };
  }
}

export async function getPrices(): Promise<ApiResponse<StripePriceList>> {
  try {
    const response = await fetch(`${API_BASE_URL}/subscriptions/prices`);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to fetch prices',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Network error. Please try again.',
    };
  }
}

/**
 * Get Stripe subscription and customer IDs from a checkout session ID.
 * Calls the internal Next.js API route which uses the Stripe secret key server-side.
 */
export async function getStripeSession(
  sessionId: string
): Promise<ApiResponse<StripeSessionResponse>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/session?session_id=${sessionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: responseData.error || 'Failed to retrieve Stripe session',
      };
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Network error. Please try again.',
    };
  }
}

export async function createCheckoutSession(
  priceId: string,
  userId: string,
  userEmail: string
): Promise<ApiResponse<{ url: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/subscriptions/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        userEmail,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: responseData.error || 'Failed to create checkout session',
      };
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Network error. Please try again.',
    };
  }
}

export async function getSubscription(
  stripeCustomerId: string
): Promise<ApiResponse<StripeSubscriptionResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/subscriptions?customer_id=${stripeCustomerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: responseData.error || 'Failed to get subscription',
      };
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Network error. Please try again.',
    };
  }
}

