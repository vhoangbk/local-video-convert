'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6.5v11L12 22l8-4.5v-11L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polygon points="10,8 15,12 10,16" fill="white" />
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
