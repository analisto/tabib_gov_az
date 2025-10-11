import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadToR2 } from '@/lib/r2'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const allowedZipTypes = ['application/zip', 'application/x-zip-compressed']
    const isImage = allowedImageTypes.includes(file.type)
    const isZip = allowedZipTypes.includes(file.type) || file.name.endsWith('.zip')

    if (!isImage && !isZip) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images (JPEG, PNG, WebP, GIF) and ZIP files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (5MB for images, 50MB for zips)
    const maxSize = isZip ? 50 * 1024 * 1024 : 5 * 1024 * 1024 // 50MB for zip, 5MB for images
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds ${isZip ? '50MB' : '5MB'} limit` },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const extension = file.name.split('.').pop()
    const key = `templates/${session.user.id}/${timestamp}-${randomString}.${extension}`

    // Upload to R2 with correct content type
    const contentType = isZip ? 'application/zip' : file.type
    const url = await uploadToR2(buffer, key, contentType)

    return NextResponse.json({ url }, { status: 200 })
  } catch (error: any) {
    console.error('Upload error:', error)

    // Provide more specific error messages based on the error type
    if (error.name === 'AccessDenied' || error.Code === 'AccessDenied' || error.$metadata?.httpStatusCode === 403) {
      return NextResponse.json(
        {
          error: 'Image upload is temporarily unavailable. The storage service needs permission configuration. Please try again later or contact support.'
        },
        { status: 503 }
      )
    }

    if (error.name === 'NoSuchBucket') {
      return NextResponse.json(
        { error: 'Storage configuration error. Please contact support.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to upload file. Please try again.' },
      { status: 500 }
    )
  }
}
