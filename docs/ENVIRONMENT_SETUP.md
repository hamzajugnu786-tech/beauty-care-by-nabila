# Environment Setup Guide — Beauty Care by Nabila Lahore

Complete guide for configuring all environment variables with project-specific, isolated values.

---

## Overview

All project configuration is managed through environment variables. **No credentials, project IDs, or URLs are hardcoded in the codebase.** This ensures:

- Complete isolation from other projects on the same accounts
- Smooth client ownership transfer
- Easy switching between development and production environments

---

## Environment Files

| File | Purpose | Committed to Git |
|------|---------|-----------------|
| `.env.example` | Template with all variable names and placeholders | Yes |
| `.env.local` | Actual values for local development | **No** |
| `.env.production.local` | Production overrides (if needed) | **No** |

> **IMPORTANT**: Never commit `.env.local` or any file containing actual secrets.

---

## Quick Setup

```bash
# 1. Copy the template
cp .env.example .env.local

# 2. Fill in your values
nano .env.local   # or use your preferred editor

# 3. Generate secrets
openssl rand -base64 32   # For NEXTAUTH_SECRET
openssl rand -base64 32   # For CSRF_SECRET
```

---

## Variable Groups

### Application Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_NAME` | Brand name displayed in the UI | `Beauty Care by Nabila Lahore` |
| `NEXT_PUBLIC_APP_URL` | Production URL | `https://nabilalahore.com` |
| `NEXT_PUBLIC_APP_VERSION` | Version number | `1.0.0` |

### Site Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | `https://nabilalahore.com` |
| `NEXT_PUBLIC_SITE_NAME` | Site name for SEO | `Beauty Care by Nabila Lahore` |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Site description for SEO | `Luxury Salon & Bridal Studio...` |

### Contact Information

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_PHONE` | Business phone | `+92-300-1234567` |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp number (no +, no dashes) | `+923001234567` |
| `NEXT_PUBLIC_EMAIL` | Business email | `hello@nabilalahore.com` |
| `NEXT_PUBLIC_ADDRESS` | Physical address | `M.M. Alam Road, Gulberg III...` |

### Firebase Client (Required for Auth, Storage, Analytics)

1. Create a **new, dedicated Firebase project** at [Firebase Console](https://console.firebase.google.com)
2. Do NOT reuse any existing Firebase project from other clients
3. Add a Web App and copy the config:

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project Settings → Web App Config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console → Project Settings → Web App Config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console → Project Settings → Web App Config |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console → Project Settings → Web App Config |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Project Settings → Web App Config |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console → Project Settings → Web App Config |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase Console → Project Settings → Web App Config |

### Firebase Admin SDK (Server-Side Only)

1. In Firebase Console → Project Settings → Service Accounts
2. Click **"Generate New Private Key"** — this downloads a JSON file
3. Extract values from the JSON:

| Variable | Source |
|----------|--------|
| `FIREBASE_ADMIN_PROJECT_ID` | JSON → `project_id` |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | JSON → `client_email` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | JSON → `private_key` (include full key with header/footer) |

> **WARNING**: The private key contains newlines represented as `\n`. Keep them as-is in the env file.

### Sanity CMS

1. Create a **new, dedicated Sanity project** at [Sanity Manage](https://www.sanity.io/manage)
2. Create a `production` dataset

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity Manage → Project Settings |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name (typically `production`) |
| `SANITY_API_TOKEN` | Sanity Manage → API → Tokens → Create new (Editor role) |
| `SANITY_API_VERSION` | API version date (e.g., `2024-01-01`) |

### Cloudinary

1. Create a **dedicated Cloudinary account or cloud** for this project

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard → Account Details |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard → Account Details |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard → Account Details |
| `CLOUDINARY_UPLOAD_PRESET` | Settings → Upload → Upload Presets → Add Upload Preset |

### NextAuth

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | Your site's canonical URL (must match production domain) |
| `NEXTAUTH_SECRET` | Encryption key — generate with `openssl rand -base64 32` |

### Database

| Environment | Variable Value |
|-------------|---------------|
| Development | `file:./db/custom.db` (SQLite) |
| Production | PostgreSQL connection string (e.g., `postgresql://user:pass@host:5432/nabila_lahore`) |

### Admin Access

| Variable | Description | Default |
|----------|-------------|---------|
| `ADMIN_EMAIL` | Email address that gets admin access | `admin@nabilalahore.com` |
| `ADMIN_ROLE` | Admin role level | `super-admin` |

### Booking System

| Variable | Description | Default |
|----------|-------------|---------|
| `BOOKING_CONFIRMATION_PREFIX` | Prefix for booking reference numbers | `NBL` |
| `BOOKING_MAX_ADVANCE_DAYS` | How far in advance bookings can be made | `30` |
| `BOOKING_SLOTS_START` | First available booking time | `10:00` |
| `BOOKING_SLOTS_END` | Last available booking time | `20:00` |
| `BOOKING_SLOT_INTERVAL` | Minutes between booking slots | `60` |

### Security

| Variable | Description |
|----------|-------------|
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds |
| `CSRF_SECRET` | CSRF protection secret — generate with `openssl rand -base64 32` |

### Social Media

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram profile URL |
| `NEXT_PUBLIC_FACEBOOK_URL` | Facebook page URL |
| `NEXT_PUBLIC_TIKTOK_URL` | TikTok profile URL |
| `NEXT_PUBLIC_YOUTUBE_URL` | YouTube channel URL |

### SEO & Analytics

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification code |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | Yandex verification code |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID |

### Webhooks

| Variable | Description |
|----------|-------------|
| `WEBHOOK_BOOKING_CONFIRMATION_SECRET` | Secret for verifying webhook payloads |

---

## Vercel Environment Variables

When deploying to Vercel, set all variables in the Vercel Dashboard:

1. Go to Project → Settings → Environment Variables
2. Add each variable from `.env.example`
3. Set the **Production**, **Preview**, and **Development** environments as needed

Or use the Vercel CLI:

```bash
vercel env add NEXTAUTH_SECRET production
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
# ... repeat for all variables
```

---

## Project Isolation Verification

After setup, run the built-in isolation check:

```bash
# The project includes an env validation module
# It warns about:
# - Missing Firebase project ID
# - Missing NextAuth secret
# - Missing Sanity project ID
# - Placeholder admin emails
```

---

## Troubleshooting

### "Missing required environment variable" error in production

This means a required variable is not set in Vercel. Check Project → Settings → Environment Variables.

### Firebase connection fails

- Verify the Firebase project ID matches across all `FIREBASE_*` variables
- Check that the private key includes the full `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Ensure the service account has the correct permissions

### Sanity CMS not loading

- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
- Check that `SANITY_API_TOKEN` has Editor permissions
- Ensure the dataset name matches (`production`)
