# Deployment Guide — Beauty Care by Nabila Lahore

This guide covers deploying the project to Vercel with complete project isolation.

---

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. The GitHub repository connected: `https://github.com/hamzajugnu786-tech/beauty-care-by-nabila`
3. All environment variables prepared (see `.env.example`)

---

## Step 1: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add Project"** → Name: `nabila-lahore` (or your preferred ID)
3. Enable Google Analytics (optional)
4. In Project Settings → General → Your Apps → Add Web App
5. Copy the Firebase config values to your `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
6. In Project Settings → Service Accounts → Generate New Private Key
7. Set these server-side variables:
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY` (include the full key including `-----BEGIN PRIVATE KEY-----`)

### Enable Firebase Services

- **Authentication**: Enable Email/Password and Google sign-in
- **Firestore**: Create database in production mode
- **Storage**: Set up with security rules (see `firebase.storage.rules`)

---

## Step 2: Sanity CMS Setup

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Create a new project → Name: `Beauty Care by Nabila`
3. Set dataset to `production`
4. Copy values:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
5. Create an API token with Editor permissions:
   - `SANITY_API_TOKEN`

---

## Step 3: Cloudinary Setup

1. Go to [Cloudinary Console](https://console.cloudinary.com)
2. Create a new cloud (or use a dedicated one for this project)
3. Copy values:
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Create an upload preset named `nabila-lahore-uploads` (unsigned)

---

## Step 4: Vercel Deployment

### Option A: Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import the GitHub repository: `hamzajugnu786-tech/beauty-care-by-nabila`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `bun run build`
   - **Install Command**: `bun install`
   - **Output Directory**: `.next`
5. Add ALL environment variables from `.env.example` under **Environment Variables**
6. Click **Deploy**

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Set environment variables
vercel env add NEXTAUTH_SECRET production
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
# ... add all required variables

# Deploy to production
vercel --prod
```

---

## Step 5: Post-Deployment Configuration

### Custom Domain

1. In Vercel Dashboard → Project Settings → Domains
2. Add your domain (e.g., `nabilalahore.com`)
3. Update DNS records as instructed by Vercel
4. Update environment variables:
   - `NEXT_PUBLIC_APP_URL` = `https://nabilalahore.com`
   - `NEXT_PUBLIC_SITE_URL` = `https://nabilalahore.com`
   - `NEXTAUTH_URL` = `https://nabilalahore.com`

### Admin Access

1. Create a user account through the site's authentication
2. In Firebase Console → Authentication → Users, find the user
3. Set custom claims for admin role using Firebase Admin SDK
4. Or set `ADMIN_EMAIL` in environment variables to match the registered email

---

## Step 6: Verification Checklist

- [ ] Site loads at custom domain
- [ ] All pages render correctly
- [ ] Firebase Authentication works
- [ ] Booking system accepts submissions
- [ ] Admin dashboard accessible at `/admin`
- [ ] Gallery images load
- [ ] Contact form sends messages
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Google Analytics tracking (if configured)
- [ ] SEO meta tags present in page source

---

## Rollback

If a deployment fails:

1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click **"..."** → **"Promote to Production"**

---

## Environment Variables Reference

| Variable | Production Value |
|----------|-----------------|
| `NEXT_PUBLIC_APP_URL` | `https://nabilalahore.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://nabilalahore.com` |
| `NEXTAUTH_URL` | `https://nabilalahore.com` |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `DATABASE_URL` | PostgreSQL connection string (for production) |
| `CSRF_SECRET` | Generate with `openssl rand -base64 32` |
