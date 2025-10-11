import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPaymentCallback, parsePaymentStatus } from '@/lib/epoint'

/**
 * Epoint payment result webhook
 * This endpoint receives payment status updates from Epoint
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Verify the signature to ensure the request is from Epoint
    const isValid = verifyPaymentCallback(body)

    if (!isValid) {
      console.error('Invalid payment callback signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      )
    }

    // Extract payment details from callback
    const {
      order_id: orderId,
      epoint_order_id: epointOrderId,
      status: paymentStatus,
      amount,
      currency,
      payment_method: paymentMethod,
      transaction_id: transactionId,
    } = body

    // Find the purchase by order ID
    const purchase = await prisma.purchase.findUnique({
      where: { orderId },
      include: {
        template: true,
      },
    })

    if (!purchase) {
      console.error('Purchase not found:', orderId)
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      )
    }

    // Parse payment status
    const status = parsePaymentStatus(paymentStatus)

    // Update purchase record
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        epointOrderId,
        status,
        paymentMethod,
        transactionId,
        updatedAt: new Date(),
      },
    })

    // If payment is completed, increment download count for the template
    if (status === 'completed') {
      await prisma.template.update({
        where: { id: purchase.templateId },
        data: {
          downloads: {
            increment: 1,
          },
        },
      })

      // Also update analytics if it exists
      const analytics = await prisma.templateAnalytics.findUnique({
        where: { templateId: purchase.templateId },
      })

      if (analytics) {
        await prisma.templateAnalytics.update({
          where: { templateId: purchase.templateId },
          data: {
            totalDownloads: {
              increment: 1,
            },
          },
        })
      }
    }

    console.log('Payment webhook processed:', {
      orderId,
      status,
      amount,
      currency,
    })

    // Return success response to Epoint
    return NextResponse.json({
      success: true,
      orderId,
      status,
    })
  } catch (error) {
    console.error('Payment webhook error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process payment webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Handle GET requests (for testing)
 */
export async function GET() {
  return NextResponse.json({
    message: 'Payment result webhook endpoint',
    status: 'active',
  })
}
