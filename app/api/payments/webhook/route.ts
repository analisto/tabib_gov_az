import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyWebhookSignature, parseLemonSqueezyStatus } from '@/lib/lemonsqueezy'

/**
 * LemonSqueezy payment webhook
 * This endpoint receives payment status updates from LemonSqueezy
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-signature')

    if (!signature) {
      console.error('Missing webhook signature')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 403 }
      )
    }

    // Verify the signature to ensure the request is from LemonSqueezy
    const isValid = verifyWebhookSignature(rawBody, signature)

    if (!isValid) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      )
    }

    const body = JSON.parse(rawBody)
    const eventName = body.meta?.event_name

    // Handle order created/paid events
    if (eventName === 'order_created' || eventName === 'order_paid') {
      const orderData = body.data
      const customData = orderData.attributes?.first_order_item?.custom_data
      const orderId = customData?.order_id

      if (!orderId) {
        console.error('Order ID not found in webhook data')
        return NextResponse.json(
          { error: 'Order ID not found' },
          { status: 400 }
        )
      }

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
      const status = parseLemonSqueezyStatus(orderData.attributes.status)

      // Update purchase record
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: {
          status,
          paymentMethod: 'lemonsqueezy',
          transactionId: orderData.id,
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

      console.log('LemonSqueezy webhook processed:', {
        orderId,
        status,
        eventName,
      })

      return NextResponse.json({
        success: true,
        orderId,
        status,
      })
    }

    // Handle subscription events if needed in the future
    if (eventName?.startsWith('subscription_')) {
      console.log('Subscription event received:', eventName)
      return NextResponse.json({
        success: true,
        message: 'Subscription events not implemented yet',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook received',
    })
  } catch (error) {
    console.error('LemonSqueezy webhook error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process webhook',
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
    message: 'LemonSqueezy webhook endpoint',
    status: 'active',
  })
}
