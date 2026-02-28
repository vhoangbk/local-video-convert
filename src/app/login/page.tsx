"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");

    if (token) {
      // User is already logged in, redirect to home page
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen grid bg-slate-50">
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <LoginForm />

          {/* Footer links */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-xs text-slate-500">
              © 2026 SecureAuth. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
