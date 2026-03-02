"use client";

import { AlertCircle, X } from "lucide-react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

type ErrorProps = {
  title: string;
  message: string;
  onClose: () => void;
};

export function Error({ title, message, onClose }: ErrorProps) {
  useLockBodyScroll(true);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Focus management
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overscroll-contain touch-manipulation"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="error-title"
      aria-describedby="error-message"
    >
      <div className="bg-primary-foreground border border-border rounded-2xl shadow-2xl p-6 flex flex-col gap-4 min-w-[320px] max-w-md mx-4 overscroll-contain">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
            </div>
            <h2 id="error-title" className="text-lg font-semibold text-foreground break-words">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Close error dialog"
          >
            <X className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </div>

        {/* Message */}
        <div className="flex gap-3">
          <div className="w-10 flex-shrink-0" aria-hidden="true" />
          <p id="error-message" className="text-sm text-foreground/70 leading-relaxed break-words min-w-0">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-2">
          <Button
            ref={closeButtonRef}
            onClick={onClose}
            variant="default"
            className="px-6 touch-manipulation"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
