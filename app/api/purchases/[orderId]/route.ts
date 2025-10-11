import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await params

    // Find purchase by order ID
    const purchase = await prisma.purchase.findUnique({
      where: { orderId },
      include: {
        template: {
          select: {
            id: true,
            title: true,
            description: true,
            previewImage: true,
            downloadUrl: true,
            price: true,
            isPaid: true,
          },
        },
      },
    })

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      )
    }

    // Verify that the purchase belongs to the current user
    if (purchase.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have access to this purchase' },
        { status: 403 }
      )
    }

    return NextResponse.json(purchase)
  } catch (error) {
    console.error('Failed to fetch purchase:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch purchase details',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
