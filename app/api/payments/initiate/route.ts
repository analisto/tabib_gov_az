import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createLemonSqueezyCheckout } from '@/lib/lemonsqueezy'
import { z } from 'zod'

const initiatePaymentSchema = z.object({
  templateId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { templateId } = initiatePaymentSchema.parse(body)

    // Get template details
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Check if template is paid
    if (!template.isPaid || Number(template.price) <= 0) {
      return NextResponse.json(
        { error: 'This template is free to download' },
        { status: 400 }
      )
    }

    // Check if user already purchased this template
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        templateId,
        userId: session.user.id,
        status: 'completed',
      },
    })

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'You have already purchased this template' },
        { status: 400 }
      )
    }

    // Generate unique order ID
    const orderId = `TPL-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`

    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        orderId,
        templateId,
        userId: session.user.id,
        amount: template.price,
        currency: 'USD', // LemonSqueezy uses USD by default and handles conversion
        status: 'pending',
      },
    })

    // Create LemonSqueezy checkout
    // Note: You need to create a product and variant in LemonSqueezy dashboard
    // For now, we'll use environment variables for product/variant IDs
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID || ''

    if (!variantId) {
      return NextResponse.json(
        { error: 'LemonSqueezy product not configured' },
        { status: 500 }
      )
    }

    const checkoutResult = await createLemonSqueezyCheckout({
      productId: process.env.LEMONSQUEEZY_PRODUCT_ID || '',
      variantId,
      orderId,
      amount: Number(template.price),
      description: `Purchase: ${template.title}`,
      userEmail: session.user.email || '',
      userName: session.user.name || '',
      customData: {
        template_id: templateId,
        user_id: session.user.id,
      },
    })

    if (!checkoutResult.success) {
      // Update purchase status to failed
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: 'failed' },
      })

      return NextResponse.json(
        { error: checkoutResult.error || 'Failed to initiate payment' },
        { status: 500 }
      )
    }

    // Update purchase with LemonSqueezy checkout ID
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        epointOrderId: checkoutResult.checkoutId, // Reusing this field for LemonSqueezy checkout ID
      },
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutResult.checkoutUrl,
      orderId,
    })
  } catch (error) {
    console.error('Payment initiation error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to initiate payment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
