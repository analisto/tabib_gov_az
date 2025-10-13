# LemonSqueezy Setup Guide for Dynamic Pricing

## ✅ What's Configured

Your marketplace is set up to accept **DYNAMIC PRICING** with LemonSqueezy:
- ✅ Users upload templates with ANY price (e.g., $5, $15, $99)
- ✅ Prices are set in YOUR database, NOT in LemonSqueezy
- ✅ ONE product in LemonSqueezy handles ALL templates
- ✅ International payments accepted (190+ countries)
- ✅ Multiple currencies supported

## 🚀 Setup Steps in LemonSqueezy Dashboard

### Step 1: Create Your Store
1. Go to https://app.lemonsqueezy.com
2. Create a new store (if you haven't already)
3. Copy your **Store ID** from Settings → Stores
4. Update `.env`: `LEMONSQUEEZY_STORE_ID="230369"` ✅ (Already set!)

### Step 2: Create ONE Product with Variable Pricing

This is the KEY step for dynamic pricing:

1. **Go to Products → Add Product**
2. **Product Details:**
   - Name: `Code Template`
   - Description: `Premium code template from our marketplace`

3. **Pricing Settings:**
   - Enable "Pay what you want" pricing
   - Or set a base price like $1 (it will be overridden)
   - Currency: USD

4. **Create a Variant:**
   - Go to Variants tab
   - Add variant: `Digital Download`
   - **IMPORTANT**: Enable "Allow custom price" or "Pay what you want"

5. **Copy IDs:**
   - Copy **Product ID** from the URL: `https://app.lemonsqueezy.com/products/{PRODUCT_ID}`
   - Copy **Variant ID** from the variant settings

6. **Update `.env`:**
   ```env
   LEMONSQUEEZY_PRODUCT_ID="your-product-id"
   LEMONSQUEEZY_VARIANT_ID="your-variant-id"
   ```

### Step 3: Setup Webhook

1. **Go to Settings → Webhooks**
2. **Add new webhook:**
   - URL: `https://www.mwp.codes/api/payments/webhook`
   - Events to subscribe:
     - ✅ `order_created`
     - ✅ `order_paid`
   - Click "Create Webhook"

3. **Copy Webhook Secret:**
   - Click on the webhook you just created
   - Copy the "Signing Secret"

4. **Update `.env`:**
   ```env
   LEMONSQUEEZY_WEBHOOK_SECRET="your-webhook-secret"
   ```

### Step 4: Get API Key

1. **Go to Settings → API**
2. **Create new API key:**
   - Name: `Marketplace API`
   - Permissions: Full access (or at least: checkouts, orders)
3. **Copy API Key**
4. **Update `.env`:**
   ```env
   LEMONSQUEEZY_API_KEY="eyJ0eXAi..." ✅ (Already set!)
   ```

## 📋 Final .env Configuration

Your `.env` should look like this:

```env
# LemonSqueezy Payment Gateway (International Payments)
LEMONSQUEEZY_API_KEY="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..."  # ✅ Done
LEMONSQUEEZY_STORE_ID="230369"                                   # ✅ Done
LEMONSQUEEZY_PRODUCT_ID="123456"                                 # ⚠️ TODO
LEMONSQUEEZY_VARIANT_ID="789012"                                 # ⚠️ TODO
LEMONSQUEEZY_WEBHOOK_SECRET="whsec_..."                          # ⚠️ TODO
```

## 🎯 How It Works

### Upload Flow:
1. User goes to `/dashboard/upload`
2. Sets template details
3. **Sets price: $15** (or any amount)
4. Price is saved in YOUR database

### Purchase Flow:
1. Buyer visits template page
2. Sees: **"$15 USD - One-time purchase"**
3. Clicks "Purchase & Download"
4. System creates LemonSqueezy checkout with:
   - Your ONE product/variant
   - Custom data including the $15 price
5. Buyer pays $15 on LemonSqueezy
6. Webhook confirms payment
7. Download unlocked

### Key Points:
- ✅ **NO need** to create 100 products for 100 templates
- ✅ **ONE product** handles everything
- ✅ **Dynamic pricing** comes from your database
- ✅ LemonSqueezy handles international payments, taxes, VAT

## 🧪 Testing

### Test Mode:
- Set `NODE_ENV=development` (already default)
- Use LemonSqueezy test mode
- Test credit card: `4242 4242 4242 4242`

### Production:
- Set `NODE_ENV=production`
- Use live API keys
- Real payments processed

## 🔍 Troubleshooting

### "LemonSqueezy product not configured"
- Make sure `LEMONSQUEEZY_VARIANT_ID` is set in `.env`

### Webhook not working:
- Check webhook URL is correct: `https://www.mwp.codes/api/payments/webhook`
- Verify webhook secret matches `.env`
- Check webhook logs in LemonSqueezy dashboard

### Price not showing correctly:
- Ensure variant has "Pay what you want" enabled
- Check template price is saved correctly in database

## 📊 Fees

- **LemonSqueezy**: 5% + $0.50 per transaction
- **Payment processor**: ~2.9% + $0.30
- **Total**: ~7.9% + $0.80 per transaction

Example: $15 template = $13.81 after fees

## 🎉 Benefits

- ✅ International payments (190+ countries)
- ✅ VAT/Tax compliance handled automatically
- ✅ Multiple currencies
- ✅ Professional checkout experience
- ✅ Fraud protection included
- ✅ Works from Azerbaijan
- ✅ Dynamic pricing per template
- ✅ Simple setup (ONE product for all)

## 📞 Support

- LemonSqueezy Docs: https://docs.lemonsqueezy.com
- API Reference: https://docs.lemonsqueezy.com/api
- Support: https://app.lemonsqueezy.com/support
