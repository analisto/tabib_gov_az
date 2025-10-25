import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const templateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()),
  previewImage: z.string().url('Invalid preview image URL'),
  images: z.array(z.string().url()),
  demoUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  techStack: z.array(z.string()),
  price: z.number().positive().optional().nullable(),
  isPaid: z.boolean().optional(),
})

// GET - Get all templates
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const userId = searchParams.get('userId')
    const featured = searchParams.get('featured')

    const where: any = {}

    if (category) {
      where.category = category
    }

    if (userId) {
      where.userId = userId
    }

    if (featured === 'true') {
      where.featured = true
    }

    const templates = await prisma.template.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        analytics: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Failed to fetch templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Create a new template
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = templateSchema.parse(body)

    const template = await prisma.template.create({
      data: {
        ...validatedData,
        demoUrl: validatedData.demoUrl || null,
        githubUrl: validatedData.githubUrl || null,
        price: validatedData.price ?? null,
        isPaid: validatedData.isPaid ?? false,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Failed to create template:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create template', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
