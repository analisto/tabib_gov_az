import crypto from 'crypto'

// Epoint configuration
const EPOINT_CONFIG = {
  publicKey: process.env.EPOINT_PUBLIC_KEY || '',
  privateKey: process.env.EPOINT_PRIVATE_KEY || '',
  apiUrl: process.env.EPOINT_API_URL || 'https://api.epoint.az',
  merchantId: process.env.EPOINT_MERCHANT_ID || '',
}

interface PaymentInitiationParams {
  orderId: string
  amount: number // in AZN
  currency?: string
  description: string
  language?: 'az' | 'en' | 'ru'
  successUrl: string
  errorUrl: string
  resultUrl: string
}

interface PaymentInitiationResponse {
  success: boolean
  paymentUrl?: string
  error?: string
  transactionId?: string
}

/**
 * Generate HMAC signature for Epoint API request
 */
function generateSignature(data: Record<string, any>): string {
  const sortedKeys = Object.keys(data).sort()
  const signatureString = sortedKeys
    .map((key) => `${key}=${data[key]}`)
    .join('&')

  return crypto
    .createHmac('sha256', EPOINT_CONFIG.privateKey)
    .update(signatureString)
    .digest('hex')
}

/**
 * Initiate payment with Epoint
 */
export async function initiatePayment(
  params: PaymentInitiationParams
): Promise<PaymentInitiationResponse> {
  try {
    // Prepare payment data
    const paymentData = {
      public_key: EPOINT_CONFIG.publicKey,
      amount: Math.round(params.amount * 100), // Convert to cents
      currency: params.currency || 'AZN',
      order_id: params.orderId,
      description: params.description,
      language: params.language || 'en',
      success_url: params.successUrl,
      error_url: params.errorUrl,
      result_url: params.resultUrl,
    }

    // Generate signature
    const signature = generateSignature(paymentData)

    // Make API request to Epoint
    const response = await fetch(`${EPOINT_CONFIG.apiUrl}/payment/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...paymentData,
        signature,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.message || 'Failed to initiate payment',
      }
    }

    const data = await response.json()

    return {
      success: true,
      paymentUrl: data.payment_url,
      transactionId: data.transaction_id,
    }
  } catch (error) {
    console.error('Epoint payment initiation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Verify payment callback signature
 */
export function verifyPaymentCallback(data: Record<string, any>): boolean {
  try {
    const receivedSignature = data.signature
    delete data.signature // Remove signature from data before verification

    const calculatedSignature = generateSignature(data)

    return receivedSignature === calculatedSignature
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

/**
 * Parse payment status from Epoint
 */
export function parsePaymentStatus(status: string): 'pending' | 'completed' | 'failed' {
  switch (status.toLowerCase()) {
    case 'success':
    case 'approved':
    case 'completed':
      return 'completed'
    case 'pending':
    case 'processing':
      return 'pending'
    case 'failed':
    case 'declined':
    case 'error':
    default:
      return 'failed'
  }
}
