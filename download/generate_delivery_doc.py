#!/usr/bin/env python3
"""
Generate comprehensive Client Delivery Documentation for
Beauty Care by Nabila Lahore — Luxury Salon Platform
"""

from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_ORIENT
import os

OUTPUT = "/home/z/my-project/download/Client_Delivery_Documentation.docx"

doc = Document()

# ─── Page Setup ───
for section in doc.sections:
    section.top_margin = Cm(2.54)
    section.bottom_margin = Cm(2.54)
    section.left_margin = Cm(2.54)
    section.right_margin = Cm(2.54)

# ─── Style Helpers ───
style = doc.styles['Normal']
font = style.font
font.name = 'Calibri'
font.size = Pt(11)
font.color.rgb = RGBColor(0x1C, 0x1C, 0x1C)

GOLD = RGBColor(0xD4, 0xAF, 0x37)
DARK = RGBColor(0x0C, 0x0C, 0x10)
ACCENT = RGBColor(0x8B, 0x7E, 0x5A)
BODY = RGBColor(0x1C, 0x2A, 0x3D)
SECONDARY = RGBColor(0x5B, 0x6B, 0x7D)

def add_heading_styled(text, level=1):
    h = doc.add_heading(text, level=level)
    for run in h.runs:
        run.font.color.rgb = DARK if level <= 2 else BODY
        run.font.name = 'Calibri'
    return h

def add_para(text, bold=False, italic=False, indent=False):
    p = doc.add_paragraph()
    if indent:
        p.paragraph_format.left_indent = Cm(1)
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(11)
    run.font.color.rgb = BODY
    run.bold = bold
    run.italic = italic
    return p

def add_bullet(text, level=0):
    p = doc.add_paragraph(text, style='List Bullet')
    p.paragraph_format.left_indent = Cm(1.5 + level * 1)
    for run in p.runs:
        run.font.name = 'Calibri'
        run.font.size = Pt(11)
        run.font.color.rgb = BODY
    return p

def add_table(headers, rows):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = 'Light Grid Accent 1'
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Headers
    for i, h in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = h
        for p in cell.paragraphs:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs:
                run.bold = True
                run.font.name = 'Calibri'
                run.font.size = Pt(10)
                run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    # Data rows
    for r_idx, row in enumerate(rows):
        for c_idx, val in enumerate(row):
            cell = table.rows[r_idx + 1].cells[c_idx]
            cell.text = str(val)
            for p in cell.paragraphs:
                for run in p.runs:
                    run.font.name = 'Calibri'
                    run.font.size = Pt(10)
    return table


# ═══════════════════════════════════════════════════════
# COVER PAGE
# ═══════════════════════════════════════════════════════

# Title block
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(100)
run = p.add_run("BEAUTY CARE BY NABILA LAHORE")
run.font.size = Pt(28)
run.font.color.rgb = GOLD
run.bold = True
run.font.name = 'Calibri'

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("Luxury Salon & Bridal Studio Platform")
run.font.size = Pt(16)
run.font.color.rgb = SECONDARY
run.font.name = 'Calibri'

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(30)
run = p.add_run("Client Delivery Documentation")
run.font.size = Pt(22)
run.font.color.rgb = DARK
run.bold = True
run.font.name = 'Calibri'

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(20)
run = p.add_run("Project Architecture, Setup Guides, Isolation Checklist & Ownership Transfer")
run.font.size = Pt(13)
run.font.color.rgb = ACCENT
run.italic = True
run.font.name = 'Calibri'

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(60)
run = p.add_run("Version 1.0 | May 2026")
run.font.size = Pt(11)
run.font.color.rgb = SECONDARY
run.font.name = 'Calibri'

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run("CONFIDENTIAL")
run.font.size = Pt(10)
run.font.color.rgb = GOLD
run.bold = True
run.font.name = 'Calibri'

doc.add_page_break()

# ═══════════════════════════════════════════════════════
# TABLE OF CONTENTS
# ═══════════════════════════════════════════════════════

add_heading_styled("Table of Contents", 1)
toc_items = [
    "1. Project Overview & Architecture",
    "2. Project Isolation Principles",
    "3. Environment Variables Structure",
    "4. Firebase Setup Guide",
    "5. GitHub Repository Setup Guide",
    "6. Vercel Deployment Setup Guide",
    "7. Sanity CMS Setup Guide",
    "8. Cloudinary Media Setup Guide",
    "9. Admin Dashboard Access",
    "10. Project Isolation Checklist",
    "11. Ownership Transfer Checklist",
    "12. Firebase Ownership Handover Steps",
    "13. GitHub Repository Transfer Steps",
    "14. Vercel Migration Steps",
    "15. CMS Migration Steps",
    "16. Final Client Delivery Checklist",
]
for item in toc_items:
    add_para(item)

doc.add_page_break()

# ═══════════════════════════════════════════════════════
# 1. PROJECT OVERVIEW & ARCHITECTURE
# ═══════════════════════════════════════════════════════

add_heading_styled("1. Project Overview & Architecture", 1)

add_para("This document serves as the comprehensive client delivery guide for the Beauty Care by Nabila Lahore luxury salon platform. It provides complete setup instructions, architecture documentation, isolation guarantees, and step-by-step ownership transfer procedures. This platform has been engineered from the ground up as a standalone, fully isolated project that can be independently owned, operated, and transferred without any dependency on other projects or development accounts.")

add_heading_styled("1.1 Technology Stack", 2)

add_table(
    ["Layer", "Technology", "Version", "Purpose"],
    [
        ["Framework", "Next.js (App Router)", "16.x", "Full-stack React framework with SSR/SSG"],
        ["Language", "TypeScript", "5.x", "Type-safe development"],
        ["Styling", "Tailwind CSS", "4.x", "Utility-first CSS with custom design system"],
        ["UI Library", "shadcn/ui + Custom", "Latest", "45+ accessible components + luxury elements"],
        ["State", "Zustand", "5.x", "Lightweight state management for booking & admin"],
        ["Database", "Prisma + SQLite", "6.x", "ORM with embedded database (migratable to PostgreSQL)"],
        ["Auth", "NextAuth + Firebase Auth", "4.x / Latest", "Multi-provider authentication with role-based access"],
        ["CMS", "Sanity.io", "Latest", "Headless CMS for content management"],
        ["Media", "Cloudinary", "Latest", "Image/video transformation and CDN delivery"],
        ["Animation", "Framer Motion", "12.x", "Scroll animations, page transitions, micro-interactions"],
        ["Validation", "Zod + React Hook Form", "4.x / Latest", "Schema validation and form handling"],
        ["Data Fetching", "TanStack React Query", "5.x", "Server state management with caching"],
        ["Deployment", "Vercel", "Latest", "Edge-optimized hosting with CI/CD"],
    ]
)

add_heading_styled("1.2 Design System", 2)

add_para("The platform uses a meticulously crafted luxury design system that reflects the brand identity of Beauty Care by Nabila Lahore. Every visual element, from color choices to typography, has been designed to convey sophistication, exclusivity, and refined taste.")

add_table(
    ["Token", "Value", "Usage"],
    [
        ["Matte Black", "#0C0C10", "Primary background — deep, sophisticated canvas"],
        ["Champagne Gold", "#D4AF37", "Accent color — luxury, warmth, exclusivity"],
        ["Ivory", "#F8F5F0", "Primary text — soft contrast against dark backgrounds"],
        ["Warm Beige", "#DCC7AA", "Secondary text — subtle, elegant muted tone"],
        ["Playfair Display", "Google Fonts", "Headings — classic serif sophistication"],
        ["Cormorant Garamond", "Google Fonts", "Body accent — refined, literary elegance"],
        ["Inter", "Google Fonts", "UI text — modern, highly legible sans-serif"],
    ]
)

add_heading_styled("1.3 Project Structure", 2)

add_para("The project follows Next.js App Router conventions with a clean separation between server and client components. All pages use a server-component wrapper for SEO metadata, delegating interactive UI to client components. This ensures optimal performance, search engine visibility, and a clear mental model for future developers.")

structure = """src/
  app/                    # Next.js App Router pages
    page.tsx              # Homepage (client component)
    about/                # About page
    bridal/               # Bridal Studio page
    booking/              # 6-step booking wizard
    contact/              # Contact page
    gallery/              # Portfolio gallery with filtering
    services/             # Services page with category filtering
    vip/                  # VIP Membership tiers page
    admin/                # Admin dashboard (protected)
    api/                  # API routes (bookings, auth, admin)
  components/
    layout/               # Navbar, Footer
    sections/             # Homepage sections (Hero, Services, Bridal, etc.)
    booking/              # Booking wizard step components
    ui/                   # 45+ shadcn/ui + custom luxury components
    performance/          # Page transitions, lazy loading, optimization
    accessibility/        # Focus trap, announcer, skip-to-content
    seo/                  # JSON-LD structured data
  stores/                 # Zustand state management
  hooks/                  # Custom React hooks
  lib/                    # Utilities, constants, types, configuration
    constants.ts          # All business data (services, packages, gallery)
    env.ts                # Environment configuration module
    firebase.ts           # Firebase client initialization
    firebase-admin.ts     # Firebase Admin SDK (server-only)
    auth.ts               # NextAuth configuration
    validators.ts         # Zod schemas for API validation
    sanity/               # Sanity CMS client & schemas"""

p = doc.add_paragraph()
run = p.add_run(structure)
run.font.name = 'Courier New'
run.font.size = Pt(8.5)
run.font.color.rgb = BODY

# ═══════════════════════════════════════════════════════
# 2. PROJECT ISOLATION PRINCIPLES
# ═══════════════════════════════════════════════════════

doc.add_page_break()
add_heading_styled("2. Project Isolation Principles", 1)

add_para("This project has been architected with complete independence from any other project running on the same developer accounts. Isolation is not an afterthought but a foundational design principle that ensures the client can take full ownership without affecting or being affected by other projects. Every configuration, credential, and deployment pipeline is self-contained within this project's boundaries.")

add_heading_styled("2.1 Isolation Guarantees", 2)

guarantees = [
    ("Separate Firebase Project", "A dedicated Firebase project (nabila-lahore) with its own authentication users, Firestore database, Cloud Storage buckets, and analytics. No shared Firebase resources with any other project."),
    ("Separate Environment Variables", "All secrets and configuration are stored in .env.local and Vercel environment variables. No hardcoded credentials, admin emails, project IDs, or URLs anywhere in the codebase."),
    ("Separate Deployment Configuration", "Dedicated Vercel project with its own domain, SSL certificate, environment variables, and deployment pipeline. No shared Vercel team settings that could interfere."),
    ("Separate Storage Buckets", "Firebase Storage and Cloudinary accounts are project-specific. Media assets are completely isolated with no cross-project access."),
    ("Separate Authentication Setup", "Firebase Auth and NextAuth configurations are project-specific with unique JWT secrets, callback URLs, and role definitions."),
    ("Separate CMS Configuration", "Sanity.io project with its own dataset, API tokens, and schema definitions. No shared Sanity projects or content."),
    ("Portable Architecture", "The entire project can be cloned, reconfigured with new environment variables, and deployed to a completely different infrastructure without code changes."),
]

for title, desc in guarantees:
    p = doc.add_paragraph()
    run = p.add_run(title + ": ")
    run.bold = True
    run.font.name = 'Calibri'
    run.font.size = Pt(11)
    run.font.color.rgb = DARK
    run2 = p.add_run(desc)
    run2.font.name = 'Calibri'
    run2.font.size = Pt(11)
    run2.font.color.rgb = BODY

add_heading_styled("2.2 What Is NOT Reused", 2)

add_table(
    ["Resource", "Status", "Notes"],
    [
        ["Databases", "SEPARATE", "Dedicated SQLite (migratable to PostgreSQL); no shared DB instances"],
        ["Auth Systems", "SEPARATE", "Dedicated Firebase Auth project; unique NextAuth secret"],
        ["Storage Buckets", "SEPARATE", "Project-specific Cloudinary cloud; dedicated Firebase Storage"],
        ["API Keys", "SEPARATE", "All API keys are project-specific and stored in .env.local"],
        ["Environment Variables", "SEPARATE", "Complete .env.local with project-specific values"],
        ["Deployment Configs", "SEPARATE", "Dedicated Vercel project with own domain and settings"],
        ["CMS Config", "SEPARATE", "Dedicated Sanity project ID and dataset"],
        ["Admin Emails", "CONFIGURABLE", "Set via ADMIN_EMAIL env var, not hardcoded"],
        ["Project IDs", "CONFIGURABLE", "All cloud project IDs are env-based, not hardcoded"],
        ["URLs", "CONFIGURABLE", "Site URLs read from NEXT_PUBLIC_APP_URL env var"],
    ]
)

# ═══════════════════════════════════════════════════════
# 3. ENVIRONMENT VARIABLES STRUCTURE
# ═══════════════════════════════════════════════════════

doc.add_page_break()
add_heading_styled("3. Environment Variables Structure", 1)

add_para("All configuration is managed through environment variables, ensuring zero hardcoded values and complete portability. The .env.local file contains every configurable parameter for the platform, organized into logical sections. This approach enables the entire project to be reconfigured for a different domain, Firebase project, or deployment target simply by changing environment variable values without any code modifications.")

add_heading_styled("3.1 Complete .env.local Template", 2)

env_sections = [
    ("Application", [
        ("NEXT_PUBLIC_APP_NAME", "Beauty Care by Nabila Lahore", "Application display name"),
        ("NEXT_PUBLIC_APP_URL", "https://nabilalahore.com", "Production URL"),
        ("NEXT_PUBLIC_APP_VERSION", "1.0.0", "Semantic version"),
    ]),
    ("Firebase Client", [
        ("NEXT_PUBLIC_FIREBASE_API_KEY", "", "Firebase Web API key"),
        ("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "nabila-lahore.firebaseapp.com", "Firebase Auth domain"),
        ("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "nabila-lahore", "Firebase project identifier"),
        ("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "nabila-lahore.appspot.com", "Firebase Storage bucket"),
        ("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "", "FCM sender ID"),
        ("NEXT_PUBLIC_FIREBASE_APP_ID", "", "Firebase Web app ID"),
        ("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID", "", "Google Analytics measurement ID"),
    ]),
    ("Firebase Admin SDK", [
        ("FIREBASE_ADMIN_PROJECT_ID", "nabila-lahore", "Admin SDK project ID"),
        ("FIREBASE_ADMIN_CLIENT_EMAIL", "firebase-adminsdk@nabila-lahore.iam.gserviceaccount.com", "Service account email"),
        ("FIREBASE_ADMIN_PRIVATE_KEY", "", "Service account private key (PEM format)"),
    ]),
    ("NextAuth", [
        ("NEXTAUTH_URL", "https://nabilalahore.com", "NextAuth callback URL"),
        ("NEXTAUTH_SECRET", "", "JWT signing secret (generate: openssl rand -base64 32)"),
    ]),
    ("Sanity CMS", [
        ("NEXT_PUBLIC_SANITY_PROJECT_ID", "", "Sanity project ID"),
        ("NEXT_PUBLIC_SANITY_DATASET", "production", "Dataset name"),
        ("SANITY_API_TOKEN", "", "Read/write API token"),
        ("SANITY_API_VERSION", "2024-01-01", "API version date"),
    ]),
    ("Cloudinary", [
        ("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "", "Cloudinary cloud name"),
        ("CLOUDINARY_API_KEY", "", "Cloudinary API key"),
        ("CLOUDINARY_API_SECRET", "", "Cloudinary API secret"),
        ("CLOUDINARY_UPLOAD_PRESET", "nabila-lahore-uploads", "Upload preset name"),
    ]),
    ("Admin Access", [
        ("ADMIN_EMAIL", "admin@nabilalahore.com", "Super-admin email (configurable)"),
        ("ADMIN_ROLE", "super-admin", "Default admin role"),
    ]),
    ("Booking System", [
        ("BOOKING_CONFIRMATION_PREFIX", "NBL", "Booking code prefix"),
        ("BOOKING_MAX_ADVANCE_DAYS", "30", "Maximum days in advance"),
        ("BOOKING_SLOTS_START", "10:00", "First available slot"),
        ("BOOKING_SLOTS_END", "20:00", "Last available slot"),
        ("BOOKING_SLOT_INTERVAL", "60", "Slot duration in minutes"),
    ]),
    ("Security", [
        ("RATE_LIMIT_MAX_REQUESTS", "100", "Max requests per window"),
        ("RATE_LIMIT_WINDOW_MS", "60000", "Rate limit window in ms"),
        ("CSRF_SECRET", "", "CSRF protection secret"),
    ]),
]

for section_name, vars in env_sections:
    add_heading_styled(section_name, 3)
    add_table(
        ["Variable", "Default/Example", "Description"],
        [[v[0], v[1], v[2]] for v in vars]
    )

add_heading_styled("3.2 Environment Configuration Module", 2)

add_para("The src/lib/env.ts module provides a centralized, type-safe interface for accessing all environment variables. It includes validation helpers that warn during development and throw errors in production for missing required values. The validateProjectIsolation() function can be called at startup to verify that all project-specific configurations are properly set and that no placeholder values remain. This module ensures that no environment variable is ever accessed directly from process.env in application code, maintaining a clean separation and easy auditability.")

# ═══════════════════════════════════════════════════════
# 4. FIREBASE SETUP GUIDE
# ═══════════════════════════════════════════════════════

doc.add_page_break()
add_heading_styled("4. Firebase Setup Guide", 1)

add_para("This section provides a complete guide for setting up a new Firebase project specifically for the Beauty Care by Nabila Lahore platform. Each step ensures the project is fully isolated and properly configured for production use.")

steps = [
    ("Create Firebase Project", [
        "Go to https://console.firebase.google.com",
        "Click 'Add Project' and enter project name: nabila-lahore",
        "Disable Google Analytics initially (can enable later with separate property)",
        "Choose a Firebase resource location closest to Pakistan (asia-southeast1 for Singapore)",
        "Wait for project creation to complete",
    ]),
    ("Enable Authentication", [
        "Navigate to Authentication > Sign-in method",
        "Enable Email/Password provider",
        "Enable Google provider (optional, for admin login)",
        "Set authorized domains to include nabilalahore.com and localhost",
        "Configure email templates with branding (logo, colors)",
    ]),
    ("Configure Firestore Database", [
        "Navigate to Firestore Database > Create Database",
        "Start in production mode",
        "Select the same region as the project (asia-southeast1)",
        "Set up security rules for the booking system",
        "Create composite indexes for booking queries",
    ]),
    ("Set Up Firebase Storage", [
        "Navigate to Storage > Get Started",
        "Select the same region (asia-southeast1)",
        "Configure storage rules for authenticated uploads",
        "Create folder structure: /gallery/, /bridal/, /services/, /artists/",
    ]),
    ("Generate Service Account Key", [
        "Navigate to Project Settings > Service Accounts",
        "Click 'Generate New Private Key'",
        "Save the JSON file securely (this is the FIREBASE_ADMIN_PRIVATE_KEY)",
        "Never commit this file to version control",
    ]),
    ("Register Web App", [
        "Navigate to Project Settings > General > Your Apps",
        "Click 'Add App' > Web app",
        "Register with nickname: nabila-lahore-web",
        "Copy the firebaseConfig object values to .env.local",
    ]),
    ("Update Environment Variables", [
        "Copy all Firebase config values to .env.local",
        "Set FIREBASE_ADMIN_PRIVATE_KEY from the service account JSON",
        "Set FIREBASE_ADMIN_CLIENT_EMAIL from the service account JSON",
        "Verify all values are correct by running the development server",
    ]),
]

for i, (title, items) in enumerate(steps, 1):
    add_heading_styled(f"Step {i}: {title}", 3)
    for item in items:
        add_bullet(item)

# ═══════════════════════════════════════════════════════
# 5-7. GITHUB, VERCEL, SANITY GUIDES
# ═══════════════════════════════════════════════════════

add_heading_styled("5. GitHub Repository Setup Guide", 1)

add_para("The project repository must be created as a new, standalone repository with no connections to any existing repositories. This ensures complete isolation and clean ownership transfer.")

github_steps = [
    ("Create New Repository", "Create a new repository on GitHub with name 'nabila-lahore-platform'. Set it to private initially. Add a description: 'Luxury salon & bridal studio platform for Beauty Care by Nabila Lahore'. Initialize with a .gitignore for Node.js."),
    ("Branch Protection", "Set up branch protection rules for the 'main' branch. Require pull request reviews before merging. Require status checks to pass (build, lint, type-check). Require linear commit history for clean git log."),
    ("Push Initial Code", "Clone the repository locally, add the project code as the initial commit. Ensure .env.local is in .gitignore and never committed. Verify no secrets, API keys, or credentials exist in the codebase."),
    ("GitHub Actions (Optional)", "Create a CI workflow that runs on pull requests: TypeScript type-check, ESLint, build verification. Do NOT include deployment secrets in GitHub Actions — use Vercel's built-in CI/CD instead."),
]

for title, desc in github_steps:
    p = doc.add_paragraph()
    run = p.add_run(title + ": ")
    run.bold = True
    run.font.name = 'Calibri'
    run.font.color.rgb = DARK
    run2 = p.add_run(desc)
    run2.font.name = 'Calibri'
    run2.font.color.rgb = BODY

add_heading_styled("6. Vercel Deployment Setup Guide", 1)

add_para("Vercel provides the hosting infrastructure with automatic CI/CD, edge functions, and global CDN. The project must be deployed as a separate Vercel project with its own domain and environment variables.")

vercel_steps = [
    ("Create Vercel Project", "Import the GitHub repository into Vercel as a new project. Do NOT import into an existing team project. Set the framework preset to Next.js. Set the root directory to '/' (default)."),
    ("Configure Environment Variables", "Add ALL environment variables from .env.local to Vercel's Environment Variables section. Set them for Production, Preview, and Development environments. Verify NEXTAUTH_URL matches the Vercel deployment URL."),
    ("Custom Domain Setup", "Add the custom domain 'nabilalahore.com' in Vercel Project Settings > Domains. Configure DNS records as instructed by Vercel (typically CNAME to cname.vercel-dns.com). Wait for SSL certificate provisioning (automatic)."),
    ("Build Configuration", "Framework Preset: Next.js. Build Command: next build. Output Directory: .next. Install Command: bun install. Node.js Version: 18.x or 20.x."),
    ("Deployment Verification", "After first deployment, verify: Homepage loads correctly, booking wizard functions, admin login works, API routes respond, images/media load from Cloudinary."),
]

for title, desc in vercel_steps:
    p = doc.add_paragraph()
    run = p.add_run(title + ": ")
    run.bold = True
    run.font.name = 'Calibri'
    run.font.color.rgb = DARK
    run2 = p.add_run(desc)
    run2.font.name = 'Calibri'
    run2.font.color.rgb = BODY

add_heading_styled("7. Sanity CMS Setup Guide", 1)

add_para("Sanity.io provides the headless CMS for managing dynamic content such as blog posts, testimonials, and gallery descriptions. The CMS is configured with project-specific schemas and API tokens.")

sanity_steps = [
    ("Create Sanity Project", "Go to https://www.sanity.io/manage and create a new project. Name it 'Nabila Lahore CMS'. Select the Free plan initially (upgradeable). Set the dataset name to 'production'."),
    ("Configure Schemas", "The project includes 7 pre-built Sanity schemas at src/lib/sanity/schemas/. These cover: services, bridal packages, gallery items, testimonials, blog posts, staff profiles, and site settings. Deploy these schemas to the Sanity project using the Sanity CLI."),
    ("Generate API Tokens", "In Sanity Project Settings > API, generate a token with 'Editor' permissions. Add this as SANITY_API_TOKEN in .env.local and Vercel environment variables. Copy the Project ID and add as NEXT_PUBLIC_SANITY_PROJECT_ID."),
    ("Configure CORS Origins", "In Sanity Project Settings > API > CORS Origins, add: https://nabilalahore.com, https://nabila-lahore.vercel.app, http://localhost:3000. This allows the frontend to query the Sanity API."),
]

for title, desc in sanity_steps:
    p = doc.add_paragraph()
    run = p.add_run(title + ": ")
    run.bold = True
    run.font.name = 'Calibri'
    run.font.color.rgb = DARK
    run2 = p.add_run(desc)
    run2.font.name = 'Calibri'
    run2.font.color.rgb = BODY

# ═══════════════════════════════════════════════════════
# 8. CLOUDINARY SETUP
# ═══════════════════════════════════════════════════════

add_heading_styled("8. Cloudinary Media Setup Guide", 1)

add_para("Cloudinary handles all image and video transformations, optimization, and CDN delivery for the platform. A separate Cloudinary account ensures complete media isolation and independent billing.")

cloudinary_items = [
    "Create a new Cloudinary account at https://cloudinary.com (do NOT reuse an existing account)",
    "Note the Cloud Name from the dashboard — set as NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    "Generate an API Key and Secret from Settings > Access Keys — set as CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET",
    "Create an unsigned upload preset named 'nabila-lahore-uploads' for client-side uploads",
    "Configure upload presets with: folder = 'nabila-lahore', max file size = 10MB, allowed formats = jpg,png,webp",
    "Set up transformation presets for optimized delivery: thumbnail (200x200, fill), card (400x500, fill), hero (1200x800, fill), full (1920x1080, fit)",
    "Configure responsive breakpoints for automatic srcset generation",
]

for item in cloudinary_items:
    add_bullet(item)

# ═══════════════════════════════════════════════════════
# 9. ADMIN DASHBOARD ACCESS
# ═══════════════════════════════════════════════════════

add_heading_styled("9. Admin Dashboard Access", 1)

add_para("The admin dashboard provides comprehensive management capabilities for the platform. Access is protected by role-based authentication with three permission levels.")

add_heading_styled("9.1 Accessing the Admin Dashboard", 2)

admin_steps = [
    "Navigate to https://nabilalahore.com/admin/login",
    "Sign in using the admin email configured in ADMIN_EMAIL environment variable",
    "Authentication is handled via NextAuth with Firebase Auth as the provider",
    "Upon successful login, you will be redirected to the admin dashboard at /admin",
]
for step in admin_steps:
    add_bullet(step)

add_heading_styled("9.2 Admin Roles & Permissions", 2)

add_table(
    ["Role", "Access Level", "Capabilities"],
    [
        ["super-admin", "Full Access", "All dashboard features, settings, staff management, analytics"],
        ["manager", "Operational", "Bookings, services, gallery, testimonials — no settings or staff"],
        ["staff", "Limited", "View bookings, gallery — no create/update/delete"],
    ]
)

add_heading_styled("9.3 Dashboard Sections", 2)

sections = [
    ("Dashboard Home (/admin)", "Overview of key metrics: total bookings, revenue, upcoming appointments, client statistics"),
    ("Bookings (/admin/bookings)", "View, filter, and manage all bookings. Confirm, cancel, or reschedule appointments. Export booking data."),
    ("Services (/admin/services)", "Add, edit, or remove services. Manage categories, pricing, and descriptions. Toggle service availability."),
    ("Staff (/admin/staff)", "Manage artist profiles, specialties, and availability schedules. Assign services to staff members."),
    ("Gallery (/admin/gallery)", "Upload and manage portfolio images. Organize by category. Set featured images for homepage."),
    ("Testimonials (/admin/testimonials)", "Review, approve, and manage client testimonials. Feature testimonials on homepage."),
    ("Blog (/admin/blog)", "Create and publish blog posts via Sanity CMS integration. Manage categories and tags."),
    ("Settings (/admin/settings)", "Configure business hours, booking rules, contact information, and notification preferences."),
]

for title, desc in sections:
    p = doc.add_paragraph()
    run = p.add_run(title + ": ")
    run.bold = True
    run.font.name = 'Calibri'
    run.font.color.rgb = DARK
    run2 = p.add_run(desc)
    run2.font.name = 'Calibri'
    run2.font.color.rgb = BODY

# ═══════════════════════════════════════════════════════
# 10. PROJECT ISOLATION CHECKLIST
# ═══════════════════════════════════════════════════════

doc.add_page_break()
add_heading_styled("10. Project Isolation Checklist", 1)

add_para("Use this checklist to verify complete isolation before handover. Every item must be confirmed to ensure no cross-project dependencies exist.")

add_heading_styled("10.1 Infrastructure Isolation", 2)

infra_items = [
    "Firebase project is dedicated to Nabila Lahore (no shared project)",
    "Firebase Auth has its own user pool (no shared auth)",
    "Firebase Storage bucket is project-specific",
    "Firestore database is project-specific",
    "Vercel project is standalone (not part of a shared team workspace)",
    "Vercel custom domain is nabilalahore.com (not a subdomain of another project)",
    "Cloudinary cloud name is project-specific",
    "Sanity project ID is unique to this platform",
    "GitHub repository is standalone (not a fork or monorepo subset)",
]

for item in infra_items:
    add_bullet("[ ] " + item)

add_heading_styled("10.2 Code Isolation", 2)

code_items = [
    "No hardcoded API keys, secrets, or credentials in source code",
    "No hardcoded admin emails (configured via ADMIN_EMAIL env var)",
    "No hardcoded project IDs (configured via env vars)",
    "No hardcoded URLs (configured via NEXT_PUBLIC_APP_URL)",
    "All environment variables are documented in .env.local",
    "No imports from external project codebases",
    "No shared npm packages with other projects (standard packages are fine)",
    "Database connection string is env-based (DATABASE_URL)",
    "NextAuth secret is project-specific (NEXTAUTH_SECRET)",
    "CSRF secret is project-specific (CSRF_SECRET)",
]

for item in code_items:
    add_bullet("[ ] " + item)

add_heading_styled("10.3 Deployment Isolation", 2)

deploy_items = [
    "Vercel project has its own environment variables (not inherited)",
    "Vercel project has its own deployment domain",
    "No shared Vercel serverless functions with other projects",
    "Build configuration is project-specific",
    "No shared CI/CD pipelines with other projects",
    "SSL certificate is for nabilalahore.com only",
]

for item in deploy_items:
    add_bullet("[ ] " + item)

# ═══════════════════════════════════════════════════════
# 11. OWNERSHIP TRANSFER CHECKLIST
# ═══════════════════════════════════════════════════════

add_heading_styled("11. Ownership Transfer Checklist", 1)

add_para("This checklist covers the complete ownership transfer process from the development team to the final client. Each step ensures a smooth, disruption-free handover with no downtime or data loss. The transfer should be executed in a coordinated manner with the client present or available for confirmation at each stage.")

transfer_items = [
    "All Firebase resources transferred to client's Google account",
    "GitHub repository transferred to client's GitHub organization",
    "Vercel project transferred to client's Vercel account",
    "Domain DNS records updated to client's domain registrar",
    "All environment variables re-created in client's Vercel project",
    "Sanity project ownership transferred to client's Sanity account",
    "Cloudinary account ownership transferred or new account set up",
    "Admin credentials changed to client's email addresses",
    "All API keys and secrets regenerated for security",
    "SSL certificate re-issued under client's account",
    "Monitoring and alerting configured in client's accounts",
    "Backup procedures documented and tested",
    "Client team trained on admin dashboard usage",
    "Client team trained on Sanity CMS content management",
    "Client team trained on Vercel deployment management",
    "Development team access revoked after confirmation",
    "Post-transfer support period defined (recommended: 30 days)",
]

for item in transfer_items:
    add_bullet("[ ] " + item)

# ═══════════════════════════════════════════════════════
# 12. FIREBASE OWNERSHIP HANDOVER
# ═══════════════════════════════════════════════════════

doc.add_page_break()
add_heading_styled("12. Firebase Ownership Handover Steps", 1)

add_para("Transferring Firebase project ownership requires careful coordination to ensure continuous service during the transition. The process involves adding the client as an owner, then removing the development team's access after verification.")

firebase_transfer = [
    ("Add Client as Project Owner", [
        "Go to Firebase Console > Project Settings > Users and Permissions",
        "Click 'Add Member' and enter the client's Google account email",
        "Assign the role: 'Owner' (full administrative access)",
        "Ask the client to accept the invitation and verify access",
    ]),
    ("Client Verifies Access", [
        "Client logs into Firebase Console with their Google account",
        "Client confirms they can see the project and all resources",
        "Client confirms Authentication, Firestore, Storage, and Hosting are accessible",
        "Client creates a new service account key under their ownership",
    ]),
    ("Update Service Account Key", [
        "Client generates a new private key from their account",
        "Update FIREBASE_ADMIN_PRIVATE_KEY and FIREBASE_ADMIN_CLIENT_EMAIL in Vercel",
        "Update the same in .env.local for local development",
        "Test that the application still connects to Firebase correctly",
    ]),
    ("Regenerate Web API Key (Optional)", [
        "In Project Settings > General, note the current API key",
        "If security requires it, restrict the API key to the production domain",
        "Update NEXT_PUBLIC_FIREBASE_API_KEY if a new key is generated",
    ]),
    ("Remove Development Team Access", [
        "Once client confirms everything works, remove development team members",
        "Go to Project Settings > Users and Permissions",
        "Change development team roles from 'Owner' to 'Viewer' (temporary)",
        "After 7 days of stable operation, remove development team access entirely",
    ]),
]

for i, (title, items) in enumerate(firebase_transfer, 1):
    add_heading_styled(f"Step {i}: {title}", 3)
    for item in items:
        add_bullet(item)

# ═══════════════════════════════════════════════════════
# 13. GITHUB REPOSITORY TRANSFER
# ═══════════════════════════════════════════════════════

add_heading_styled("13. GitHub Repository Transfer Steps", 1)

add_para("GitHub repository transfer moves the entire codebase, history, issues, and pull requests to the client's ownership. The transfer is seamless and preserves all git history.")

github_transfer = [
    ("Prepare for Transfer", [
        "Ensure all branches are merged or documented",
        "Ensure no open pull requests with sensitive information",
        "Verify .env.local is in .gitignore and no secrets are in git history",
        "Create a final release tag: v1.0.0-stable",
    ]),
    ("Transfer Repository", [
        "Go to GitHub Repository > Settings > General > Danger Zone",
        "Click 'Transfer' under 'Transfer repository'",
        "Enter the client's GitHub organization or username",
        "Confirm the transfer (client must accept within 24 hours)",
    ]),
    ("Client Accepts Transfer", [
        "Client receives an email notification about the transfer",
        "Client accepts the transfer in their GitHub account",
        "Repository appears under the client's organization",
        "All collaborators, branch protection rules, and webhooks are preserved",
    ]),
    ("Post-Transfer Configuration", [
        "Update Vercel's GitHub integration to point to the new repository location",
        "Verify that Vercel auto-deployments still work after the transfer",
        "Update any GitHub Actions workflows with the new repository URL",
        "Regenerate any GitHub Personal Access Tokens if used",
    ]),
    ("Update Access Controls", [
        "Add client team members as collaborators with appropriate roles",
        "Remove development team members (or downgrade to read-only if support period is active)",
        "Set up new branch protection rules if needed",
        "Enable GitHub security features: Dependabot, CodeQL, secret scanning",
    ]),
]

for i, (title, items) in enumerate(github_transfer, 1):
    add_heading_styled(f"Step {i}: {title}", 3)
    for item in items:
        add_bullet(item)

# ═══════════════════════════════════════════════════════
# 14. VERCEL MIGRATION
# ═══════════════════════════════════════════════════════

add_heading_styled("14. Vercel Migration Steps", 1)

add_para("Vercel project transfer moves the deployment pipeline, environment variables, and domain configuration to the client's account. This is typically the most critical step as it directly affects the live website.")

vercel_transfer = [
    ("Pre-Migration Verification", [
        "Document all current environment variables and their values",
        "Verify the current deployment is stable and all features work",
        "Take screenshots of Vercel project settings for reference",
        "Ensure the client has created a Vercel account",
    ]),
    ("Transfer Vercel Project", [
        "Go to Vercel Dashboard > Project Settings > General",
        "Scroll to 'Transfer Project'",
        "Enter the client's Vercel account email or team slug",
        "Client must accept the transfer invitation",
    ]),
    ("Client Reconfigures Environment", [
        "Client verifies all environment variables are present after transfer",
        "Client updates NEXTAUTH_URL to match the production domain",
        "Client updates NEXT_PUBLIC_APP_URL to match the production domain",
        "Client verifies Firebase config values match the new service account",
    ]),
    ("Domain Reconfiguration", [
        "If the domain was managed by the development team, update DNS records",
        "In Vercel, remove and re-add the custom domain if needed",
        "Verify SSL certificate is re-issued correctly",
        "Test that the domain resolves to the Vercel deployment",
    ]),
    ("Post-Migration Testing", [
        "Verify homepage loads correctly at the production domain",
        "Test the booking wizard end-to-end",
        "Verify admin dashboard login and functionality",
        "Test all API routes return expected responses",
        "Verify media uploads work (Cloudinary integration)",
        "Run Lighthouse audit to ensure performance is maintained",
    ]),
]

for i, (title, items) in enumerate(vercel_transfer, 1):
    add_heading_styled(f"Step {i}: {title}", 3)
    for item in items:
        add_bullet(item)

# ═══════════════════════════════════════════════════════
# 15. CMS MIGRATION
# ═══════════════════════════════════════════════════════

add_heading_styled("15. CMS Migration Steps", 1)

add_para("Sanity CMS migration involves transferring project ownership and API tokens to the client's account. Content is hosted on Sanity's infrastructure and transfers with the project.")

sanity_transfer = [
    ("Transfer Sanity Project Ownership", [
        "Go to https://www.sanity.io/manage",
        "Select the nabila-lahore project",
        "Navigate to Project Settings > Members",
        "Invite the client's Sanity account as an 'Administrator'",
        "Client accepts the invitation and verifies access",
    ]),
    ("Regenerate API Tokens", [
        "In Sanity Project Settings > API > Tokens",
        "Revoke the existing SANITY_API_TOKEN",
        "Generate a new token with 'Editor' permissions",
        "Update SANITY_API_TOKEN in Vercel and .env.local",
        "Verify the application still connects to Sanity",
    ]),
    ("Configure CORS for Client Domain", [
        "In Sanity Project Settings > API > CORS Origins",
        "Verify nabilalahore.com is listed",
        "Remove any development-only origins (localhost) if no longer needed",
        "Test that the frontend can query Sanity from the production domain",
    ]),
    ("Content Migration (if needed)", [
        "If the client has a different Sanity account, export content using: sanity dataset export production",
        "Import content to the new project using: sanity dataset import export.tar.gz production",
        "Update NEXT_PUBLIC_SANITY_PROJECT_ID to the new project ID",
        "Verify all content renders correctly after migration",
    ]),
    ("Remove Development Team Access", [
        "After client confirms full functionality, remove development team from Sanity project members",
        "Ensure the client has at least two administrators for redundancy",
    ]),
]

for i, (title, items) in enumerate(sanity_transfer, 1):
    add_heading_styled(f"Step {i}: {title}", 3)
    for item in items:
        add_bullet(item)

# ═══════════════════════════════════════════════════════
# 16. FINAL CLIENT DELIVERY CHECKLIST
# ═══════════════════════════════════════════════════════

doc.add_page_break()
add_heading_styled("16. Final Client Delivery Checklist", 1)

add_para("This is the master checklist for the final delivery. Every item must be verified and signed off before the project is considered delivered. The development team and client should review this checklist together in a formal handover meeting.")

add_heading_styled("16.1 Technical Delivery", 2)

tech_items = [
    "Website is live and accessible at nabilalahore.com",
    "All pages load correctly (Home, Services, Bridal, Gallery, VIP, About, Contact)",
    "Booking wizard functions end-to-end (6 steps, confirmation, WhatsApp link)",
    "Service category filtering works on Services page",
    "Gallery category filtering works on Gallery page",
    "VIP membership page displays correctly with all tiers",
    "Admin dashboard is accessible at /admin/login",
    "Admin can create, read, update, and delete all resources",
    "Authentication (login/logout) works correctly",
    "Role-based access control functions as designed",
    "API routes return correct responses",
    "Rate limiting is active and functioning",
    "Security headers are properly configured",
    "SSL certificate is valid and auto-renewing",
    "404 and error pages display correctly",
    "Sitemap.xml and robots.txt are generated correctly",
    "JSON-LD structured data is present on all pages",
    "Open Graph meta tags render correctly for social sharing",
    "Responsive design works on mobile, tablet, and desktop",
    "Accessibility features work (skip-to-content, ARIA labels, focus management)",
]

for item in tech_items:
    add_bullet("[ ] " + item)

add_heading_styled("16.2 Ownership Transfer", 2)

ownership_items = [
    "Firebase project ownership transferred to client",
    "GitHub repository transferred to client's organization",
    "Vercel project transferred to client's account",
    "Domain DNS managed by client or their registrar",
    "Sanity CMS project owned by client",
    "Cloudinary account owned by client",
    "All environment variables recreated under client's accounts",
    "All API keys regenerated for security",
    "Development team access revoked (after support period)",
]

for item in ownership_items:
    add_bullet("[ ] " + item)

add_heading_styled("16.3 Documentation & Training", 2)

docs_items = [
    "This Client Delivery Documentation provided to client",
    "Admin dashboard training completed with client team",
    "Sanity CMS training completed with client team",
    "Vercel deployment management training completed",
    "Firebase Console overview provided",
    "Troubleshooting guide provided (common issues and solutions)",
    "Emergency contact procedure documented",
    "Post-transfer support period defined (30 days recommended)",
]

for item in docs_items:
    add_bullet("[ ] " + item)

add_heading_styled("16.4 Performance & Quality", 2)

perf_items = [
    "Lighthouse Performance score >= 90",
    "Lighthouse Accessibility score >= 90",
    "Lighthouse SEO score >= 90",
    "First Contentful Paint < 1.5s",
    "Largest Contentful Paint < 2.5s",
    "Cumulative Layout Shift < 0.1",
    "No console errors on any page",
    "No hydration mismatch warnings",
    "All images optimized (WebP format, responsive sizes)",
    "Database queries are performant (< 200ms average)",
]

for item in perf_items:
    add_bullet("[ ] " + item)

# ═══════════════════════════════════════════════════════
# SAVE DOCUMENT
# ═══════════════════════════════════════════════════════

os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
doc.save(OUTPUT)
print(f"Document saved to: {OUTPUT}")
