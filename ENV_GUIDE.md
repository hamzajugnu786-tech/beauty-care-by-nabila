# Environment Variables Guide

> Beauty Care by Nabila - Complete documentation for every environment variable

---

## Table of Contents

1. [Overview](#overview)
2. [Database](#database)
3. [Firebase Client SDK](#firebase-client-sdk)
4. [Firebase Admin SDK](#firebase-admin-sdk)
5. [NextAuth.js](#nextauthjs)
6. [Sanity CMS](#sanity-cms)
7. [Cloudinary](#cloudinary)
8. [Application](#application)
9. [Quick Setup by Environment](#quick-setup-by-environment)
10. [Security Best Practices](#security-best-practices)

---

## Overview

### Variable Naming Convention

| Prefix | Visibility | Usage |
|--------|-----------|-------|
| `NEXT_PUBLIC_` | Exposed to browser | Client-side code, safe for public |
| No prefix | Server only | API routes, server components, middleware |
| `FIREBASE_ADMIN_` | Server only | Firebase Admin SDK credentials |

### Environments

| Environment | Description | URL |
|-------------|-------------|-----|
| Development | Local machine | `http://localhost:3000` |
| Preview | Vercel preview deployments | `*.vercel.app` |
| Production | Live site | `https://nabilalahore.com` |

---

## Database

### `DATABASE_URL`

| Property | Value |
|----------|-------|
| **Description** | Connection string for the Prisma database |
| **Required** | Yes |
| **Public** | No (server only) |
| **Example** | `file:./db/custom.db` (SQLite) |
| **Where to obtain** | For SQLite: local file path. For production: your database provider connection string |

**Notes:**
- In development, this is a local SQLite file path
- For production on Vercel, consider migrating to PostgreSQL via a provider like Supabase, PlanetScale, or Neon
- The path can be relative (`file:./db/custom.db`) or absolute (`file:/home/z/my-project/db/custom.db`)

---

## Firebase Client SDK

### `NEXT_PUBLIC_FIREBASE_API_KEY`

| Property | Value |
|----------|-------|
| **Description** | Firebase Web API key for client-side authentication |
| **Required** | Yes |
| **Public** | Yes (exposed to browser) |
| **Example** | `AIzaSyBx1234567890abcdefghijklmnopqrstuv` |
| **Where to obtain** | Firebase Console > Project Settings > General > Web App > API Key |

**Notes:**
- This key is safe to expose publicly. Firebase security is enforced by Firestore Rules and Storage Rules, not by hiding the API key.
- Each Firebase project has a unique API key.

### `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`

| Property | Value |
|----------|-------|
| **Description** | Firebase Auth domain for authentication flows |
| **Required** | Yes |
| **Public** | Yes (exposed to browser) |
| **Example** | `beauty-care-nabila.firebaseapp.com` |
| **Where to obtain** | Firebase Console > Project Settings > General > Web App > Auth Domain |

**Notes:**
- Usually follows the pattern `{project-id}.firebaseapp.com`
- Can also use a custom auth domain if configured

### `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

| Property | Value |
|----------|-------|
| **Description** | Firebase project identifier |
| **Required** | Yes |
| **Public** | Yes (exposed to browser) |
| **Example** | `beauty-care-nabila` |
| **Where to obtain** | Firebase Console > Project Settings > General > Project ID |

**Notes:**
- This is the unique identifier for your Firebase project
- Must match between client SDK and Admin SDK configurations

### `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`

| Property | Value |
|----------|-------|
| **Description** | Firebase Cloud Storage bucket name |
| **Required** | Yes |
| **Public** | Yes (exposed to browser) |
| **Example** | `beauty-care-nabila.appspot.com` |
| **Where to obtain** | Firebase Console > Storage > Get Started > Bucket URL |

**Notes:**
- Usually follows the pattern `{project-id}.appspot.com`
- This is used for both client-side file uploads and Admin SDK operations

### `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`

| Property | Value |
|----------|-------|
| **Description** | Firebase Cloud Messaging sender ID |
| **Required** | Yes |
| **Public** | Yes (exposed to browser) |
| **Example** | `123456789012` |
| **Where to obtain** | Firebase Console > Project Settings > General > Web App > Messaging Sender ID |

**Notes:**
- A numeric identifier for push notification services
- Required even if push notifications are not used (Firebase SDK initialization requires it)

### `NEXT_PUBLIC_FIREBASE_APP_ID`

| Property | Value |
|----------|-------|
| **Description** | Firebase Web App ID |
| **Required** | Yes |
| **Public** | Yes (exposed to browser) |
| **Example** | `1:123456789012:web:abcdef1234567890` |
| **Where to obtain** | Firebase Console > Project Settings > General > Web App > App ID |

**Notes:**
- Follows the pattern `1:{sender-id}:web:{random-hash}`
- Identifies the specific web app within the Firebase project

### `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

| Property | Value |
|----------|-------|
| **Description** | Google Analytics 4 measurement ID |
| **Required** | No (optional, for analytics) |
| **Public** | Yes (exposed to browser) |
| **Example** | `G-ABC1234567` |
| **Where to obtain** | Firebase Console > Project Settings > Integrations > Google Analytics > Measurement ID |

**Notes:**
- Only required if Google Analytics is enabled in the Firebase project
- Follows the pattern `G-XXXXXXXXXX`
- If not using Firebase Analytics, this can be left empty

### `NEXT_PUBLIC_USE_FIREBASE_EMULATORS`

| Property | Value |
|----------|-------|
| **Description** | Whether to connect to Firebase local emulators |
| **Required** | No (default: `false`) |
| **Public** | Yes (exposed to browser) |
| **Example** | `false` |
| **Where to obtain** | Set to `true` for local development with emulators |

**Notes:**
- When `true`, the Firebase client SDK connects to local emulators:
  - Auth: `http://localhost:9099`
  - Firestore: `localhost:8080`
  - Storage: `localhost:9199`
- Must be `false` in production
- Requires Firebase emulators to be running locally (`firebase emulators:start`)

---

## Firebase Admin SDK

### `FIREBASE_ADMIN_PROJECT_ID`

| Property | Value |
|----------|-------|
| **Description** | Firebase project ID for Admin SDK |
| **Required** | Yes (for production) |
| **Public** | No (server only) |
| **Example** | `beauty-care-nabila` |
| **Where to obtain** | Firebase Console > Project Settings > Service Accounts > Project ID |

**Notes:**
- Must match `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- Used to initialize the Firebase Admin SDK on the server

### `FIREBASE_ADMIN_CLIENT_EMAIL`

| Property | Value |
|----------|-------|
| **Description** | Service account client email |
| **Required** | Yes (for production) |
| **Public** | No (server only) |
| **Example** | `firebase-adminsdk-xxxxx@beauty-care-nabila.iam.gserviceaccount.com` |
| **Where to obtain** | Firebase Console > Project Settings > Service Accounts > Generate New Private Key > client_email field |

**Notes:**
- This is the email address of the Firebase service account
- It follows the pattern `firebase-adminsdk-xxxxx@{project-id}.iam.gserviceaccount.com`
- In development without this value, the Admin SDK falls back to a minimal config

### `FIREBASE_ADMIN_PRIVATE_KEY`

| Property | Value |
|----------|-------|
| **Description** | Service account private key (PEM format) |
| **Required** | Yes (for production) |
| **Public** | No (server only - CRITICAL SECRET) |
| **Example** | `"-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"` |
| **Where to obtain** | Firebase Console > Project Settings > Service Accounts > Generate New Private Key > private_key field |

**Notes:**
- **CRITICAL**: Never commit this value to version control
- The key must include `\n` characters (literal newlines in PEM format)
- When setting in Vercel, paste the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- The application code replaces `\n` escape sequences with actual newlines
- In development without this value, the Admin SDK uses a minimal config

---

## NextAuth.js

### `NEXTAUTH_SECRET`

| Property | Value |
|----------|-------|
| **Description** | Secret key for signing and encrypting JWT tokens |
| **Required** | Yes |
| **Public** | No (server only - CRITICAL SECRET) |
| **Example** | `aB3dE7fG9hJ2kL5mN8pQ1rS4tU6vW0xY` (32+ random characters) |
| **Where to obtain** | Generate with: `openssl rand -base64 48` |

**Notes:**
- **CRITICAL**: Never commit this value to version control
- Must be the same across all instances in the same environment
- Changing this will invalidate all existing sessions
- Must be at least 32 characters long
- Generate a unique value for each environment (development, preview, production)

### `NEXTAUTH_URL`

| Property | Value |
|----------|-------|
| **Description** | The canonical URL of the application |
| **Required** | Yes |
| **Public** | No (server only) |
| **Example** | `https://nabilalahore.com` |
| **Where to obtain** | Your production domain URL |

**Notes:**
- Used by NextAuth for callback URLs and redirects
- In development: `http://localhost:3000`
- In production: `https://nabilalahore.com` (no trailing slash)
- Must include the protocol (`https://`)

### `NEXT_PUBLIC_APP_URL`

| Property | Value |
|----------|-------|
| **Description** | Public application URL for client-side API calls |
| **Required** | Yes |
| **Public** | Yes (exposed to browser) |
| **Example** | `https://nabilalahore.com` |
| **Where to obtain** | Your production domain URL |

**Notes:**
- Used by the Firebase Auth callback to fetch user roles
- Must match `NEXTAUTH_URL` in most cases
- In development: `http://localhost:3000`
- In production: `https://nabilalahore.com`

---

## Sanity CMS

### `NEXT_PUBLIC_SANITY_PROJECT_ID`

| Property | Value |
|----------|-------|
| **Description** | Sanity project identifier |
| **Required** | Yes |
| **Public** | Yes (exposed to browser) |
| **Example** | `abc123xyz` |
| **Where to obtain** | Sanity Management (https://manage.sanity.io/) > Project > Settings > Project ID |

**Notes:**
- A short alphanumeric string identifying your Sanity project
- Used by both the read client (public) and write client (server)
- Must be the same in all environments

### `NEXT_PUBLIC_SANITY_DATASET`

| Property | Value |
|----------|-------|
| **Description** | Sanity dataset name |
| **Required** | Yes |
| **Public** | Yes (exposed to browser) |
| **Example** | `production` |
| **Where to obtain** | Sanity Management > Project > Datasets |

**Notes:**
- Default datasets: `production` (live data) or `development` (test data)
- Use `production` for both preview and production deployments
- Use `development` only for local development with test content
- Can create custom datasets for staging environments

### `SANITY_API_TOKEN`

| Property | Value |
|----------|-------|
| **Description** | Sanity API token for server-side write operations |
| **Required** | Yes (for admin functionality) |
| **Public** | No (server only - SECRET) |
| **Example** | `sk1234567890abcdefghijklmnopqrstuvwxyz` |
| **Where to obtain** | Sanity Management > Project > API > Tokens > Add API Token |

**Notes:**
- **CRITICAL**: Never commit this value to version control
- Grant **Editor** permissions (read + write) for full CMS functionality
- The read client uses CDN and does not require this token
- The write client uses this token for admin CRUD operations
- Tokens starting with `sk` are secret tokens; `skS` are public (read-only) tokens

---

## Cloudinary

### `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

| Property | Value |
|----------|-------|
| **Description** | Cloudinary cloud name for image CDN |
| **Required** | Yes |
| **Public** | Yes (exposed to browser) |
| **Example** | `nabila-salon` |
| **Where to obtain** | Cloudinary Dashboard > Account Details > Cloud Name |

**Notes:**
- The cloud name is part of the image URL: `https://res.cloudinary.com/{cloud-name}/`
- Safe to expose publicly (it is part of every image URL)
- Must match between client and server configurations

### `CLOUDINARY_API_KEY`

| Property | Value |
|----------|-------|
| **Description** | Cloudinary API key for server-side operations |
| **Required** | Yes (for server-side uploads) |
| **Public** | No (server only) |
| **Example** | `123456789012345` |
| **Where to obtain** | Cloudinary Dashboard > Account Details > API Key |

**Notes:**
- Used together with the API secret for authenticated API calls
- The API key alone is not sufficient for authentication (secret is also required)
- Used for server-side upload, transformation, and management operations

### `CLOUDINARY_API_SECRET`

| Property | Value |
|----------|-------|
| **Description** | Cloudinary API secret for server-side authentication |
| **Required** | Yes (for server-side uploads) |
| **Public** | No (server only - CRITICAL SECRET) |
| **Example** | `abcdefghijklmnopqrstuvwxyz123456` |
| **Where to obtain** | Cloudinary Dashboard > Account Details > API Secret |

**Notes:**
- **CRITICAL**: Never commit this value to version control
- Combined with the API key for authenticated Cloudinary API calls
- If this is exposed, regenerate it immediately in the Cloudinary dashboard
- Not needed for client-side unsigned uploads (upload preset is used instead)

### `CLOUDINARY_UPLOAD_PRESET`

| Property | Value |
|----------|-------|
| **Description** | Cloudinary upload preset for image uploads |
| **Required** | Yes (for client-side uploads) |
| **Public** | Yes (exposed to browser) |
| **Example** | `nabila-salon` |
| **Where to obtain** | Cloudinary Dashboard > Settings > Upload > Upload Presets |

**Notes:**
- Defines the upload configuration (folder, max size, allowed formats, transformations)
- Can be unsigned (for client-side uploads) or signed (more secure)
- Create a dedicated preset for this application with appropriate restrictions
- Recommended preset settings:
  - Folder: `nabila-salon`
  - Max file size: 5MB
  - Allowed formats: jpg, png, webp, gif
  - Auto quality and format transformation

---

## Application

### Additional Variables (Optional)

These variables are not currently required by the codebase but may be useful for future enhancements:

#### `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`

| Property | Value |
|----------|-------|
| **Description** | Google Analytics 4 measurement ID (alternative to Firebase Analytics) |
| **Required** | No |
| **Public** | Yes |
| **Example** | `G-ABC1234567` |

#### `NEXT_PUBLIC_GTM_ID`

| Property | Value |
|----------|-------|
| **Description** | Google Tag Manager container ID |
| **Required** | No |
| **Public** | Yes |
| **Example** | `GTM-ABC1234` |

#### `GOOGLE_SITE_VERIFICATION`

| Property | Value |
|----------|-------|
| **Description** | Google Search Console verification code |
| **Required** | No |
| **Public** | No |
| **Example** | `abc123def456ghi789` |

---

## Quick Setup by Environment

### Development (.env)

```env
DATABASE_URL=file:./db/custom.db

# Firebase (use your dev project or emulators)
NEXT_PUBLIC_FIREBASE_API_KEY=your-dev-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-dev-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-dev-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-dev-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-dev-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false

# Firebase Admin (optional in dev, uses fallback)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# NextAuth
NEXTAUTH_SECRET=dev-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Sanity (use development dataset)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
NEXT_PUBLIC_SANITY_DATASET=development
SANITY_API_TOKEN=your-sanity-api-token

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_PRESET=nabila-salon-dev
```

### Preview (Vercel)

Set the same variables as Development but with:

- `NEXTAUTH_URL` = `https://your-preview-url.vercel.app`
- `NEXT_PUBLIC_APP_URL` = `https://your-preview-url.vercel.app`
- `NEXT_PUBLIC_SANITY_DATASET` = `production` (or `staging`)
- `NEXT_PUBLIC_USE_FIREBASE_EMULATORS` = `false`
- Firebase Admin credentials populated
- All secrets from the production Firebase project

### Production (Vercel)

Set all variables with production values:

- `DATABASE_URL` = production database connection string
- `NEXTAUTH_URL` = `https://nabilalahore.com`
- `NEXT_PUBLIC_APP_URL` = `https://nabilalahore.com`
- All Firebase credentials from the production project
- All Sanity credentials for the production dataset
- All Cloudinary credentials from the production account
- `NEXT_PUBLIC_USE_FIREBASE_EMULATORS` = `false`
- Strong `NEXTAUTH_SECRET` generated with `openssl rand -base64 48`

---

## Security Best Practices

### 1. Never Commit Secrets

```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production.local" >> .gitignore

# Verify no secrets are committed
git log --all --full-history -- "*.env" "*.env.local"
```

### 2. Rotate Compromised Secrets Immediately

If any secret is accidentally committed or exposed:

1. **NEXTAUTH_SECRET**: Generate a new one, update in Vercel, redeploy
2. **FIREBASE_ADMIN_PRIVATE_KEY**: Generate a new service account key, update in Vercel
3. **SANITY_API_TOKEN**: Revoke the old token, create a new one, update in Vercel
4. **CLOUDINARY_API_SECRET**: Regenerate in Cloudinary dashboard, update in Vercel

### 3. Use Vercel Encrypted Environment Variables

Vercel encrypts all environment variables at rest. For additional security:

- Use Vercel's **Sensitive Environment Variables** feature for secrets
- Sensitive values are masked in the Vercel dashboard
- They can only be accessed by the deployment runtime

### 4. Separate Environments

- Use different Firebase projects for development and production
- Use different Sanity datasets for development and production
- Use different Cloudinary cloud names (or folders) for different environments
- NEVER use production credentials in development

### 5. Regular Audits

- Review Vercel environment variables quarterly
- Remove unused variables
- Rotate secrets annually or after any team member departure
- Audit Firebase service account permissions

### 6. Least Privilege Principle

- Sanity API token: Use **Editor** role (not Administrator) if only content management is needed
- Cloudinary: Use upload presets with restricted formats and sizes
- Firebase: Use the most restrictive Firestore and Storage rules possible

---

*Last updated: 2025*
