"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen grid bg-slate-50">
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <SignupForm />

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
