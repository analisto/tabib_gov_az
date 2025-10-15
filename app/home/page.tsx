'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Upload & Showcase',
      description: 'Share your code templates with the community. Include screenshots, descriptions, and tech stack details.',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Discover & Explore',
      description: 'Browse through a curated collection of code templates for various frameworks and use cases.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Build Faster',
      description: 'Accelerate your development with ready-to-use templates. Save time and focus on what truly matters.',
      gradient: 'from-pink-500 to-rose-500'
    }
  ]

  const stats = [
    { label: 'Templates', value: '500+' },
    { label: 'Developers', value: '10K+' },
    { label: 'Downloads', value: '50K+' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 animate-fade-in">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold gradient-text">MVP Marketplace</h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/templates" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                Templates
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                About
              </Link>
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  Get started
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-white/50"
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
                <Link href="/templates" className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white/50 rounded-md">
                  Templates
                </Link>
                <Link href="/about" className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white/50 rounded-md">
                  About
                </Link>
                <Link href="/login" className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white/50 rounded-md">
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-md text-center"
                >
                  Get started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-12 sm:pt-20 pb-12 sm:pb-16 text-center lg:pt-32">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white/60 rounded-full mb-6 sm:mb-8 shadow-sm">
              <span className="text-xs sm:text-sm font-medium text-indigo-600">✨ New templates added weekly</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight px-4">
              Discover Amazing
              <span className="block gradient-text mt-2">Code Templates</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Browse, share, and showcase your code templates. Build faster with
              pre-made solutions from the community. Join thousands of developers today.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start uploading free
              </Link>
              <Link
                href="/templates"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-indigo-600 bg-white rounded-xl hover:bg-gray-50 border-2 border-indigo-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Browse templates
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 sm:mt-20 grid grid-cols-3 gap-4 sm:gap-8 md:gap-16 animate-fade-in px-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-12 sm:py-20">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Why Choose MVP Marketplace?</h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">Everything you need to share and discover amazing code templates</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 px-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-hover bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 sm:mb-6 text-white shadow-md`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-12 sm:py-20 animate-fade-in px-4">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-12 sm:px-16 sm:py-16 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Ready to Share Your Templates?
              </h2>
              <p className="text-base sm:text-lg text-indigo-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join our growing community of developers and start showcasing your work today.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-indigo-600 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create free account
                <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-lg border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <span className="text-xl font-bold gradient-text">MVP Marketplace</span>
              </div>
              <p className="text-gray-600 max-w-md">
                The ultimate platform for discovering and sharing code templates. Built by developers, for developers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/templates" className="text-gray-600 hover:text-indigo-600 transition-colors">Templates</Link></li>
                <li><Link href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-600 hover:text-indigo-600 transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-indigo-600 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} MVP Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
