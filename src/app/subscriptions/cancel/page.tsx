'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft } from 'lucide-react'

function CancelPageContent() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6 flex justify-center">
            <XCircle className="w-20 h-20 text-rose-500" aria-hidden="true" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>

          <p className="text-gray-600 mb-6">
            Your subscription was not completed. No charges have been made to your payment method.
          </p>

          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CancelPage() {
  return <CancelPageContent />
}
