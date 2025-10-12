import {
  lemonSqueezySetup,
  createCheckout,
  getCheckout,
} from '@lemonsqueezy/lemonsqueezy.js'
import crypto from 'crypto'

// LemonSqueezy configuration
const LEMONSQUEEZY_CONFIG = {
  apiKey: process.env.LEMONSQUEEZY_API_KEY || '',
  storeId: process.env.LEMONSQUEEZY_STORE_ID || '',
  webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '',
}

// Initialize LemonSqueezy
lemonSqueezySetup({
  apiKey: LEMONSQUEEZY_CONFIG.apiKey,
  onError: (error) => {
    console.error('LemonSqueezy Error:', error)
  },
})

interface CheckoutParams {
  productId: string
  variantId: string
  orderId: string
  amount: number
  description: string
  userEmail: string
  userName?: string
  customData?: Record<string, any>
}

interface CheckoutResponse {
  success: boolean
  checkoutUrl?: string
  checkoutId?: string
  error?: string
}

/**
 * Create a LemonSqueezy checkout session
 */
export async function createLemonSqueezyCheckout(
  params: CheckoutParams
): Promise<CheckoutResponse> {
  try {
    const checkoutData = {
      productOptions: {
        enabledVariants: [params.variantId],
      },
      checkoutOptions: {
        embed: false,
        media: true,
        logo: true,
      },
      checkoutData: {
        email: params.userEmail,
        name: params.userName || '',
        custom: {
          order_id: params.orderId,
          ...params.customData,
        },
      },
      expiresAt: null,
      preview: false,
      testMode: process.env.NODE_ENV !== 'production',
    }

    const response = await createCheckout(
      LEMONSQUEEZY_CONFIG.storeId,
      params.variantId,
      checkoutData
    )

    if (response.error) {
      return {
        success: false,
        error: response.error.message || 'Failed to create checkout',
      }
    }

    return {
      success: true,
      checkoutUrl: response.data?.data.attributes.url,
      checkoutId: response.data?.data.id,
    }
  } catch (error) {
    console.error('LemonSqueezy checkout creation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Verify LemonSqueezy webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', LEMONSQUEEZY_CONFIG.webhookSecret)
    const digest = hmac.update(payload).digest('hex')
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(digest)
    )
  } catch (error) {
    console.error('Webhook signature verification error:', error)
    return false
  }
}

/**
 * Parse LemonSqueezy order status
 */
export function parseLemonSqueezyStatus(
  status: string
): 'pending' | 'completed' | 'failed' {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'active':
      return 'completed'
    case 'pending':
    case 'on_trial':
      return 'pending'
    case 'cancelled':
    case 'expired':
    case 'failed':
    case 'refunded':
    default:
      return 'failed'
  }
}

/**
 * Get checkout details
 */
export async function getLemonSqueezyCheckout(checkoutId: string) {
  try {
    const response = await getCheckout(checkoutId)

    if (response.error) {
      return {
        success: false,
        error: response.error.message || 'Failed to get checkout',
      }
    }

    return {
      success: true,
      data: response.data?.data,
    }
  } catch (error) {
    console.error('Get checkout error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
