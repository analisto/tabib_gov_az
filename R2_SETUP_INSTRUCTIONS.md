# Cloudflare R2 Upload Fix Required

## Current Issue
The `/api/upload` endpoint is returning a **503 error** with `AccessDenied` from Cloudflare R2. This means the current R2 API token doesn't have the necessary permissions to upload files to the bucket.

## Error Details
```
Upload error: [AccessDenied: Access Denied] {
  '$fault': 'client',
  Code: 'AccessDenied'
}
```

## How to Fix

### Option 1: Update R2 API Token Permissions (Recommended)

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Navigate to R2 → Overview

2. **Create a New API Token**
   - Go to "Manage R2 API Tokens"
   - Click "Create API token"
   - Set permissions to **"Admin Read & Write"** or **"Object Read & Write"**
   - Select the bucket: `codeplace`
   - Click "Create API Token"

3. **Update Environment Variables**
   - Copy the new Access Key ID and Secret Access Key
   - Update your `.env` file or Vercel environment variables:
   ```bash
   R2_ACCESS_KEY_ID="<new-access-key-id>"
   R2_SECRET_ACCESS_KEY="<new-secret-access-key>"
   ```

4. **Redeploy**
   - If using Vercel: Push to git or manually redeploy
   - If running locally: Restart the Next.js dev server

### Option 2: Use a Different Bucket

If you don't have access to modify the `codeplace` bucket permissions:

1. Create a new R2 bucket with your own credentials
2. Update all R2 environment variables in `.env`:
   ```bash
   R2_ACCOUNT_ID="<your-account-id>"
   R2_ACCESS_KEY_ID="<your-access-key-id>"
   R2_SECRET_ACCESS_KEY="<your-secret-access-key>"
   R2_BUCKET_NAME="<your-new-bucket-name>"
   R2_PUBLIC_URL="https://<your-bucket>.r2.dev"
   ```

### Option 3: Temporary Workaround - Use Alternative Storage

Until R2 is fixed, you could temporarily switch to:
- **Vercel Blob Storage** (simpler, built for Next.js)
- **Cloudinary** (free tier available)
- **UploadThing** (developer-friendly)

## Current Configuration

From `.env`:
```
R2_ACCOUNT_ID="612eb8c2fbc8d81e98c37a03e49f4a8f"
R2_ACCESS_KEY_ID="07b8f0404f648ea34abb42fe76ea7ef2"
R2_SECRET_ACCESS_KEY="7c82cf4add205752a2233085c0924486d6aefdd48b822dd000bef3f2c0c0e166"
R2_BUCKET_NAME="codeplace"
R2_PUBLIC_URL="https://pub-bed26d99fd8b45e6a2e92e149128fa9b.r2.dev"
```

## User Experience

Users currently see this error message when trying to upload:
> "Image upload is temporarily unavailable. The storage service needs permission configuration. Please try again later or contact support."

This is a user-friendly error that doesn't expose technical details.

## Files Modified

- `/app/api/upload/route.ts` - Added better error handling for R2 AccessDenied errors
- Returns 503 status code with clear messaging when R2 permissions are insufficient

## Next Steps

1. Fix R2 permissions using Option 1 above (recommended)
2. Test upload functionality on the `/dashboard/upload` page
3. Verify images are accessible via the public URL
