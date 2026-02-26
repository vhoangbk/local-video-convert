'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft, Mail } from 'lucide-react'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({})
  const [success, setSuccess] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    const newErrors: { email?: string } = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    
    // Simulate API call - replace with actual forgot password API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Show success message
    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <Card className="w-full max-w-md border border-slate-200 bg-white">
        <CardHeader className="space-y-2 pb-8 pt-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-slate-900 text-center tracking-tight">
            Check Your Email
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <p className="text-center text-slate-600">
            We've sent password reset instructions to{' '}
            <span className="font-medium text-slate-800">{email}</span>
          </p>
          <p className="text-center text-sm text-slate-500 mt-4">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={() => setSuccess(false)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              try again
            </button>
          </p>
        </CardContent>
        <CardFooter className="justify-center pb-8">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border border-slate-200 bg-white">
      <CardHeader className="space-y-2 pb-6 pt-8">
        <CardTitle className="text-2xl font-semibold text-slate-900 tracking-tight">
          Reset Password
        </CardTitle>
        <p className="text-sm text-slate-500">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </CardHeader>
      <CardContent className="pb-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.general && (
            <div className="flex items-start gap-2 p-3 rounded border border-error-200 bg-error-50" role="alert">
              <AlertCircle className="h-4 w-4 text-error-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-sm text-error-700">{errors.general}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`h-10 bg-white border text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${errors.email ? 'border-error-300 focus-visible:ring-error-500' : 'border-slate-300 focus-visible:ring-slate-900'}`}
              disabled={isLoading}
              autoComplete="email"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-error-600" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white touch-action-manipulation mt-2"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center pb-8">
        <Link
          href="/login"
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  )
}
