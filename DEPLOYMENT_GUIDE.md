# Deployment Guide

> Beauty Care by Nabila - Step-by-step deployment instructions for production

---

## Table of Contents

1. [Vercel Deployment Setup](#1-vercel-deployment-setup)
2. [Environment Variables in Vercel](#2-environment-variables-in-vercel)
3. [Firebase Project Setup](#3-firebase-project-setup)
4. [Firebase Security Rules](#4-firebase-security-rules)
5. [Sanity CMS Deployment](#5-sanity-cms-deployment)
6. [Cloudinary Setup](#6-cloudinary-setup)
7. [Domain Configuration & DNS](#7-domain-configuration--dns)
8. [SSL Certificate Setup](#8-ssl-certificate-setup)
9. [Custom Domain on Vercel](#9-custom-domain-on-vercel)
10. [CI/CD Pipeline Setup](#10-cicd-pipeline-setup)
11. [Rollback Procedures](#11-rollback-procedures)
12. [Monitoring & Alerting](#12-monitoring--alerting)
13. [Performance Monitoring with Vercel Analytics](#13-performance-monitoring-with-vercel-analytics)

---

## 1. Vercel Deployment Setup

### Prerequisites

- Node.js 18+ installed
- Vercel CLI installed: `npm i -g vercel`
- GitHub repository with the project code
- A Vercel account (Pro plan recommended for production)

### Option A: Deploy via Vercel CLI

```bash
# 1. Login to Vercel
vercel login

# 2. Link the project (from project root)
vercel link

# 3. Deploy to preview (staging)
vercel

# 4. Deploy to production
vercel --prod
```

During the first `vercel` command, you will be prompted:

| Prompt | Answer |
|--------|--------|
| Set up and deploy? | Yes |
| Which scope? | Your account or team |
| Link to existing project? | No (first time) or Yes (subsequent) |
| Project name | `beauty-care-nabila` |
| Framework preset | Next.js |
| Root directory | `./` (default) |
| Build command | `bun run build` |
| Output directory | `.next` (default) |

### Option B: Deploy via Git Integration (Recommended)

```bash
# 1. Push code to GitHub
git push origin main

# 2. Import project in Vercel Dashboard
#    Go to https://vercel.com/new
#    Select the GitHub repository
#    Framework Preset: Next.js
#    Build Command: bun run build
#    Output Directory: .next

# 3. Configure environment variables (see Section 2)

# 4. Click "Deploy"
```

### Project Settings in Vercel Dashboard

Navigate to **Settings > General** and configure:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Build Command | `bun run build` |
| Output Directory | `.next` |
| Install Command | `bun install` |
| Node.js Version | 18.x |
| Region | sin1 (Singapore - closest to Pakistan) |

### vercel.json Configuration

A `vercel.json` file is included in the project root with optimized settings for:

- Framework detection
- Security headers
- Caching policies
- Image optimization
- Redirect rules
- Serverless function configuration

---

## 2. Environment Variables in Vercel

### Setting Environment Variables

**Via Vercel Dashboard:**

1. Go to **Settings > Environment Variables**
2. Add each variable with the appropriate environment scope:
   - **Production**: Variables for the live site
   - **Preview**: Variables for preview deployments
   - **Development**: Variables for local development

**Via Vercel CLI:**

```bash
# Add a production variable
vercel env add NEXTAUTH_SECRET production

# Add a preview variable
vercel env add NEXTAUTH_URL preview

# Pull all variables locally
vercel env pull .env.local
```

**Bulk Import:**

```bash
# Create an env file and import it
vercel env pull .env.production.local
```

### Required Environment Variables

| Variable | Environment | Notes |
|----------|-------------|-------|
| `DATABASE_URL` | Production | Production database connection string |
| `NEXTAUTH_SECRET` | Production, Preview | Random 32+ char string |
| `NEXTAUTH_URL` | Production | `https://nabilalahore.com` |
| `NEXT_PUBLIC_APP_URL` | Production | `https://nabilalahore.com` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | All | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | All | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | All | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | All | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | All | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | All | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | All | GA4 measurement ID |
| `FIREBASE_ADMIN_PROJECT_ID` | Production, Preview | From service account |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Production, Preview | From service account |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Production, Preview | Full PEM key with \n |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | All | From Sanity management |
| `NEXT_PUBLIC_SANITY_DATASET` | All | `production` |
| `SANITY_API_TOKEN` | Production, Preview | From Sanity management |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | All | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Production, Preview | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Production, Preview | From Cloudinary dashboard |
| `CLOUDINARY_UPLOAD_PRESET` | All | From Cloudinary upload settings |

### Generating NEXTAUTH_SECRET

```bash
# Using OpenSSL
openssl rand -base64 48

# Using Node.js
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

### Important Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. NEVER put secrets in public variables.
- The `FIREBASE_ADMIN_PRIVATE_KEY` must include the full PEM format with `\n` characters preserved.
- After changing environment variables, you must redeploy for changes to take effect.

---

## 3. Firebase Project Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add Project**
3. Project name: `beauty-care-nabila`
4. Project ID: `beauty-care-nabila` (or your preferred ID)
5. Disable Google Analytics initially (can enable later)
6. Choose location: **asia-south1 (Mumbai)** - closest to Pakistan
7. Click **Create Project**

### Enable Authentication

1. Go to **Authentication > Sign-in method**
2. Enable **Email/Password** provider
3. Disable **Email link** (Passwordless) - not needed
4. Go to **Authentication > Users**
5. Create admin users:
   - Click **Add User**
   - Enter email and a strong password
   - Record the **UID** for each user

### Set Custom Claims (Admin Roles)

After creating admin users, set their roles using the Firebase Admin SDK:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Set custom claims using a script
```

Create a temporary script `set-admin-claims.js`:

```javascript
const admin = require("firebase-admin");

// Download service account key from:
// Firebase Console > Project Settings > Service Accounts > Generate New Private Key
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "USER_UID_FROM_AUTH"; // Replace with actual UID
const role = "super-admin"; // Options: super-admin, manager, staff

admin.auth().setCustomUserClaims(uid, { role })
  .then(() => {
    console.log(`Successfully set role "${role}" for user ${uid}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error setting claims:", error);
    process.exit(1);
  });
```

```bash
# Run the script
node set-admin-claims.js

# Delete the service account key file after use!
rm serviceAccountKey.js
```

### Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create Database**
3. Choose **Production mode** (security rules required)
4. Location: **asia-south1 (Mumbai)**
5. Click **Create**

### Create Firestore Indexes

Deploy indexes from the project (create `firestore.indexes.json`):

```json
{
  "indexes": [
    {
      "collectionGroup": "bookings",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "date", "order": "ASCENDING" },
        { "fieldPath": "artistId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "bookings",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "availability",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "artistId", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### Create Storage Bucket

1. Go to **Storage**
2. Click **Get Started**
3. Choose **Production mode** (security rules required)
4. Location: **asia-south1 (Mumbai)**
5. Click **Done**

### Configure Storage CORS

Create a `cors.json` file:

```json
[
  {
    "origin": ["https://nabilalahore.com", "https://www.nabilalahore.com"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Content-Length", "Content-Disposition"]
  }
]
```

Apply CORS configuration:

```bash
gsutil cors set cors.json gs://beauty-care-nabila.appspot.com
```

### Generate Service Account Key

1. Go to **Project Settings > Service Accounts**
2. Click **Generate New Private Key**
3. Save the JSON file securely (NEVER commit to Git)
4. Extract these values for environment variables:
   - `project_id` -> `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` -> `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` -> `FIREBASE_ADMIN_PRIVATE_KEY`

---

## 4. Firebase Security Rules

### Deploying Firestore Rules

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in the project (if not already done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

The Firestore rules file (`firebase.rules`) is included in the project root. Key features:

- Admin role-based access (super-admin, manager, staff)
- Public read access for services, testimonials
- Authenticated write for bookings, gallery
- Rate limiting considerations
- Data validation rules

### Deploying Storage Rules

```bash
# Deploy storage rules
firebase deploy --only storage:rules
```

The Storage rules file (`firebase.storage.rules`) is included in the project root. Key features:

- Image-only uploads (JPEG, PNG, WebP, GIF)
- 5MB maximum file size
- Admin-only write access
- Public read access
- Folder structure enforcement

---

## 5. Sanity CMS Deployment

### Create Sanity Project

1. Install Sanity CLI: `npm install -g sanity@latest`
2. Login to Sanity: `sanity login`
3. The project already has Sanity schemas defined in `src/lib/sanity/schemas/`

### Setting Up Sanity Studio (Standalone)

If you want a standalone Sanity Studio for content management:

```bash
# Create a Sanity studio (separate from Next.js)
mkdir sanity-studio && cd sanity-studio
sanity init --project-plan free

# Link to your project
sanity init --env
```

### Configure Sanity for the Next.js Project

1. Go to [Sanity Management](https://manage.sanity.io/)
2. Create a new project:
   - Name: `Beauty Care by Nabila`
   - Plan: Free (or Growth for higher limits)
   - Dataset: `production`
3. Note the **Project ID** for `NEXT_PUBLIC_SANITY_PROJECT_ID`

### Generate API Token

1. Go to **Settings > API > Tokens**
2. Click **Add API Token**
3. Name: `Next.js Production`
4. Permissions: **Editor** (read + write)
5. Copy the token for `SANITY_API_TOKEN`

### Configure CORS

1. Go to **Settings > API > CORS Origins**
2. Add your production URL: `https://nabilalahore.com`
3. Add preview URL: `https://*.vercel.app`
4. Allow credentials: Yes

### Deploy Sanity Studio

```bash
# From the sanity-studio directory
sanity deploy

# This will deploy to: https://beauty-care-nabila.sanity.studio
```

### Content Population

After deploying, access the Studio and create content:

1. **Site Settings** (single document):
   - Brand name, tagline, contact info, social links, business hours, SEO defaults

2. **Services** (one document per service):
   - Title, category, price, duration, icon, description, features, add-ons, sort order

3. **Staff Members**:
   - Name, title, specialties, experience, photo, bio, rating

4. **Testimonials**:
   - Name, role, quote, rating, image, featured flag

5. **Gallery Images**:
   - Image, alt text, category, featured flag

6. **Blog Posts**:
   - Title, slug, excerpt, content, cover image, author, category, tags, published date

---

## 6. Cloudinary Setup

### Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/) and sign up
2. Choose the **Pro** plan (or Advanced for higher limits)
3. Note your **Cloud Name** from the dashboard

### Configure Upload Preset

1. Go to **Settings > Upload**
2. Under **Upload Presets**, click **Add Upload Preset**
3. Configuration:
   - Preset name: `nabila-salon` (use for `CLOUDINARY_UPLOAD_PRESET`)
   - Signing Mode: **Unsigned** (for client-side uploads) or **Signed** (more secure)
   - Folder: `nabila-salon`
   - Allowed formats: `jpg,jpeg,png,webp,gif`
   - Max file size: `5242880` (5MB)
   - Transformation: `q_auto,f_auto` (auto quality and format)
4. Click **Save**

### Configure Transformation Presets

Go to **Settings > Upload > Upload Manipulations** and add:

| Name | Transformation |
|------|---------------|
| Thumbnail | `w_200,h_200,c_fill,q_auto,f_auto` |
| Gallery | `w_800,h_600,c_fill,q_auto,f_auto` |
| Hero | `w_1920,h_1080,c_fill,q_auto,f_auto` |
| OG Image | `w_1200,h_630,c_fill,q_auto,f_auto` |

### Configure Security

1. Go to **Settings > Security**
2. Enable **Strict transformations** (optional, for security)
3. Set **Allowed upload tags**: `gallery,staff,blog,service`
4. Configure **Notification URL** (optional, for upload callbacks)

### API Credentials

From the Cloudinary Dashboard, copy:

- **Cloud Name** -> `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- **API Key** -> `CLOUDINARY_API_KEY`
- **API Secret** -> `CLOUDINARY_API_SECRET`

---

## 7. Domain Configuration & DNS

### Purchase Domain

Recommended registrars for .com domains:
- Namecheap
- Google Domains
- Cloudflare Registrar

The target domain is: `nabilalahore.com`

### DNS Records for Vercel

Configure these DNS records at your domain registrar:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `76.76.21.21` | 3600 |
| CNAME | `www` | `cname.vercel-dns.com` | 3600 |

### Verify DNS Propagation

```bash
# Check A record
dig nabilalahore.com A

# Check CNAME record
dig www.nabilalahore.com CNAME

# Check propagation globally
# https://www.whatsmydns.net/
```

### Email DNS Records (Optional)

If using Google Workspace or another email provider:

| Type | Name | Value | Priority |
|------|------|-------|----------|
| MX | `@` | `ASPMX.L.GOOGLE.COM` | 1 |
| MX | `@` | `ALT1.ASPMX.L.GOOGLE.COM` | 5 |
| MX | `@` | `ALT2.ASPMX.L.GOOGLE.COM` | 5 |
| MX | `@` | `ASPMX2.GOOGLEMAIL.COM` | 10 |
| MX | `@` | `ASPMX3.GOOGLEMAIL.COM` | 10 |
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` | - |

---

## 8. SSL Certificate Setup

### Vercel Automatic SSL

Vercel automatically provisions and renews SSL certificates via Let's Encrypt:

1. Add your domain to the Vercel project (see Section 9)
2. Vercel will automatically provision an SSL certificate
3. The certificate covers both the apex domain and www subdomain
4. Auto-renewal is handled by Vercel

### Verify SSL

```bash
# Check certificate details
openssl s_client -connect nabilalahore.com:443 -servername nabilalahore.com

# Test with SSL Labs
# https://www.ssllabs.com/ssltest/analyze.html?d=nabilalahore.com
```

### Force HTTPS

The application enforces HTTPS through:

1. **HSTS header** in middleware: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
2. **Next.js config**: `poweredByHeader: false`
3. **Vercel settings**: Automatic HTTPS redirect
4. **CSP header**: `upgrade-insecure-requests` directive in production

### Submit for HSTS Preload

After the site is live with HTTPS:

1. Visit [https://hstspreload.org/](https://hstspreload.org/)
2. Enter `nabilalahore.com`
3. Click **Check Status and HSTS Preload**
4. If eligible, submit for preloading

---

## 9. Custom Domain on Vercel

### Add Domain

1. Go to **Vercel Dashboard > Project > Settings > Domains**
2. Enter `nabilalahore.com`
3. Click **Add**
4. Also add `www.nabilalahore.com`

### Configure Domain

1. Vercel will show the required DNS records (see Section 7)
2. Add the records at your DNS provider
3. Wait for DNS propagation (usually 5-30 minutes, up to 48 hours)
4. Vercel will verify the domain automatically

### Set Primary Domain

1. In **Settings > Domains**, find `nabilalahore.com`
2. Click the three dots menu
3. Select **Make Primary**
4. Ensure `www.nabilalahore.com` redirects to the primary domain (or vice versa)

### Redirect Configuration

Vercel automatically handles www to non-www redirects (or vice versa) based on which domain is set as primary. No additional configuration needed.

---

## 10. CI/CD Pipeline Setup

### GitHub Integration (Automatic)

Vercel automatically deploys when you push to the connected branch:

| Branch | Deployment | URL Pattern |
|--------|-----------|-------------|
| `main` | Production | `nabilalahore.com` |
| `develop` | Preview | `beauty-care-nabila-git-develop-*.vercel.app` |
| PR branches | Preview | `beauty-care-nabila-pr-*.vercel.app` |

### Branch Protection Rules

Configure in GitHub **Settings > Branches > Branch protection rules** for `main`:

1. **Require pull request reviews before merging** (1 approval)
2. **Require status checks to pass**:
   - ESLint check
   - TypeScript compilation
   - Vercel preview deployment
3. **Require branches to be up to date before merging**
4. **Require signed commits** (optional)

### GitHub Actions Workflow (Optional)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2

      - name: Install dependencies
        run: bun install

      - name: Lint
        run: bun run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Build
        run: bun run build
        env:
          DATABASE_URL: file:/tmp/test.db
          NEXTAUTH_SECRET: test-secret-for-ci-only
          NEXTAUTH_URL: http://localhost:3000
          NEXT_PUBLIC_APP_URL: http://localhost:3000
```

### Deployment Flow

```
Feature Branch -> Pull Request -> Preview Deployment -> Review -> Merge to main -> Production Deployment
```

### Preview Deployments

Every pull request automatically gets a preview deployment with:

- Unique URL for testing
- Same environment variables as production
- Full functionality for QA testing
- Comment on the PR with the preview URL

---

## 11. Rollback Procedures

### Instant Rollback via Vercel Dashboard

1. Go to **Vercel Dashboard > Project > Deployments**
2. Find the last known good deployment
3. Click the three dots menu
4. Select **Promote to Production**
5. The selected deployment becomes the live production deployment

### Instant Rollback via CLI

```bash
# List recent deployments
vercel ls

# Inspect a specific deployment
vercel inspect <deployment-url>

# Rollback to previous deployment
vercel rollback
```

### Rollback via Git

```bash
# Revert the last commit
git revert HEAD
git push origin main

# Or reset to a specific commit
git log --oneline -10  # Find the commit hash
git revert <commit-hash>
git push origin main
```

### Database Rollback

For Firestore:

```bash
# Restore from backup
gcloud firestore import gs://beauty-care-nabila-backups/backup-YYYY-MM-DD
```

For SQLite (development):

```bash
# Restore from backup
cp db/custom.db.backup.YYYY-MM-DD db/custom.db
```

### Rollback Decision Matrix

| Issue Severity | Rollback Method | Downtime Target |
|---------------|-----------------|-----------------|
| Critical (site down) | Vercel instant rollback | < 2 minutes |
| High (major feature broken) | Git revert + redeploy | < 10 minutes |
| Medium (minor feature issue) | Fix forward with PR | < 1 hour |
| Low (cosmetic issue) | Next scheduled deploy | < 24 hours |

---

## 12. Monitoring & Alerting

### Vercel Built-in Monitoring

1. **Deployment Status**: Automatic notifications for deploy success/failure
2. **Function Logs**: Real-time logs for serverless functions
3. **Analytics**: Web Vitals and traffic data
4. **Speed Insights**: Real user performance monitoring

Configure in **Vercel Dashboard > Project > Settings**:

- Enable **Vercel Analytics**
- Enable **Speed Insights**
- Configure **Notification emails**

### External Monitoring (Recommended)

#### UptimeRobot (Free Tier Available)

1. Create account at [UptimeRobot](https://uptimerobot.com/)
2. Add monitors:

| Monitor | URL | Check Interval | Alert |
|---------|-----|----------------|-------|
| Homepage | `https://nabilalahore.com` | 5 min | Email + SMS |
| Booking Page | `https://nabilalahore.com/booking` | 5 min | Email |
| Admin Login | `https://nabilalahore.com/admin/login` | 5 min | Email |
| API Health | `https://nabilalahore.com/api` | 5 min | Email |

#### Sentry (Error Tracking)

1. Create a Sentry project: [sentry.io](https://sentry.io/)
2. Install the Sentry Next.js SDK:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

3. Add `SENTRY_DSN` to environment variables
4. Configure alerts for:
   - New error rate > 1% of requests
   - Any unhandled exception
   - API response time > 5 seconds

### Alert Channels

Configure multiple alert channels:

1. **Email**: Primary alert channel
2. **Slack/Discord**: Real-time alerts for the dev team
3. **SMS**: Critical alerts (site down)
4. **PagerDuty**: On-call rotation (if team is large enough)

### Health Check Endpoint

The application includes an API health endpoint at `/api` that returns:

```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "service": "Beauty Care by Nabila"
}
```

Configure monitoring tools to check this endpoint.

---

## 13. Performance Monitoring with Vercel Analytics

### Enable Vercel Analytics

```bash
# Install the Analytics package
npm install @vercel/analytics

# Add to layout.tsx (already included if using the SDK)
```

Or enable via Vercel Dashboard:

1. Go to **Project > Analytics**
2. Click **Enable**
3. Select the plan (Hobby: free, Pro: included)

### Web Vitals Dashboard

Vercel Analytics provides real-user Web Vitals data:

- **LCP**: Largest Contentful Paint
- **FID**: First Input Delay
- **CLS**: Cumulative Layout Shift
- **INP**: Interaction to Next Paint
- **TTFB**: Time to First Byte

### Custom Performance Events

Track custom events for business metrics:

```typescript
import { track } from "@vercel/analytics";

// Track booking initiated
track("booking_initiated", { service: "bridal-signature" });

// Track booking completed
track("booking_completed", {
  service: "bridal-signature",
  artist: "nabila",
  value: 150000
});

// Track contact initiated
track("contact_initiated", { method: "whatsapp" });
```

### Performance Budgets

Set performance budgets in the Vercel dashboard:

| Metric | Budget | Alert Threshold |
|--------|--------|----------------|
| LCP | 2.5s | 3.0s |
| CLS | 0.1 | 0.15 |
| INP | 200ms | 300ms |
| TTFB | 800ms | 1200ms |
| Bundle Size | 300KB | 400KB |

### Speed Insights

Enable Speed Insights for detailed performance data:

1. Go to **Project > Speed Insights**
2. Click **Enable**
3. Data will appear after 24 hours of traffic

### Performance Optimization Checklist

Based on Analytics data, optimize:

1. **If LCP > 2.5s**: Optimize hero images, use priority loading, check server response time
2. **If CLS > 0.1**: Set explicit dimensions on images, avoid dynamic content injection above fold
3. **If INP > 200ms**: Reduce JavaScript execution time, use web workers for heavy computation
4. **If TTFB > 800ms**: Check Edge function placement, optimize database queries, add caching

---

## Quick Reference: Deployment Command Sequence

```bash
# 1. Ensure all changes are committed
git status

# 2. Run final checks
bun run lint
npx tsc --noEmit
bun run build

# 3. Push to production
git push origin main

# 4. Vercel will auto-deploy

# 5. Monitor deployment
vercel ls

# 6. Verify production
curl -s -o /dev/null -w "%{http_code}" https://nabilalahore.com
# Expected: 200

# 7. Run smoke tests (see PRODUCTION_CHECKLIST.md)
```

---

*Last updated: 2025*
