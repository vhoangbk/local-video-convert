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
              {user && (
                <Button asChild size="lg" className="rounded-full px-8">
                  <a href="/tool">Go to Tool</a>
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Powerful Video Tools
              </h2>
              <p className="text-slate-600 max-w-xl mx-auto">
                All the tools you need to edit your videos, right in your browser
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <a href="/tool?action=trim" className="group p-6 rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all duration-300 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">Trim</h3>
                <p className="text-sm text-slate-500 mt-1">Cut video</p>
              </a>

              <a href="/tool?action=crop" className="group p-6 rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all duration-300 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h2m10-4v2a2 2 0 01-2 2h-2m4-16h-2a2 2 0 00-2 2v2M8 4H6a2 2 0 00-2 2v2" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">Crop</h3>
                <p className="text-sm text-slate-500 mt-1">Resize video</p>
              </a>

              <a href="/tool?action=merge" className="group p-6 rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all duration-300 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">Merge</h3>
                <p className="text-sm text-slate-500 mt-1">Combine videos</p>
              </a>

              <a href="/tool?action=speed" className="group p-6 rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all duration-300 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">Speed</h3>
                <p className="text-sm text-slate-500 mt-1">Change pace</p>
              </a>

              <a href="/tool?action=rotate" className="group p-6 rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all duration-300 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">Rotate</h3>
                <p className="text-sm text-slate-500 mt-1">Flip video</p>
              </a>

              <a href="/tool?action=compress" className="group p-6 rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all duration-300 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">Compress</h3>
                <p className="text-sm text-slate-500 mt-1">Reduce size</p>
              </a>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Ready to get started?
            </h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              Join thousands of users who trust LocalConvert for their video editing needs
            </p>
            {!user && (
              <Button asChild size="lg" className="rounded-full px-8">
                <a href="/login">Sign In Now</a>
              </Button>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
