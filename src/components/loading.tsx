"use client";

import { Loader2 } from "lucide-react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

export function Loading() {
  useLockBodyScroll(true);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading content"
    >
      <div className="bg-primary-foreground border border-border rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 min-w-[280px]">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
          </div>
        </div>
        
        <div className="text-center space-y-1">
          <p className="text-base font-semibold text-foreground">
            Processing…
          </p>
          <p className="text-xs text-foreground/70">
            Please wait a moment…
          </p>
        </div>
      </div>
    </div>
  );
}
