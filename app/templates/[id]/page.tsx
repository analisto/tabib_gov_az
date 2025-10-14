'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Template {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  previewImage: string
  images: string[]
  demoUrl?: string
  githubUrl?: string
  downloadUrl?: string
  techStack: string[]
  views: number
  downloads: number
  price: number
  isPaid: boolean
  user: {
    id: string
    name: string
    email: string
    phone?: string
    image?: string
    bio?: string
    website?: string
    github?: string
    twitter?: string
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

export default function TemplateDetailPage() {
  const params = useParams()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState('')
  const [showEmail, setShowEmail] = useState(false)
  const [showPhone, setShowPhone] = useState(false)

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/templates/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setTemplate(data)
          setSelectedImage(data.previewImage)

          // Track view
          trackAnalytics('view')
        }
      } catch (error) {
        console.error('Failed to fetch template:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTemplate()
    }
  }, [params.id])

  const trackAnalytics = async (action: 'view' | 'email_reveal' | 'phone_reveal' | 'download') => {
    try {
      await fetch(`/api/templates/${params.id}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })
    } catch (error) {
      console.error('Analytics tracking failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Template not found
            </h1>
            <p className="mt-2 text-gray-600">
              The template you're looking for doesn't exist.
            </p>
            <Link
              href="/templates"
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
            >
              ← Back to templates
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const allImages = [template.previewImage, ...template.images]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/templates"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            ← Back to projects
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <img
                src={selectedImage}
                alt={template.title}
                className="w-full h-96 object-cover"
              />
              {allImages.length > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2 overflow-x-auto">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                          selectedImage === image
                            ? 'border-indigo-600'
                            : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {template.title}
              </h1>

              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {template.category}
                </span>
                {template.isPaid && Number(template.price) > 0 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                    ${Number(template.price).toFixed(2)}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    FREE
                  </span>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{template.analytics?.totalViews || template.views} views</span>
                  <span>{template.analytics?.totalDownloads || template.downloads} downloads</span>
                </div>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700">{template.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {template.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {template.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  {template.demoUrl && (
                    <a
                      href={template.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {template.githubUrl && (
                    <a
                      href={template.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      View Code
                    </a>
                  )}
                </div>

                {/* Download or Contact to Purchase */}
                {template.downloadUrl && (
                  <>
                    {!template.isPaid || Number(template.price) === 0 ? (
                      // Free template - show download button
                      <a
                        href={template.downloadUrl}
                        download
                        onClick={() => trackAnalytics('download')}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-md"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download Source Code (.zip)
                      </a>
                    ) : (
                      // Paid template - show price and contact info
                      <div className="space-y-3">
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Purchase Price
                            </span>
                            <span className="text-2xl font-bold text-indigo-600">
                              ${Number(template.price).toFixed(2)} USD
                            </span>
                          </div>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-sm text-gray-700 mb-3">
                            To purchase this project, please contact the creator:
                          </p>
                          <div className="space-y-2">
                            <a
                              href={`mailto:${template.user.email}?subject=Purchase: ${template.title}&body=Hi, I'm interested in purchasing your project "${template.title}" for $${Number(template.price).toFixed(2)}.`}
                              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              Contact via Email
                            </a>
                            {template.user.phone && (
                              <a
                                href={`tel:${template.user.phone}`}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Call: {template.user.phone}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About the creator
              </h3>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  {template.user.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {template.user.name}
                  </h4>
                  {template.user.bio && (
                    <p className="text-sm text-gray-600 mt-1">
                      {template.user.bio}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {/* Email Contact */}
                <div>
                  <button
                    onClick={() => {
                      if (!showEmail) {
                        trackAnalytics('email_reveal')
                      }
                      setShowEmail(!showEmail)
                    }}
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500 w-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {showEmail ? 'Hide Email' : 'Show Email'}
                  </button>
                  {showEmail && (
                    <a
                      href={`mailto:${template.user.email}`}
                      className="ml-6 mt-1 block text-sm text-gray-700 hover:text-indigo-600"
                    >
                      {template.user.email}
                    </a>
                  )}
                </div>

                {/* Phone Contact */}
                {template.user.phone && (
                  <div>
                    <button
                      onClick={() => {
                        if (!showPhone) {
                          trackAnalytics('phone_reveal')
                        }
                        setShowPhone(!showPhone)
                      }}
                      className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500 w-full"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {showPhone ? 'Hide Phone' : 'Show Phone'}
                    </button>
                    {showPhone && (
                      <a
                        href={`tel:${template.user.phone}`}
                        className="ml-6 mt-1 block text-sm text-gray-700 hover:text-indigo-600"
                      >
                        {template.user.phone}
                      </a>
                    )}
                  </div>
                )}

                {template.user.website && (
                  <a
                    href={template.user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    Website
                  </a>
                )}
                {template.user.github && (
                  <a
                    href={`https://github.com/${template.user.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GitHub
                  </a>
                )}
                {template.user.twitter && (
                  <a
                    href={`https://twitter.com/${template.user.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    Twitter
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Info
              </h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500">Price</dt>
                  <dd className="text-gray-900 font-semibold">
                    {template.isPaid && Number(template.price) > 0
                      ? `$${Number(template.price).toFixed(2)} USD`
                      : 'Free'}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Uploaded</dt>
                  <dd className="text-gray-900">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Category</dt>
                  <dd className="text-gray-900">{template.category}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Views</dt>
                  <dd className="text-gray-900">{template.analytics?.totalViews || template.views}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Downloads</dt>
                  <dd className="text-gray-900">{template.analytics?.totalDownloads || template.downloads}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
