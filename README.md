# Template Marketplace

A full-stack marketplace for code templates built with Next.js, PostgreSQL, and Cloudflare R2.

## Features

- **Authentication**: User registration and login with NextAuth.js
- **Template Upload**: Upload code templates with images, descriptions, and metadata
- **Image Storage**: Cloudflare R2 integration for scalable image hosting
- **Browse Templates**: Filter templates by category and view detailed information
- **User Dashboard**: Manage your uploaded templates and view statistics
- **Responsive Design**: Beautiful UI built with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Image Storage**: Cloudflare R2 (S3-compatible)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Cloudflare R2 bucket (or S3-compatible storage)

## Getting Started

### 1. Clone the repository

\`\`\`bash
git clone <your-repo-url>
cd template-marketplace
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set up environment variables

Create a \`.env\` file in the root directory:

\`\`\`bash
cp .env.example .env
\`\`\`

Fill in your environment variables:

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/template_marketplace"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Generate a secret with: openssl rand -base64 32

# Cloudflare R2
R2_ACCOUNT_ID="your-r2-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key"
R2_SECRET_ACCESS_KEY="your-r2-secret-key"
R2_BUCKET_NAME="template-marketplace-images"
R2_PUBLIC_URL="https://your-bucket.r2.dev"
\`\`\`

### 4. Set up the database

Generate Prisma client and run migrations:

\`\`\`bash
npx prisma generate
npx prisma migrate dev --name init
\`\`\`

### 5. Run the development server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main models:

- **User**: User accounts with profile information
- **Template**: Code templates with images, metadata, and stats
- **Account/Session**: NextAuth.js authentication tables

See \`prisma/schema.prisma\` for the complete schema.

## Project Structure

\`\`\`
template-marketplace/
├── app/
│   ├── api/            # API routes
│   ├── dashboard/      # User dashboard
│   ├── templates/      # Template browsing and details
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   └── page.tsx        # Home page
├── components/         # Reusable components
├── lib/                # Utility functions and configs
│   ├── auth.ts         # NextAuth configuration
│   ├── prisma.ts       # Prisma client
│   └── r2.ts           # R2 storage utilities
├── prisma/
│   └── schema.prisma   # Database schema
└── types/              # TypeScript type definitions
\`\`\`

## API Routes

- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/[...nextauth]\` - NextAuth endpoints
- \`GET /api/templates\` - Get all templates (with filters)
- \`POST /api/templates\` - Create new template
- \`GET /api/templates/[id]\` - Get template by ID
- \`POST /api/upload\` - Upload image to R2

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Database

For production, use a managed PostgreSQL service:
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Neon](https://neon.tech)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)

### Image Storage

Set up Cloudflare R2:
1. Create an R2 bucket in Cloudflare dashboard
2. Generate API tokens with read/write permissions
3. Configure CORS if needed for direct uploads
4. Add environment variables to your deployment

## Environment Variables for Production

Make sure to set all environment variables in your deployment platform:

- \`DATABASE_URL\`
- \`NEXTAUTH_URL\` (your production URL)
- \`NEXTAUTH_SECRET\`
- \`R2_ACCOUNT_ID\`
- \`R2_ACCESS_KEY_ID\`
- \`R2_SECRET_ACCESS_KEY\`
- \`R2_BUCKET_NAME\`
- \`R2_PUBLIC_URL\`

## Features to Add

- [ ] Search functionality
- [ ] User profiles
- [ ] Like/favorite templates
- [ ] Comments and ratings
- [ ] Template categories and filters
- [ ] Admin dashboard
- [ ] Email verification
- [ ] OAuth providers (GitHub, Google)
- [ ] Template download tracking
- [ ] Featured templates
- [ ] User following system

## License

MIT

## Contributing

Pull requests are welcome! Please feel free to submit a Pull Request.
