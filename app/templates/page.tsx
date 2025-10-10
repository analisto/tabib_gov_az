'use client'

import { useState, useEffect } from 'react'
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
  user: {
    id: string
    name: string | null
    image: string | null
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
              <h1 className="text-2xl font-bold gradient-text">TemplateHub</h1>
            </Link>
            <div className="flex gap-3">
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
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Browse <span className="gradient-text">Templates</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing code templates from our community of developers
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
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Category Filter and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
            Showing <span className="font-semibold">{filteredTemplates.length}</span> template{filteredTemplates.length !== 1 ? 's' : ''}
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
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
                  {template.featured && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      ⭐ Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {template.title}
                    </h3>
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

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
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
                      <span className="text-sm text-gray-600">{template.user.name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {template.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {template.downloads}
                      </div>
                    </div>
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
          <p>&copy; {new Date().getFullYear()} TemplateHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
