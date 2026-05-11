# Production Launch Checklist

> Beauty Care by Nabila - Complete production readiness verification

---

## 1. Pre-Deployment Checks

### TypeScript & Build

- [ ] Zero TypeScript errors: `npx tsc --noEmit`
- [ ] ESLint passes with zero warnings: `bun run lint`
- [ ] Production build succeeds: `bun run build`
- [ ] No console.log statements remaining in production code
- [ ] No TODO/FIXME comments in critical paths
- [ ] All imports resolve correctly (no circular dependencies)
- [ ] Standalone output builds correctly in `.next/standalone/`
- [ ] Bundle size is within acceptable limits (< 300KB initial JS)
- [ ] No dynamic import errors for lazy-loaded components
- [ ] Prisma client generated: `bun run db:generate`

### Environment & Configuration

- [ ] All required environment variables are set (see ENV_GUIDE.md)
- [ ] No placeholder values in production env vars (no `your-*` patterns)
- [ ] `.env` file is NOT committed to version control
- [ ] `.env.example` is up to date with all current variables
- [ ] `NEXTAUTH_SECRET` is a cryptographically random 32+ character string
- [ ] `NEXTAUTH_URL` matches the production domain
- [ ] `NEXT_PUBLIC_APP_URL` matches the production domain with https://
- [ ] Firebase config values match the production Firebase project
- [ ] Sanity project ID and dataset are for production, not development
- [ ] Database URL points to production database (not local SQLite for production)

---

## 2. SEO Verification

### Metadata & Open Graph

- [ ] Every page has a unique `<title>` tag under 60 characters
- [ ] Every page has a unique `meta description` under 160 characters
- [ ] Open Graph tags present on all pages (og:title, og:description, og:image, og:url)
- [ ] Twitter Card tags present (twitter:card, twitter:title, twitter:description, twitter:image)
- [ ] Canonical URL set on all pages with correct `metadataBase`
- [ ] `hreflang` tags for language variants (en-PK)
- [ ] OG images are 1200x630px, under 1MB, in JPEG/PNG format
- [ ] Default OG image exists at `/public/images/og-default.jpg`
- [ ] Twitter card image exists at `/public/images/twitter-card.jpg`

### Sitemap & Robots

- [ ] `sitemap.ts` generates valid XML sitemap at `/sitemap.xml`
- [ ] Sitemap includes all public pages (home, services, bridal, gallery, about, contact, booking)
- [ ] Sitemap excludes admin routes and API routes
- [ ] Sitemap `<lastmod>` dates are accurate
- [ ] `robots.ts` generates correct robots.txt at `/robots.txt`
- [ ] robots.txt allows all major search engine crawlers
- [ ] robots.txt disallows `/admin/`, `/api/`, and private routes
- [ ] Sitemap URL is referenced in robots.txt

### Structured Data

- [ ] LocalBusiness schema on homepage with correct NAP (Name, Address, Phone)
- [ ] Service schema for each service listing
- [ ] FAQ schema on relevant pages
- [ ] BreadcrumbList schema on interior pages
- [ ] Review/AggregateRating schema for testimonials
- [ ] All structured data validates with Google Rich Results Test
- [ ] No structured data errors in Google Search Console

### Additional SEO

- [ ] Google Site Verification meta tag configured
- [ ] Bing Webmaster verification tag configured
- [ ] All images have descriptive `alt` text
- [ ] Heading hierarchy is correct (single H1, logical H2-H6)
- [ ] Internal links are not broken (no 404s)
- [ ] External links use `rel="noopener noreferrer"` where appropriate

---

## 3. Performance Verification

### Core Web Vitals Targets

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| LCP (Largest Contentful Paint) | < 2.5s | < 4.0s | > 4.0s |
| FID (First Input Delay) | < 100ms | < 300ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.25 | > 0.25 |
| INP (Interaction to Next Paint) | < 200ms | < 500ms | > 500ms |
| TTFB (Time to First Byte) | < 800ms | < 1800ms | > 1800ms |
| FCP (First Contentful Paint) | < 1.8s | < 3.0s | > 3.0s |

### Image Optimization

- [ ] All images use Next.js `<Image>` component with proper width/height
- [ ] AVIF and WebP formats enabled in next.config.ts
- [ ] Responsive `sizes` attribute set on all images
- [ ] Lazy loading enabled for below-fold images (`loading="lazy"`)
- [ ] Priority loading for above-fold images (`priority` prop)
- [ ] Placeholder blur for image loading states
- [ ] Cloudinary CDN configured for uploaded images
- [ ] Sanity image CDN configured for CMS images
- [ ] No uncompressed images in `/public` directory

### Code Splitting & Loading

- [ ] Heavy components use dynamic imports (`next/dynamic`)
- [ ] Framer Motion animations use `LazySection` wrapper
- [ ] Package imports optimized via `optimizePackageImports`
- [ ] No unused CSS (Tailwind purging works correctly)
- [ ] Font loading is optimized (swap strategy, preloading)
- [ ] Third-party scripts load asynchronously or deferred
- [ ] No render-blocking resources above the fold

### Caching

- [ ] Static assets have immutable cache headers (1 year)
- [ ] API routes have appropriate cache-control headers
- [ ] Image optimization cache TTL set (1 year minimum)
- [ ] Font files cached with CORS and long TTL
- [ ] Service worker caching strategy defined (if applicable)

---

## 4. Accessibility Verification

### WCAG 2.1 AA Compliance

- [ ] Color contrast ratios meet 4.5:1 for normal text
- [ ] Color contrast ratios meet 3:1 for large text (18px+ bold or 24px+)
- [ ] Interactive elements have minimum 44px touch targets
- [ ] Focus indicators are visible and have 3:1 contrast
- [ ] No information conveyed by color alone
- [ ] Text resizes up to 200% without loss of functionality

### Keyboard Navigation

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order follows logical reading order
- [ ] Focus is trapped in modals and dialogs
- [ ] Skip-to-content link is present and functional
- [ ] No keyboard traps anywhere on the site
- [ ] Escape key closes modals/dropdowns/dialogs

### Screen Reader Support

- [ ] All images have descriptive `alt` text
- [ ] Decorative images have empty `alt=""` or `aria-hidden="true"`
- [ ] Form inputs have associated `<label>` elements
- [ ] Error messages are announced to screen readers
- [ ] ARIA landmarks are used (`main`, `nav`, `footer`, `header`)
- [ ] ARIA live regions for dynamic content updates
- [ ] Page title updates on route changes
- [ ] Landmark regions are properly labeled

### Semantic HTML

- [ ] Proper heading hierarchy (no skipped levels)
- [ ] `<main>` landmark wraps primary content
- [ ] `<nav>` landmarks for navigation
- [ ] `<button>` used for actions, `<a>` for navigation
- [ ] Lists use `<ul>`, `<ol>`, `<li>` elements
- [ ] Tables use proper `<thead>`, `<tbody>`, `<th>` elements
- [ ] Forms use `<form>` element with proper `action`

### Accessibility Statement

- [ ] Accessibility statement page exists at `/accessibility-statement`
- [ ] Statement includes conformance level
- [ ] Contact information for accessibility issues is provided
- [ ] Known limitations are documented

---

## 5. Security Verification

### HTTP Security Headers

- [ ] `X-Frame-Options: DENY` set on all responses
- [ ] `X-Content-Type-Options: nosniff` set on all responses
- [ ] `Strict-Transport-Security` with preload and includeSubDomains
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Content-Security-Policy` configured and not too permissive
- [ ] `Permissions-Policy` restricts camera, microphone, geolocation
- [ ] `X-Powered-By` header removed (poweredByHeader: false)
- [ ] Cross-origin policies set (COOP, CORP, COEP)

### Authentication & Authorization

- [ ] NextAuth secret is a strong, random value
- [ ] JWT session maxAge is set (24 hours)
- [ ] Admin routes protected by middleware
- [ ] Role-based access control works (super-admin, manager, staff)
- [ ] Staff role cannot access settings or staff management
- [ ] Firebase Admin SDK uses service account credentials
- [ ] CSRF protection is enabled on mutation endpoints
- [ ] Login attempts are rate-limited (5 per 15 minutes)

### Input Validation & Sanitization

- [ ] All form inputs are validated with Zod schemas
- [ ] XSS patterns are detected and sanitized
- [ ] SQL injection patterns are detected and blocked
- [ ] Phone numbers validated for Pakistan format
- [ ] Email addresses validated with regex
- [ ] File uploads validated for type, size, and filename safety
- [ ] Request size limits enforced (100KB JSON, 5MB multipart)

### CORS & API Security

- [ ] CORS only allows the production domain
- [ ] No wildcard `Access-Control-Allow-Origin` in production
- [ ] API routes require authentication where needed
- [ ] Rate limiting configured per route type
- [ ] Bot detection blocks known malicious user agents
- [ ] No sensitive data in URL parameters
- [ ] Error responses do not leak stack traces or internal details

### Firebase Security

- [ ] Firestore rules deployed (see firebase.rules)
- [ ] Storage rules deployed (see firebase.storage.rules)
- [ ] No `allow read, write: if true;` rules in production
- [ ] Admin-only write access enforced
- [ ] Public read access limited to necessary collections

---

## 6. Content Verification

### Pages

- [ ] Homepage loads correctly with all sections
- [ ] Services page displays all service categories
- [ ] Bridal Studio page shows packages and artists
- [ ] Gallery page loads and filters work
- [ ] About page content is accurate
- [ ] Contact page displays correct information
- [ ] Booking flow works end-to-end
- [ ] Admin dashboard loads and functions
- [ ] Admin bookings management works
- [ ] Admin services CRUD works
- [ ] Admin staff management works
- [ ] Admin gallery management works
- [ ] Admin testimonials management works
- [ ] Admin blog management works
- [ ] Admin settings page loads

### Brand Information

- [ ] Business name: "Beauty Care by Nabila"
- [ ] Address: "M.M. Alam Road, Gulberg III, Lahore, Pakistan"
- [ ] Phone number is correct and clickable
- [ ] WhatsApp link works correctly
- [ ] Email address is correct
- [ ] Business hours are accurate
- [ ] Social media links point to correct profiles

### Images

- [ ] All images in `/public/images/` exist and are optimized
- [ ] No broken image references
- [ ] Gallery images load from CDN
- [ ] Artist/staff photos are correct
- [ ] Logo SVG renders correctly
- [ ] Favicon and app icons are present

### Links & Forms

- [ ] All internal links work (no 404s)
- [ ] All external links open in new tab with `rel="noopener noreferrer"`
- [ ] Booking form validates and submits correctly
- [ ] Contact form (if exists) works
- [ ] WhatsApp concierge button links correctly

---

## 7. Analytics Setup

### Google Analytics

- [ ] Google Analytics 4 measurement ID configured (`NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`)
- [ ] Analytics script loads on all public pages
- [ ] Page view events fire on route changes
- [ ] Custom events configured for key interactions:
  - [ ] Booking initiated
  - [ ] Booking completed
  - [ ] Service viewed
  - [ ] Contact initiated (WhatsApp/phone)
  - [ ] Gallery image viewed
- [ ] Analytics does not track admin pages
- [ ] Cookie consent banner implemented (if required by local law)

### Google Search Console

- [ ] Property verified for production domain
- [ ] Sitemap submitted
- [ ] No critical coverage issues
- [ ] No manual actions
- [ ] URL inspection tool confirms pages are indexable

### Vercel Analytics

- [ ] Vercel Analytics enabled in project settings
- [ ] Web Vitals data is being collected
- [ ] Custom analytics events configured (if needed)

---

## 8. Firebase Configuration Verification

### Firebase Project

- [ ] Production Firebase project created (not the dev project)
- [ ] Firebase Authentication enabled
- [ ] Email/Password sign-in method enabled
- [ ] Firestore Database created in production mode
- [ ] Storage bucket created and accessible
- [ ] Firebase Admin SDK service account key generated
- [ ] Custom claims set for admin users (super-admin, manager, staff)

### Firestore

- [ ] Production Firestore rules deployed
- [ ] Indexes created for common queries
- [ ] Composite indexes for booking queries (date + artistId + status)
- [ ] Database location set to asia-south1 (Mumbai) or nearby

### Firebase Auth

- [ ] Admin user accounts created
- [ ] Strong passwords set for all admin accounts
- [ ] Email verification enabled (optional)
- [ ] Password reset flow works

### Firebase Storage

- [ ] Storage rules deployed
- [ ] CORS configuration set for web uploads
- [ ] Folder structure created (gallery/, staff/, services/, blog/)

---

## 9. Sanity CMS Configuration Verification

### Sanity Project

- [ ] Production Sanity project created
- [ ] Dataset set to "production"
- [ ] API token generated with correct permissions (read + write for admin)
- [ ] CDN enabled for production queries
- [ ] CORS origins include production domain

### Schemas

- [ ] All schemas deployed and accessible in Studio:
  - [ ] post (blog posts)
  - [ ] author
  - [ ] service
  - [ ] testimonial
  - [ ] galleryImage
  - [ ] siteSettings
  - [ ] staffMember
  - [ ] seoFields (object type)

### Content

- [ ] Site settings document created
- [ ] At least one testimonial is published
- [ ] Services content matches the application
- [ ] Gallery images uploaded with alt text
- [ ] Blog posts have cover images and excerpts

---

## 10. Cloudinary Configuration Verification

### Cloudinary Account

- [ ] Cloud name configured
- [ ] API key and secret set in environment variables
- [ ] Upload preset created for unsigned uploads (if client-side uploads needed)
- [ ] Upload preset configured with:
  - [ ] Allowed formats: jpg, png, webp, gif
  - [ ] Maximum file size: 5MB
  - [ ] Folder: `nabila-salon/`
- [ ] Transformation presets created:
  - [ ] Thumbnail (200x200, fill, quality auto)
  - [ ] Gallery (800x600, fill, quality auto)
  - [ ] Hero (1920x1080, fill, quality auto)
  - [ ] OG Image (1200x630, fill, quality auto)

### Integration

- [ ] Cloudinary URL format works: `res.cloudinary.com/{cloud_name}/`
- [ ] Next.js image remotePatterns includes Cloudinary
- [ ] Upload widget or API integration works

---

## 11. SSL/HTTPS Verification

- [ ] SSL certificate is valid and not expired
- [ ] Certificate covers the primary domain and www subdomain
- [ ] HTTPS redirect is enforced (HTTP returns 301 to HTTPS)
- [ ] HSTS header is set with preload
- [ ] Mixed content warnings do not appear (all resources load over HTTPS)
- [ ] SSL Labs test scores A or A+
- [ ] Certificate auto-renewal is configured

---

## 12. Domain & DNS Configuration

### DNS Records

- [ ] A record points to Vercel IP (76.76.21.21)
- [ ] CNAME record for www points to `cname.vercel-dns.com`
- [ ] MX records configured for email (if using custom email)
- [ ] TXT records for domain verification
- [ ] SPF record configured (if sending email from domain)
- [ ] DKIM record configured (if sending email from domain)

### Domain Settings

- [ ] Primary domain configured in Vercel
- [ ] www subdomain redirects to primary (or vice versa)
- [ ] Domain verification completed in Vercel
- [ ] SSL certificate provisioned automatically by Vercel

---

## 13. Backup & Monitoring Setup

### Database Backups

- [ ] Firestore automated backups configured
- [ ] Backup schedule: daily at off-peak hours
- [ ] Backup retention: at least 30 days
- [ ] Backup restoration tested at least once
- [ ] SQLite (if used) has regular file backup strategy

### Uptime Monitoring

- [ ] Uptime monitoring configured (Vercel built-in or external like UptimeRobot)
- [ ] Alert channels configured (email, Slack, SMS)
- [ ] Monitor checks homepage, booking page, and admin login
- [ ] Response time alerts set for > 5 seconds
- [ ] SSL certificate expiry monitoring

### Error Monitoring

- [ ] Vercel error tracking enabled
- [ ] JavaScript error reporting configured
- [ ] API error rate alerting configured
- [ ] Unhandled rejection monitoring
- [ ] Log aggregation service configured (optional: Datadog, Sentry)

### Performance Monitoring

- [ ] Vercel Analytics enabled
- [ ] Core Web Vitals monitored in real-user data
- [ ] Serverless function duration monitored
- [ ] Image optimization performance tracked
- [ ] API response time percentiles tracked

---

## 14. Load Testing Considerations

### Traffic Estimates

- [ ] Estimated concurrent users during peak: 50-100
- [ ] Estimated booking submissions per hour during peak: 10-20
- [ ] Estimated page views per minute: 200-500

### Vercel Limits (Pro Plan)

- [ ] Serverless function execution: 60s max (configurable)
- [ ] Function memory: 1024MB default (configurable up to 3008MB)
- [ ] Edge function execution: 30s max
- [ ] Image optimization: included in plan, no hard limit
- [ ] Bandwidth: 1TB/month (Pro plan)

### Recommended Tests

- [ ] Homepage load test with 100 concurrent users
- [ ] Booking flow test with 20 concurrent submissions
- [ ] Admin dashboard test with 5 concurrent admin users
- [ ] API endpoint stress test for `/api/bookings` and `/api/availability`
- [ ] Static asset CDN performance test
- [ ] Mobile 3G/4G throttling test

---

## 15. Post-Deployment Smoke Tests

### Immediate (within 30 minutes of deployment)

- [ ] Homepage loads without errors
- [ ] All navigation links work
- [ ] Booking page loads and form is functional
- [ ] Admin login works with production credentials
- [ ] Admin dashboard loads correctly
- [ ] Firebase Auth login works
- [ ] Firestore reads/writes work from admin panel
- [ ] Image uploads work (Cloudinary or Storage)
- [ ] SEO meta tags render correctly (view page source)
- [ ] robots.txt accessible at `/robots.txt`
- [ ] sitemap.xml accessible at `/sitemap.xml`
- [ ] No JavaScript console errors on any page
- [ ] Mobile layout renders correctly
- [ ] Dark/light theme toggle works
- [ ] WhatsApp concierge link works

### Short-term (within 24 hours)

- [ ] Google Search Console shows pages being indexed
- [ ] Google Analytics shows real-time traffic
- [ ] Vercel Analytics shows Web Vitals data
- [ ] No error spikes in Vercel deployment logs
- [ ] Booking confirmation emails (if configured) are sent
- [ ] All form submissions reach the database
- [ ] Image optimization cache is warming up
- [ ] CDN cache hit rate is increasing

### Medium-term (within 1 week)

- [ ] Core Web Vitals meet targets in real-user data
- [ ] Google has indexed all public pages
- [ ] No 404 errors in Search Console
- [ ] All admin workflows function smoothly
- [ ] No unexpected billing from Firebase or Cloudinary
- [ ] Uptime is 99.9%+
- [ ] Backup restoration verified

---

## Sign-Off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Developer | | | |
| Designer | | | |
| QA / Tester | | | |
| Project Manager | | | |
| Client (Nabila) | | | |

---

*This checklist should be reviewed and updated with each major release.*
*Last updated: 2025*
