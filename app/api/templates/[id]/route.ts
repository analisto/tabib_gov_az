import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { deleteFromR2 } from '@/lib/r2'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const template = await prisma.template.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            bio: true,
            website: true,
            github: true,
            twitter: true,
          },
        },
        analytics: true,
      },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Note: View tracking is now handled by the analytics API endpoint
    // This prevents double-counting of views

    return NextResponse.json(template)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    // Check if template exists and user owns it
    const template = await prisma.template.findUnique({
      where: { id },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    if (template.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this template' },
        { status: 403 }
      )
    }

    // Update template
    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        tags: body.tags,
        techStack: body.techStack,
        demoUrl: body.demoUrl,
        githubUrl: body.githubUrl,
        previewImage: body.previewImage,
        images: body.images,
      },
    })

    return NextResponse.json(updatedTemplate)
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if template exists and user owns it
    const template = await prisma.template.findUnique({
      where: { id },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    if (template.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this template' },
        { status: 403 }
      )
    }

    // Delete images from R2
    try {
      // Extract key from preview image URL
      if (template.previewImage) {
        const previewKey = template.previewImage.split('.r2.dev/')[1]
        if (previewKey) {
          await deleteFromR2(previewKey)
        }
      }

      // Delete additional images
      if (template.images && template.images.length > 0) {
        for (const imageUrl of template.images) {
          const key = imageUrl.split('.r2.dev/')[1]
          if (key) {
            await deleteFromR2(key)
          }
        }
      }
    } catch (error) {
      console.error('Failed to delete images from R2:', error)
      // Continue with template deletion even if image deletion fails
    }

    // Delete template from database
    await prisma.template.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
