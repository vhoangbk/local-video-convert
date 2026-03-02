'use client'

import { Zap, Shield, Gauge } from 'lucide-react'

interface Feature {
  icon: typeof Zap
  title: string
}

const features: Feature[] = [
  { icon: Zap, title: 'Lightning Fast' },
  { icon: Gauge, title: 'Smart Sizing' },
  { icon: Shield, title: 'Private & Secure' }
]

export function CompressFeatures() {
  return (
    <div className="mt-8 grid grid-cols-3 gap-4">
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors"
        >
          <feature.icon className="w-5 h-5 text-primary-600 mb-2" aria-hidden="true" />
          <p className="text-xs font-medium text-slate-600">{feature.title}</p>
        </div>
      ))}
    </div>
  )
}
