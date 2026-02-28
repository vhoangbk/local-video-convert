"use client";

import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/verify-email-form";
import { Loader2 } from "lucide-react";

function VerifyEmailContent() {
  return (
    <div className="min-h-screen grid bg-slate-50">
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <VerifyEmailForm />

          <div className="mt-8 text-center space-y-4">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} LocalConvert. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen grid bg-slate-50">
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
