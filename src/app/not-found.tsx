'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page after a brief moment
    const timer = setTimeout(() => {
      router.push('/')
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="inline-block animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" aria-hidden="true" />
        <p className="mt-4 text-slate-600">Redirecting…</p>
      </div>
    </div>
  )
}
