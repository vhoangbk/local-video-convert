"use client";

import { Loader2, Clock } from "lucide-react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

type ProgressProps = {
  percent: string;
  remainingTime: number;
  message: string;
};

export function Progress({ percent, remainingTime, message }: ProgressProps) {
  useLockBodyScroll(true);

  // Format remaining time
  const formatTime = (seconds: number): string => {
    if (!seconds || seconds <= 0) return "Calculating…";
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    if (mins > 0) {
      return `${mins}m ${secs}s remaining`;
    }
    return `${secs}s remaining`;
  };

  // Parse percent to number for progress bar
  const percentValue = parseInt(percent) || 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overscroll-contain"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Video conversion in progress"
    >
      <div className="bg-primary-foreground border border-border rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 min-w-[380px] max-w-md mx-4">
        {/* Icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
          </div>
        </div>

        {/* Progress Info */}
        <div className="w-full space-y-4">
          {/* Message */}
          <div className="text-center">
            <p className="text-base font-semibold text-foreground mb-1">
              {message || "Processing…"}
            </p>
            <p className="text-xs text-foreground/70">
              Please don't close this window
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden bg-primary/20">
              <div
                className="absolute inset-y-0 left-0 bg-primary transition-all duration-300 ease-out rounded-full"
                style={{ width: `${Math.min(percentValue, 100)}%` }}
                role="progressbar"
                aria-valuenow={percentValue}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Conversion progress"
              />
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-foreground/70">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{formatTime(remainingTime)}</span>
              </div>
              <span className="font-semibold text-foreground tabular-nums">
                {percentValue}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
