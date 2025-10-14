'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

interface Template {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  previewImage: string
  techStack: string[]
  views: number
  downloads: number
  featured: boolean
  price: number
  isPaid: boolean
  user: {
    id: string
    name: string | null
    image: string | null
  }
  analytics?: {
    totalViews: number
    uniqueViews: number
    emailReveals: number
    phoneReveals: number
    totalDownloads: number
  }
  createdAt: string
}

const categories = [
  'All',
  'Landing Page',
  'Dashboard',
  'E-commerce',
  'Blog',
  'Portfolio',
  'Admin Panel',
  'Authentication',
  'Components',
  'Other'
]

export default function TemplatesPage() {
  const { data: session } = useSession()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates')
      if (res.ok) {
        const data = await res.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        template.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === 'popular') {
        return b.views - a.views
      } else if (sortBy === 'downloads') {
        return b.downloads - a.downloads
      }
      return 0
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold gradient-text">MVP Marketplace</h1>
            </Link>
            <div className="flex gap-3">
              {session ? (
                <>
                  <Link
                    href="/dashboard/upload"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors hidden sm:block"
                  >
                    Upload
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors hidden sm:block"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Browse <span className="gradient-text">Full-Stack Projects</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover production-ready web apps and MVPs from our community of developers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 animate-fade-in">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            {/* Category Dropdown */}
            <div className="flex items-center gap-3 flex-1">
              <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 sm:flex-initial px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm cursor-pointer hover:border-indigo-300 transition-colors"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm cursor-pointer hover:border-indigo-300 transition-colors"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="downloads">Most Downloaded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredTemplates.length}</span> project{filteredTemplates.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your search or filters</p>
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Be the first to upload!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {filteredTemplates.map((template, index) => (
              <Link
                key={template.id}
                href={`/templates/${template.id}`}
                className="group card-hover bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-violet-100 to-indigo-100 overflow-hidden">
                  {template.previewImage ? (
                    <Image
                      src={template.previewImage}
                      alt={template.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-20 h-20 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                    {template.featured && (
                      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ⭐ Featured
                      </div>
                    )}
                    {template.isPaid && Number(template.price) > 0 ? (
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-base font-bold px-4 py-2 rounded-full shadow-xl">
                        ${Number(template.price).toFixed(2)}
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-base font-bold px-4 py-2 rounded-full shadow-xl">
                        FREE
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-3">
                    {template.title}
                  </h3>

                  {/* Price Display */}
                  <div className="mb-3">
                    {template.isPaid && Number(template.price) > 0 ? (
                      <div className="inline-flex items-center gap-2 bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-1.5">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xl font-bold text-emerald-700">${Number(template.price).toFixed(2)}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-blue-50 border-2 border-blue-200 rounded-lg px-3 py-1.5">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                        <span className="text-xl font-bold text-blue-700">FREE</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.techStack.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {template.techStack.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{template.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Analytics Section */}
                  <div className="mb-4 p-3 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-lg border border-indigo-100/50">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-gray-700 font-semibold">{template.analytics?.totalViews || template.views}</span>
                        <span className="text-gray-600">views</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="text-gray-700 font-semibold">{template.analytics?.totalDownloads || template.downloads}</span>
                        <span className="text-gray-600">downloads</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700 font-semibold">{template.analytics?.emailReveals || 0}</span>
                        <span className="text-gray-600">emails</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-700 font-semibold">{template.analytics?.phoneReveals || 0}</span>
                        <span className="text-gray-600">phones</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {template.user.image ? (
                        <Image
                          src={template.user.image}
                          alt={template.user.name || 'User'}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gradient-to-br from-violet-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {template.user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <span className="text-sm text-gray-600 truncate">{template.user.name || 'Anonymous'}</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                      {template.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-lg border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} MVP Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
