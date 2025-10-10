# Environment Configuration Guide

## Session Persistence Fix

The session persistence issue has been resolved with the following changes:

### Changes Made

1. **Cookie Configuration** (`lib/auth.ts`):
   - Added explicit cookie settings for session tokens
   - Configured `httpOnly: true` for security
   - Set `sameSite: 'lax'` for cross-site compatibility
   - Cookie maxAge set to 30 days
   - Automatic secure cookie in production

2. **Session Settings**:
   - `maxAge`: 30 days (how long the session lasts)
   - `updateAge`: 24 hours (how often the session token is refreshed)

3. **Environment Variables**:
   - Local development: `NEXTAUTH_URL="http://localhost:3000"`
   - Production: `NEXTAUTH_URL="https://codeplace.vercel.app"`

## Environment Variable Setup

### For Local Development

Your `.env` file should have:
```bash
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="W1liYOk+DdgasTtAXB1oEPOmU/WGSZ4GD6W/5ssauNw="
```

### For Production (Vercel)

In your Vercel project settings, set:
```bash
# NextAuth Configuration
NEXTAUTH_URL="https://codeplace.vercel.app"
NEXTAUTH_SECRET="W1liYOk+DdgasTtAXB1oEPOmU/WGSZ4GD6W/5ssauNw="
```

**IMPORTANT**: The `NEXTAUTH_URL` must match the environment:
- ❌ Don't use production URL in local `.env`
- ✅ Use `http://localhost:3000` for local development
- ✅ Use `https://codeplace.vercel.app` in Vercel environment variables

## Testing Session Persistence

After these changes, test the session:

1. **Login** to your account
2. **Close the browser** completely
3. **Reopen the browser** and visit the site
4. **You should still be logged in** (session persisted)

## How It Works

### JWT Strategy
- Uses JSON Web Tokens stored in cookies
- No database lookups for every request
- Tokens are signed and encrypted

### Cookie Lifecycle
1. User logs in → JWT token created
2. Token stored in cookie with 30-day expiration
3. Every 24 hours, token is refreshed (updateAge)
4. Cookie persists across browser sessions
5. Token expires after 30 days of inactivity

### Security Features
- `httpOnly`: Cookie not accessible via JavaScript
- `secure`: HTTPS-only in production
- `sameSite: 'lax'`: Protection against CSRF attacks
- Signed tokens: Can't be tampered with

## Common Issues & Solutions

### Issue: Session Lost on Browser Restart
**Solution**: Make sure `NEXTAUTH_URL` matches your environment

### Issue: Session Not Working in Production
**Solution**:
1. Check Vercel environment variables
2. Ensure `NEXTAUTH_URL` is set to production URL
3. Verify `NEXTAUTH_SECRET` is set

### Issue: Login Redirects to Wrong URL
**Solution**: Update `NEXTAUTH_URL` to match current environment

## Environment Variables Checklist

### Local Development (.env)
- [x] `DATABASE_URL` - Neon PostgreSQL connection
- [x] `NEXTAUTH_URL` - Set to `http://localhost:3000`
- [x] `NEXTAUTH_SECRET` - Random secret key
- [x] `R2_ACCOUNT_ID` - Cloudflare R2 account
- [x] `R2_ACCESS_KEY_ID` - R2 API access key
- [x] `R2_SECRET_ACCESS_KEY` - R2 API secret
- [x] `R2_BUCKET_NAME` - R2 bucket name
- [x] `R2_PUBLIC_URL` - R2 public URL

### Production (Vercel)
- [ ] `DATABASE_URL` - Same as local
- [ ] `NEXTAUTH_URL` - Set to `https://codeplace.vercel.app`
- [ ] `NEXTAUTH_SECRET` - Same as local
- [ ] `R2_ACCOUNT_ID` - Same as local
- [ ] `R2_ACCESS_KEY_ID` - Same as local
- [ ] `R2_SECRET_ACCESS_KEY` - Same as local
- [ ] `R2_BUCKET_NAME` - Same as local
- [ ] `R2_PUBLIC_URL` - Same as local

## Next Steps

1. **Restart your development server** to apply the changes:
   ```bash
   npm run dev
   ```

2. **Clear your browser cookies** for localhost:3000

3. **Test the login flow**:
   - Login
   - Refresh page → Should stay logged in
   - Close browser → Reopen → Should stay logged in

4. **Deploy to production**:
   - Update Vercel environment variables
   - Redeploy the application
   - Test session persistence in production
