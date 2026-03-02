'use client'

import { Target } from 'lucide-react'

interface TargetSizeInputProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  currentSize: number
}

export function TargetSizeInput({
  value,
  onChange,
  disabled = false,
  currentSize,
}: TargetSizeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0
    onChange(newValue)
  }

  const suggestedSizes = [
    { label: '25%', value: Math.round(currentSize * 0.25) },
    { label: '50%', value: Math.round(currentSize * 0.5) },
    { label: '75%', value: Math.round(currentSize * 0.75) },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-slate-700">
        <Target className="w-4 h-4" aria-hidden="true" />
        <span className="text-sm font-medium">Target Size (MB)</span>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <input
            type="number"
            min="1"
            max={currentSize}
            value={value || ''}
            onChange={handleChange}
            disabled={disabled}
            placeholder="Enter target size"
            className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
            MB
          </span>
        </div>

        <div className="flex gap-2">
          {suggestedSizes.map((size) => (
            <button
              key={size.label}
              type="button"
              onClick={() => onChange(size.value)}
              disabled={disabled}
              className="flex-1 py-2 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:border-primary-400 hover:text-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {size.label} ({size.value} MB)
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
