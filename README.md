# Beauty Care by Nabila Lahore

> Luxury Salon & Bridal Studio — M.M. Alam Road, Gulberg III, Lahore

A premium, world-class website for Beauty Care by Nabila Lahore, featuring an immersive luxury experience with cinematic animations, bespoke bridal studio showcase, and a complete booking system.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS 4 + Custom Luxury Design System |
| Animations | Framer Motion + GSAP |
| Authentication | NextAuth.js v4 |
| Database | Prisma ORM (SQLite dev / PostgreSQL prod) |
| CMS | Sanity.io |
| Media | Cloudinary |
| Analytics | Google Analytics + GTM |
| Deployment | Vercel |
| State Management | Zustand |

---

## Quick Start

### Prerequisites

- **Node.js** 18.17+ or **Bun** 1.0+
- **Git** 2.30+

### 1. Clone & Install

```bash
git clone https://github.com/hamzajugnu786-tech/beauty-care-by-nabila.git
cd beauty-care-by-nabila
bun install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your project-specific values. See [ENVIRONMENT_SETUP.md](./docs/ENVIRONMENT_SETUP.md) for detailed instructions.

### 3. Database Setup

```bash
bun run db:push
```

### 4. Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 5. Production Build

```bash
bun run build
bun run start
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── about/             # About page
│   ├── bridal/            # Bridal Studio page
│   ├── booking/           # Booking page
│   ├── contact/           # Contact page
│   ├── gallery/           # Gallery page
│   ├── services/          # Services page
│   ├── vip/               # VIP Membership page
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── sections/          # Page sections (Hero, Services, etc.)
│   ├── booking/           # Booking system components
│   ├── ui/                # Reusable UI components + shadcn/ui
│   ├── accessibility/     # Accessibility components
│   ├── performance/       # Performance optimization components
│   ├── seo/               # SEO components
│   └── shared/            # Shared components
├── lib/                   # Core libraries & configuration
│   ├── constants.ts       # Brand data, services, packages
│   ├── env.ts             # Environment variable configuration
│   ├── firebase.ts        # Firebase client SDK
│   ├── firebase-admin.ts  # Firebase Admin SDK
│   ├── sanity/            # Sanity CMS client & schemas
│   ├── auth.ts            # NextAuth configuration
│   └── ...                # Other utilities
├── stores/                # Zustand state management
├── hooks/                 # Custom React hooks
└── middleware.ts          # Security + admin route protection
```

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Cinematic hero, services, bridal showcase, testimonials, gallery |
| Bridal Studio | `/bridal` | Bridal packages, artists, timeline |
| Services | `/services` | All service categories with detailed listings |
| Gallery | `/gallery` | Portfolio with category filtering |
| VIP Membership | `/vip` | Exclusive VIP membership tiers and benefits |
| About | `/about` | Brand story, team, values |
| Contact | `/contact` | Contact form, map, business hours |
| Booking | `/booking` | Online appointment booking system |
| Admin | `/admin` | Protected admin dashboard |

---

## Environment Variables

All configuration is environment-based. No hardcoded credentials or project IDs.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXTAUTH_SECRET` | Yes | Authentication secret (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase client API key |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity CMS project ID |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `DATABASE_URL` | Yes | Database connection string |
| `ADMIN_EMAIL` | Yes | Admin access email |

See [`.env.example`](./.env.example) for the complete list.

---

## Deployment

### Vercel (Recommended)

1. Push code to the GitHub repository
2. Connect the repository in [Vercel Dashboard](https://vercel.com/new)
3. Configure environment variables in Vercel project settings
4. Deploy

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

---

## Security

- CSP headers configured for production
- Rate limiting on API routes
- Admin routes protected with NextAuth JWT + role-based access
- Bot detection and blocking for malicious scanners
- CORS configured for allowed origins only
- Request size validation

---

## Project Isolation

This project is **completely isolated** from all other projects:

- Separate Firebase project and service account
- Separate Sanity CMS project and dataset
- Separate Cloudinary account/cloud
- Separate Vercel project and deployment
- Separate database instance
- No shared API keys, auth systems, or storage buckets
- All configuration via environment variables (no hardcoded values)

---

## Ownership Transfer

This project is designed for smooth client ownership transfer. See [OWNERSHIP_TRANSFER.md](./docs/OWNERSHIP_TRANSFER.md) for the complete handoff process.

---

## License

Proprietary — All rights reserved by Beauty Care by Nabila Lahore.
