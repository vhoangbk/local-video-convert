'use client'

import { useState, FormEvent, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { setNewPassword } from '@/lib/api'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (token === null) {
      setErrors({ general: 'Invalid reset token. Please request a new password reset.' })
    }
  }, [token])

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters'
    }
    return null
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    const newErrors: { password?: string; confirmPassword?: string } = {}
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else {
      const passwordError = validatePassword(password)
      if (passwordError) {
        newErrors.password = passwordError
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (!token) {
      setErrors({ general: 'Invalid reset token. Please request a new password reset.' })
      return
    }

    setIsLoading(true)
    
    try {
      const response = await setNewPassword(token, password)
      
      if (!response.success) {
        setErrors({ general: response.error || 'Failed to reset password' })
        setIsLoading(false)
        return
      }
      
      setSuccess(true)
    } catch {
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md border border-slate-200 bg-white">
        <CardHeader className="space-y-2 pb-8 pt-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-slate-900 text-center tracking-tight">
            Password Reset Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <p className="text-center text-slate-600">
            Your password has been successfully reset. You can now sign in with your new password.
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
          Set New Password
        </CardTitle>
        <p className="text-sm text-slate-500">
          Enter your new password below.
        </p>
      </CardHeader>
      <CardContent className="pb-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.general && (
            <div className="flex items-start gap-2 p-3 rounded border border-red-200 bg-red-50" role="alert">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-sm text-red-700">{errors.general}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`h-10 bg-white border pr-10 text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${errors.password ? 'border-red-300 focus-visible:ring-red-500' : 'border-slate-300 focus-visible:ring-slate-900'}`}
                disabled={isLoading || !token}
                autoComplete="new-password"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-sm text-red-600" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`h-10 bg-white border pr-10 text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${errors.confirmPassword ? 'border-red-300 focus-visible:ring-red-500' : 'border-slate-300 focus-visible:ring-slate-900'}`}
                disabled={isLoading || !token}
                autoComplete="new-password"
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="text-sm text-red-600" role="alert">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white touch-action-manipulation mt-2"
            disabled={isLoading || !token}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true" />
                Resetting...
              </>
            ) : (
              'Reset Password'
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

function LoadingState() {
  return (
    <Card className="w-full max-w-md border border-slate-200 bg-white">
      <CardHeader className="space-y-2 pb-6 pt-8">
        <CardTitle className="text-2xl font-semibold text-slate-900 tracking-tight">
          Set New Password
        </CardTitle>
        <p className="text-sm text-slate-500">
          Loading...
        </p>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="h-10 bg-slate-100 rounded animate-pulse"></div>
      </CardContent>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen grid bg-slate-50">
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Suspense fallback={<LoadingState />}>
            <ResetPasswordForm />
          </Suspense>

          <div className="mt-8 text-center space-y-4">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} LocalConvert. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
