import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ hasPurchased: false })
    }

    const { searchParams } = new URL(req.url)
    const templateId = searchParams.get('templateId')

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    // Check if user has a completed purchase for this template
    const purchase = await prisma.purchase.findFirst({
      where: {
        templateId,
        userId: session.user.id,
        status: 'completed',
      },
    })

    return NextResponse.json({
      hasPurchased: !!purchase,
      purchaseDate: purchase?.createdAt,
    })
  } catch (error) {
    console.error('Failed to check purchase status:', error)
    return NextResponse.json(
      {
        error: 'Failed to check purchase status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
