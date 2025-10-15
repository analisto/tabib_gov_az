'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="glass-effect border-b border-white/20 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold gradient-text whitespace-nowrap">MVP Marketplace</h1>
            </Link>
            <div className="hidden md:flex gap-6">
              <Link
                href="/templates"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Browse
              </Link>
              {session && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex gap-2 sm:gap-3 items-center">
            {session ? (
              <>
                <Link
                  href="/dashboard/upload"
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Upload
                </Link>
                <Link
                  href="/profile"
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-white/50 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in-up">
            <div className="flex flex-col space-y-3">
              <Link href="/templates" className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white/50 rounded-md transition-colors">
                Browse Templates
              </Link>
              {session ? (
                <>
                  <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white/50 rounded-md transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/upload" className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white/50 rounded-md transition-colors">
                    Upload Project
                  </Link>
                  <Link href="/profile" className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white/50 rounded-md transition-colors">
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md text-left transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white/50 rounded-md transition-colors">
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-md text-center transition-colors"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
