# Ownership Transfer Guide — Beauty Care by Nabila Lahore

Complete guide for transferring project ownership to the final client. This covers all services, accounts, and configurations.

---

## Transfer Overview

The project is designed for smooth ownership transfer with:
- No hardcoded credentials or project IDs
- All configuration via environment variables
- Portable architecture with clean separation of concerns
- Dedicated project resources (no shared services)

---

## Phase 1: Pre-Transfer Preparation

### 1.1 Audit Project Isolation

- [ ] Verify NO references to other projects in the codebase
- [ ] Confirm all API keys are project-specific (not shared with other projects)
- [ ] Ensure no cross-project database references
- [ ] Check that all Firebase, Sanity, and Cloudinary resources are dedicated

### 1.2 Clean Up

- [ ] Remove any development/test data from the database
- [ ] Remove any test user accounts from Firebase Authentication
- [ ] Clear development logs and temporary files
- [ ] Update `ADMIN_EMAIL` to the client's email
- [ ] Generate fresh secrets (`NEXTAUTH_SECRET`, `CSRF_SECRET`)

### 1.3 Documentation Package

Ensure the following documents are ready for the client:
- [ ] This Ownership Transfer Guide
- [ ] Deployment Guide (`docs/DEPLOYMENT.md`)
- [ ] Environment Setup Guide (`docs/ENVIRONMENT_SETUP.md`)
- [ ] `.env.example` with all variable descriptions

---

## Phase 2: Service-by-Service Transfer

### 2.1 GitHub Repository Transfer

**Option A: Transfer Ownership (Recommended)**

1. Go to GitHub → Repository → Settings → General → Danger Zone
2. Click **"Transfer"**
3. Enter the client's GitHub username or organization
4. The client receives a transfer request to accept

**Option B: Client Forks the Repository**

1. Client creates a GitHub account (if they don't have one)
2. Client forks the repository to their account
3. Update Vercel to point to the client's fork
4. Archive the original repository

**Post-Transfer:**

- [ ] Client has full admin access to the repository
- [ ] Update any CI/CD webhooks to point to the new repository
- [ ] Verify branch protection rules are set (if desired)

### 2.2 Vercel Project Transfer

1. Go to Vercel Dashboard → Project → Settings → General
2. Scroll to **"Transfer Project"**
3. Enter the client's Vercel account email
4. The client receives a transfer request

**Alternative: Re-deploy under client's account**

1. Client creates their own Vercel account
2. Client imports the GitHub repository
3. Client adds all environment variables (provide the `.env.local` values securely)
4. Client deploys
5. Delete the old Vercel project

**Post-Transfer:**

- [ ] Custom domain DNS records updated to point to client's Vercel account
- [ ] SSL certificate re-issued (automatic)
- [ ] All environment variables configured in client's Vercel project

### 2.3 Firebase Project Transfer

Firebase projects can be transferred by changing ownership:

1. Go to [Firebase Console](https://console.firebase.google.com) → Project Settings
2. Under **"Users and permissions"**, add the client's Google account as **Owner**
3. The client accepts the invitation
4. Remove your account after the client confirms access

**Alternative: Client creates their own Firebase project**

1. Client creates a new Firebase project
2. Update all `FIREBASE_*` environment variables
3. Migrate any existing data (Firestore, Storage, Auth users)
4. Verify everything works with the new project

**Post-Transfer:**

- [ ] Client has Owner access to the Firebase project
- [ ] Firebase Authentication configured with client's preferred methods
- [ ] Firestore security rules reviewed and deployed
- [ ] Storage security rules reviewed and deployed
- [ ] Analytics linked to client's Google Analytics

### 2.4 Sanity CMS Transfer

1. Go to [Sanity Manage](https://www.sanity.io/manage) → Project → Settings
2. Under **"Members"**, invite the client's email as **Administrator**
3. The client accepts and gets full access

**Alternative: Client creates their own Sanity project**

1. Client creates a new Sanity project
2. Update `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_API_TOKEN`
3. Migrate content using Sanity's export/import tools:
   ```bash
   # Export from current project
   npx sanity dataset export production backup.tar.gz

   # Import to new project
   npx sanity dataset import backup.tar.gz production --project-id <new-id>
   ```

**Post-Transfer:**

- [ ] Client has Administrator access to Sanity project
- [ ] Content migrated and verified
- [ ] API tokens regenerated under client's account

### 2.5 Cloudinary Transfer

1. Go to [Cloudinary Console](https://console.cloudinary.com) → Settings → Account
2. Transfer account ownership to client's email
3. Or: Client creates their own Cloudinary account

**If creating a new Cloudinary account:**

1. Update all `CLOUDINARY_*` environment variables
2. Migrate existing media assets
3. Update any hardcoded image URLs in the database

**Post-Transfer:**

- [ ] Client has access to Cloudinary account
- [ ] All media assets accessible
- [ ] Upload preset configured

### 2.6 Domain Name Transfer

1. Ensure the client owns or has access to the domain registrar
2. Update DNS records to point to the client's Vercel deployment:
   - **CNAME**: `nabilalahore.com` → `cname.vercel-dns.com`
   - **A Record**: `76.76.21.21` (Vercel's IP)
3. Verify domain propagation: `dig nabilalahore.com`

**Post-Transfer:**

- [ ] Domain resolves to client's Vercel deployment
- [ ] SSL certificate active
- [ ] All `NEXT_PUBLIC_*_URL` variables updated

---

## Phase 3: Environment Variable Handoff

Provide the client with a secure `.env.production` file containing all production values.

**Security Best Practices:**

1. **Never send secrets via email or messaging apps** — use a secure password manager or encrypted file sharing
2. **Regenerate all secrets** before handoff:
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32`
   - `CSRF_SECRET` — `openssl rand -base64 32`
   - Firebase Admin Private Key — Generate new from Firebase Console
   - Sanity API Token — Create new token
   - Cloudinary API Secret — Regenerate from console
   - Webhook secrets — Generate new values
3. **Verify** the client has successfully set all variables before going live

---

## Phase 4: Final Verification

### Client Verification Checklist

- [ ] Website loads at the production domain
- [ ] All pages render correctly
- [ ] Authentication works (sign up, sign in, sign out)
- [ ] Admin dashboard accessible
- [ ] Booking system functional
- [ ] Contact form sends messages
- [ ] Gallery displays images
- [ ] CMS content editable
- [ ] Analytics tracking active
- [ ] SSL certificate active
- [ ] No console errors in production

### Technical Verification

- [ ] All environment variables set in Vercel
- [ ] Firebase project fully transferred
- [ ] Sanity project fully transferred
- [ ] Cloudinary account accessible
- [ ] GitHub repository accessible
- [ ] No remaining access from developer accounts (after handoff)

---

## Phase 5: Post-Transfer Support

### Recommended Support Period

- **Week 1-2**: Daily monitoring, address any issues
- **Week 3-4**: As-needed support
- **Month 2+**: Emergency support only

### Knowledge Transfer

Provide the client with:
1. How to access each service's dashboard
2. How to update content via Sanity CMS
3. How to manage bookings via Admin Dashboard
4. How to deploy updates via Vercel
5. How to monitor analytics and performance
6. Emergency contacts for critical issues

---

## Emergency Rollback

If a transfer goes wrong:

1. **Vercel**: Re-deploy from the last known working commit
2. **Firebase**: Restore from backup (enable automated backups before transfer)
3. **Database**: Restore from the latest Prisma migration
4. **DNS**: Revert DNS changes at the registrar level

---

## Contact Information Template

Provide to the client for their records:

```
Project: Beauty Care by Nabila Lahore
Repository: https://github.com/[client-org]/beauty-care-by-nabila
Production URL: https://nabilalahore.com
Vercel Dashboard: https://vercel.com/[client-account]
Firebase Console: https://console.firebase.google.com/project/nabila-lahore
Sanity Studio: https://[project-id].sanity.studio
Cloudinary: https://console.cloudinary.com/[cloud-name]
Domain Registrar: [registrar-name]
```
