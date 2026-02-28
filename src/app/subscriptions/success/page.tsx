'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from 'lucide-react'
import { getStripeSession } from '@/lib/api'
import { StripeSessionResponse } from '@/types'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [sessionData, setSessionData] = useState<StripeSessionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      return
    }

    const fetchSession = async () => {
      const result = await getStripeSession(sessionId)
      if (result.success && result.data) {
        setSessionData(result.data)
        console.log('Stripe Session:', {
          stripeSubscriptionId: result.data.stripeSubscriptionId,
          stripeCustomerId: result.data.stripeCustomerId,
        })
      } else {
        setError(result.error || 'Failed to load session details')
      }
    }

    fetchSession()
  }, [sessionId])

  const isLoading = !sessionId ? false : !sessionData && !error

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-slate-600 mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful!
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for your purchase. Your subscription is now active.
          </p>

          {error && (
            <p className="text-sm text-red-500 mb-4">{error}</p>
          )}

          {sessionData && (
            <div className="text-left bg-gray-50 dark:bg-gray-700 rounded-md p-4 mb-6 space-y-2">
              {sessionData.stripeSubscriptionId && (
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Subscription ID
                  </span>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-mono break-all">
                    {sessionData.stripeSubscriptionId}
                  </p>
                </div>
              )}
              {sessionData.stripeCustomerId && (
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Customer ID
                  </span>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-mono break-all">
                    {sessionData.stripeCustomerId}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => router.push('/')}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-slate-600 mx-auto" />
        <p className="mt-4 text-slate-600 dark:text-slate-300">Loading...</p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  )
}
