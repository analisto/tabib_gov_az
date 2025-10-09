'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

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
  user: {
    id: string
    name: string
    image?: string
  }
  createdAt: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const url = selectedCategory
          ? `/api/templates?category=${selectedCategory}`
          : '/api/templates'
        const res = await fetch(url)
        const data = await res.json()
        setTemplates(data)
      } catch (error) {
        console.error('Failed to fetch templates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [selectedCategory])

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'landing-page', label: 'Landing Page' },
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'e-commerce', label: 'E-commerce' },
    { value: 'blog', label: 'Blog' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'admin', label: 'Admin Panel' },
    { value: 'components', label: 'Components' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Templates</h1>
          <p className="mt-2 text-gray-600">
            Discover amazing code templates from the community
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="category" className="sr-only">
            Filter by category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Loading templates...</div>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No templates found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try selecting a different category or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Link
                key={template.id}
                href={`/templates/${template.id}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={template.previewImage}
                  alt={template.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {template.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.techStack.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                    {template.techStack.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        +{template.techStack.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {template.user.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-600">
                        {template.user.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{template.views} views</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
