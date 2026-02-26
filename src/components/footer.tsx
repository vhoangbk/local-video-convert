'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-700">
              Local<span className="text-primary-500">Convert</span>
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-slate-500 hover:text-primary-500 transition-colors">
              Home
            </Link>
            <a href="#" className="text-slate-500 hover:text-primary-500 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-slate-500 hover:text-primary-500 transition-colors">
              Terms
            </a>
            <a href="#" className="text-slate-500 hover:text-primary-500 transition-colors">
              Contact
            </a>
          </nav>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} LocalConvert. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
