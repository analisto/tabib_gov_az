'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'

export default function UploadTemplatePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    price: '0',
    isPaid: false,
  })

  const [previewImage, setPreviewImage] = useState<File | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState('')
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [zipFile, setZipFile] = useState<File | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

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
    setLoading(true)

    try {
      // Upload preview image
      if (!previewImage) {
        setError('Please select a preview image')
        setLoading(false)
        return
      }

      setUploadingImages(true)
      const previewImageUrl = await handleImageUpload(previewImage)

      // Upload additional images
      const additionalImageUrls = await Promise.all(
        additionalImages.map((file) => handleImageUpload(file))
      )

      // Upload zip file if provided
      let downloadUrl: string | undefined = undefined
      if (zipFile) {
        downloadUrl = await handleImageUpload(zipFile)
      }

      setUploadingImages(false)

      // Create template
      const templateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        previewImage: previewImageUrl,
        images: additionalImageUrls,
        demoUrl: formData.demoUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        downloadUrl: downloadUrl,
        techStack: formData.techStack
          .split(',')
          .map((tech) => tech.trim())
          .filter(Boolean),
        price: parseFloat(formData.price),
        isPaid: formData.isPaid,
      }

      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create template')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Failed to upload template. Please try again.')
    } finally {
      setLoading(false)
      setUploadingImages(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Template</h1>
          <p className="mt-2 text-gray-600">
            Share your code template with the community
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
                <option value="landing-page">Landing Page</option>
                <option value="dashboard">Dashboard</option>
                <option value="e-commerce">E-commerce</option>
                <option value="blog">Blog</option>
                <option value="portfolio">Portfolio</option>
                <option value="admin">Admin Panel</option>
                <option value="components">Components</option>
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
                Preview Image *
              </label>
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
                  alt="Preview"
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
                GitHub URL (optional)
              </label>
              <input
                type="url"
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
                placeholder="https://github.com/username/repo"
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="zipFile"
                className="block text-sm font-medium text-gray-700"
              >
                Download Package (optional)
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Upload a .zip file of your template code for users to download
              </p>
              <input
                type="file"
                id="zipFile"
                accept=".zip"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setZipFile(file)
                  }
                }}
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {zipFile && (
                <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {zipFile.name} ({(zipFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            {/* Pricing Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="pricing"
                      checked={!formData.isPaid}
                      onChange={() => setFormData({ ...formData, isPaid: false, price: '0' })}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Free - Anyone can download
                    </span>
                  </label>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="pricing"
                      checked={formData.isPaid}
                      onChange={() => setFormData({ ...formData, isPaid: true })}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Paid - One-time purchase
                    </span>
                  </label>

                  {formData.isPaid && (
                    <div className="ml-6 flex items-center gap-2">
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                      />
                      <span className="text-sm font-medium text-gray-700">USD</span>
                      <p className="text-xs text-gray-500 ml-2">
                        International payments via LemonSqueezy
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {uploadingImages
                  ? 'Uploading images...'
                  : loading
                  ? 'Creating template...'
                  : 'Upload Template'}
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
