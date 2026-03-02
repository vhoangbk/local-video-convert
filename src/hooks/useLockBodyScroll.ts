"use client"

import { useEffect, useRef } from 'react'

export function useLockBodyScroll(lock: boolean) {
  useEffect(() => {
    if (lock) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [lock])
}

export function useReleaseLockBodyScroll() {
  const originalStyleRef = useRef<string>('')

  return () => {
    if (originalStyleRef.current === '') {
      originalStyleRef.current = window.getComputedStyle(document.body).overflow
    }
    document.body.style.overflow = originalStyleRef.current
  }
}

