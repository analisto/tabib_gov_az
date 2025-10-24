import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { action } = body // 'view', 'email_reveal', 'phone_reveal'

    // Check if template exists
    const template = await prisma.template.findUnique({
      where: { id },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Get or create analytics record
    let analytics = await prisma.templateAnalytics.findUnique({
      where: { templateId: id },
    })

    if (!analytics) {
      analytics = await prisma.templateAnalytics.create({
        data: {
          templateId: id,
        },
      })
    }

    // Update analytics based on action
    switch (action) {
      case 'view':
        await prisma.templateAnalytics.update({
          where: { templateId: id },
          data: {
            totalViews: { increment: 1 },
            uniqueViews: { increment: 1 },
            lastViewedAt: new Date(),
          },
        })
        // Also update the template's view count for backward compatibility
        await prisma.template.update({
          where: { id },
          data: {
            views: { increment: 1 },
          },
        })
        break

      case 'email_reveal':
        await prisma.templateAnalytics.update({
          where: { templateId: id },
          data: {
            emailReveals: { increment: 1 },
          },
        })
        break

      case 'phone_reveal':
        await prisma.templateAnalytics.update({
          where: { templateId: id },
          data: {
            phoneReveals: { increment: 1 },
          },
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const analytics = await prisma.templateAnalytics.findUnique({
      where: { templateId: id },
      include: {
        template: {
          select: {
            title: true,
            userId: true,
          },
        },
      },
    })

    if (!analytics) {
      return NextResponse.json(
        { error: 'Analytics not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
