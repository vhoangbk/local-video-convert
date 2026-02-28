'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { verifyEmail } from '@/lib/api'

type VerifyStatus = 'loading' | 'success' | 'error' | 'expired'

export function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<VerifyStatus>('loading')
  const token = searchParams.get('token')

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return
      const res = await verifyEmail(token)
      if (res.success) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    }

    verifyToken()
  }, [token])

  if (status === 'loading') {
    return (
      <Card className="w-full max-w-md border border-primary/20 bg-white shadow-lg shadow-primary/5">
        <CardHeader className="space-y-2 pb-8 pt-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-slate-900 text-center tracking-tight">
            Verifying Email
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <p className="text-center text-slate-500">
            Please wait while we verify your email address...
          </p>
        </CardContent>
      </Card>
    )
  }

  if (status === 'success') {
    return (
      <Card className="w-full max-w-md border border-primary/20 bg-white shadow-lg shadow-primary/5">
        <CardHeader className="space-y-2 pb-8 pt-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-slate-900 text-center tracking-tight">
            Email Verified!
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <p className="text-center text-slate-600">
            Your email has been successfully verified. You can now sign in to your account.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <Button asChild className="w-full max-w-[200px] bg-primary hover:bg-primary-600">
            <Link href="/login">Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (status === 'expired') {
    return (
      <Card className="w-full max-w-md border border-primary/20 bg-white shadow-lg shadow-primary/5">
        <CardHeader className="space-y-2 pb-6 pt-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-warning-100 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-warning-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-slate-900 text-center tracking-tight">
            Link Expired
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <p className="text-center text-slate-600">
            This verification link has expired. Request a new one below.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    )
  }

  // Error state
  return (
    <Card className="w-full max-w-md border border-primary/20 bg-white shadow-lg shadow-primary/5">
      <CardHeader className="space-y-2 pb-6 pt-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-error-100 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-error-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-semibold text-slate-900 text-center tracking-tight">
          Verification Failed
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <p className="text-center text-slate-600">
          Something went wrong. The verification link may be invalid or has expired.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pb-8">
        <Link
          href="/login"
          className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  )
}
