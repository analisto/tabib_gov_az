'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About MVP Marketplace</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed mb-6">
              MVP Marketplace is a community-driven platform where developers can discover, share, and showcase
              their code templates. Whether you're looking for a landing page, dashboard, or component library,
              we've got you covered.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We believe that developers should spend less time reinventing the wheel and more time building
              innovative solutions. MVP Marketplace provides a curated marketplace of high-quality code templates
              to accelerate your development process.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why MVP Marketplace?</h2>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Curated collection of production-ready templates</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Built by developers, for developers</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Easy discovery with powerful search and filtering</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Community-driven platform with regular updates</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Get Started</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Ready to explore? Browse our collection of templates or create an account to start sharing
              your own work with the community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/templates"
                className="px-6 py-3 text-center text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Browse Templates
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 text-center text-base font-semibold text-indigo-600 bg-white border-2 border-indigo-600 rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
