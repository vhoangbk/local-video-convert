'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { StripePrice } from '@/types/prices'
import { getPrices, createCheckoutSession, getSubscription, getUserProfile } from '@/lib/api'
import { User } from '@/types'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [prices, setPrices] = useState<StripePrice[]>([])
  const [pricesLoading, setPricesLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [currentPriceId, setCurrentPriceId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const authToken = localStorage.getItem('authToken')
    
    if (!authToken) {
      setIsLoading(false)
    } else {
      const userProfile = await getUserProfile(authToken)

      if (userProfile.success) {
        try {
          const user = userProfile.data ?? null
          setUser(user)
        } catch (error) {
          console.error('Failed to parse user data:', error)
        }
      }
      setIsLoading(false)
    }
  }

  const fetchPrices = async () => {
    setPricesLoading(true)
    try {
      const response = await getPrices();
      if (!response.success) {
        throw new Error('Failed to fetch prices')
      }
      const data = (response.data || []) as StripePrice[]
      setPrices(data)
    } catch (error) {
      console.error('Error fetching prices:', error)
    } finally {
      setPricesLoading(false)
    }
  }

  const fetchSubscription = async () => {
    if (!user) return
    if (!user.stripeCustomerId) return
    try {
      const response = await getSubscription(user.stripeCustomerId)
      if (response.success) {
        const data = response.data
        if (data?.subscription?.priceId) {
          setCurrentPriceId(data?.subscription?.priceId)
        }
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchSubscription()
    }
  }, [user])

  useEffect(() => {
    fetchPrices()
  }, [])

  const formatPrice = (price: StripePrice): string => {
    const amount = price.unit_amount / 100
    
    if (price.type === 'recurring' && price.recurring) {
      return `$${amount.toFixed(2)}`
    }
    return `$${amount.toFixed(2)}`
  }

  const handleSelectPlan = async (priceId: string) => {
    if (!user) {
      router.push('/login')
      return
    }

    setCheckoutLoading(priceId)
    
    try {
      const response = await createCheckoutSession(priceId, user.id, user.email)

      if (!response.success) {
        throw new Error('Failed to create checkout session')
      }

      const data = response.data

      if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setCheckoutLoading(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header user={user} />

      <main className="flex-1">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-sky-50/50" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight leading-tight mb-6">
                Convert Videos{' '}
                <span className="text-primary-500">Locally</span>
                <br />with Privacy
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Fast, secure video conversion powered by WebAssembly. 
                Your files never leave your device.
              </p>
              {!user && (
                <div className="flex gap-4 justify-center">
                  <Button asChild size="lg" className="rounded-full px-8">
                    <a href="/login">Get Started</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Choose Your Plan
              </h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Unlock unlimited conversions with a subscription that fits your needs
              </p>
            </div>
            
            {pricesLoading ? (
              <div className="text-center py-12" aria-live="polite">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-slate-500 text-sm">Loading plans...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {prices.map((price) => {
                  const isCurrentPlan = currentPriceId === price.id

                  return (
                    <div
                      key={price.id}
                      className={`relative rounded-2xl p-6 transition-all duration-300 ${
                        isCurrentPlan
                          ? 'bg-white border-2 border-primary shadow-lg shadow-primary/10 scale-[1.02]'
                          : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl'
                      }`}
                    >
                      {isCurrentPlan && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-primary text-white text-xs font-semibold px-4 py-1 rounded-full shadow-md">
                            Current Plan
                          </span>
                        </div>
                      )}

                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                          {price.nickname || 'Standard Plan'}
                        </h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-slate-800">
                            {formatPrice(price)}
                          </span>
                          {price.recurring && (
                            <span className="text-slate-500">
                              /{price.recurring.interval}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
                            <svg className="w-3 h-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-slate-600">Unlimited conversions</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
                            <svg className="w-3 h-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-slate-600">Local processing</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
                            <svg className="w-3 h-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-slate-600">Priority support</span>
                        </div>
                      </div>

                      {isCurrentPlan ? (
                        <Button
                          className="w-full rounded-xl"
                          disabled
                        >
                          Current Plan
                        </Button>
                      ) : (
                        <Button
                          className="w-full rounded-xl"
                          onClick={() => handleSelectPlan(price.id)}
                          disabled={checkoutLoading === price.id}
                        >
                          {checkoutLoading === price.id ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Processing...
                            </span>
                          ) : (
                            'Subscribe'
                          )}
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            
            {!pricesLoading && prices.length === 0 && (
              <div className="text-center text-slate-500 py-12" aria-live="polite">
                No pricing plans available at the moment.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
