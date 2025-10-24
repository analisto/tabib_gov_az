'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'

export default function EditTemplatePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const templateId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    demoUrl: '',
    githubUrl: '',
    techStack: '',
  })

  const [previewImage, setPreviewImage] = useState<File | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState('')
  const [existingPreviewImage, setExistingPreviewImage] = useState('')
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/templates/${templateId}`)
        if (!res.ok) {
          setError('Template not found')
          return
        }

        const template = await res.json()

        // Check if user owns this template
        if (template.userId !== session?.user?.id) {
          setError('You do not have permission to edit this template')
          return
        }

        setFormData({
          title: template.title || '',
          description: template.description || '',
          category: template.category || '',
          tags: template.tags?.join(', ') || '',
          demoUrl: template.demoUrl || '',
          githubUrl: template.githubUrl || '',
          techStack: template.techStack?.join(', ') || '',
        })

        setExistingPreviewImage(template.previewImage || '')
        setExistingImages(template.images || [])
      } catch (err) {
        setError('Failed to load template')
      } finally {
        setLoading(false)
      }
    }

    if (templateId && session?.user?.id) {
      fetchTemplate()
    }
  }, [templateId, session])

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await res.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      let finalPreviewImage = existingPreviewImage
      let finalAdditionalImages = existingImages

      // Upload new preview image if selected
      if (previewImage) {
        setUploadingImages(true)
        finalPreviewImage = await handleImageUpload(previewImage)
      }

      // Upload new additional images if selected
      if (additionalImages.length > 0) {
        setUploadingImages(true)
        const uploadedUrls = await Promise.all(
          additionalImages.map((file) => handleImageUpload(file))
        )
        finalAdditionalImages = [...existingImages, ...uploadedUrls]
      }

      setUploadingImages(false)

      // Update template
      const templateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        previewImage: finalPreviewImage,
        images: finalAdditionalImages,
        demoUrl: formData.demoUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        techStack: formData.techStack
          .split(',')
          .map((tech) => tech.trim())
          .filter(Boolean),
      }

      const res = await fetch(`/api/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to update template')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Failed to update template. Please try again.')
    } finally {
      setSaving(false)
      setUploadingImages(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Template</h1>
          <p className="mt-2 text-gray-600">
            Update your template information
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
              >
                <option value="">Select a category</option>
                <option value="saas">SaaS Platform</option>
                <option value="marketplace">Marketplace</option>
                <option value="e-commerce">E-commerce</option>
                <option value="social-media">Social Media</option>
                <option value="dashboard">Dashboard / Analytics</option>
                <option value="landing-page">Landing Page</option>
                <option value="blog">Blog / CMS</option>
                <option value="portfolio">Portfolio</option>
                <option value="booking">Booking / Scheduling</option>
                <option value="crm">CRM</option>
                <option value="admin">Admin Panel</option>
                <option value="api">API / Backend</option>
                <option value="mobile-app">Mobile App</option>
                <option value="ai-ml">AI / ML Application</option>
                <option value="components">UI Components / Library</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700"
              >
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="react, nextjs, tailwind"
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="techStack"
                className="block text-sm font-medium text-gray-700"
              >
                Tech Stack (comma-separated) *
              </label>
              <input
                type="text"
                id="techStack"
                required
                value={formData.techStack}
                onChange={(e) =>
                  setFormData({ ...formData, techStack: e.target.value })
                }
                placeholder="Next.js, TypeScript, Tailwind CSS"
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="previewImage"
                className="block text-sm font-medium text-gray-700"
              >
                Preview Image {existingPreviewImage && '(optional - leave blank to keep current)'}
              </label>
              {existingPreviewImage && !previewImageUrl && (
                <img
                  src={existingPreviewImage}
                  alt="Current preview"
                  className="mt-2 max-w-full h-48 object-cover rounded-md"
                />
              )}
              <input
                type="file"
                id="previewImage"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setPreviewImage(file)
                    setPreviewImageUrl(URL.createObjectURL(file))
                  }
                }}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {previewImageUrl && (
                <img
                  src={previewImageUrl}
                  alt="New preview"
                  className="mt-4 max-w-full h-48 object-cover rounded-md"
                />
              )}
            </div>

            <div>
              <label
                htmlFor="additionalImages"
                className="block text-sm font-medium text-gray-700"
              >
                Additional Images (optional)
              </label>
              {existingImages.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {existingImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Additional ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
              <input
                type="file"
                id="additionalImages"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  setAdditionalImages(files)
                }}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="demoUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Demo URL (optional)
              </label>
              <input
                type="url"
                id="demoUrl"
                value={formData.demoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, demoUrl: e.target.value })
                }
                placeholder="https://example.com"
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="githubUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Repository / Code Link (optional)
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Link to GitHub, GitLab, Google Drive, Dropbox, or any code hosting platform
              </p>
              <input
                type="url"
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
                placeholder="https://github.com/username/repo or https://drive.google.com/..."
                className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving || uploadingImages}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {uploadingImages
                  ? 'Uploading images...'
                  : saving
                  ? 'Saving...'
                  : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
