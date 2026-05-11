// ─── Admin Types & Interfaces ───

export type AdminRole = "super-admin" | "manager" | "staff";

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: AdminRole;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

// ─── Dashboard Analytics ───
export interface DashboardStats {
  totalBookings: number;
  todayBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  avgBookingValue: number;
  totalClients: number;
  newClientsThisMonth: number;
  topService: { name: string; count: number } | null;
  topArtist: { name: string; count: number } | null;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  bookings: number;
}

export interface ServiceBreakdown {
  category: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface BookingTrendPoint {
  date: string;
  bookings: number;
  cancellations: number;
}

// ─── Admin CRUD Types ───
export interface AdminService {
  id: string;
  title: string;
  category: string;
  price: string;
  duration: string;
  icon: string;
  description: string;
  isActive: boolean;
  features: string[];
  addOns: string[];
  popular: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStaff {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  experience: string;
  image: string;
  rating: number;
  isActive: boolean;
  bio: string;
  phone: string;
  email: string;
  branch: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminGalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  height: "tall" | "medium" | "short";
  featured: boolean;
  uploadedAt: string;
  cloudinaryId?: string;
}

export interface AdminTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
  featured: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Portable Text or MDX
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string | null;
  isPublished: boolean;
  seo: SEOFields;
  createdAt: string;
  updatedAt: string;
}

export interface SEOFields {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  canonicalUrl: string;
  keywords: string[];
  noIndex: boolean;
}

// ─── Booking Status Colors ───
export const BOOKING_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  pending: {
    label: "Pending",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    dot: "bg-amber-400",
  },
  confirmed: {
    label: "Confirmed",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    dot: "bg-emerald-400",
  },
  "in-progress": {
    label: "In Progress",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    dot: "bg-blue-400",
  },
  completed: {
    label: "Completed",
    color: "text-champagne-gold",
    bg: "bg-champagne-gold/10",
    dot: "bg-champagne-gold",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-400",
    bg: "bg-red-400/10",
    dot: "bg-red-400",
  },
  "no-show": {
    label: "No Show",
    color: "text-zinc-400",
    bg: "bg-zinc-400/10",
    dot: "bg-zinc-400",
  },
};

export const PAYMENT_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  unpaid: { label: "Unpaid", color: "text-zinc-400", bg: "bg-zinc-400/10" },
  deposit: { label: "Deposit", color: "text-amber-400", bg: "bg-amber-400/10" },
  paid: { label: "Paid", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  refunded: { label: "Refunded", color: "text-blue-400", bg: "bg-blue-400/10" },
};

// ─── Admin Navigation ───
export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  roles: AdminRole[]; // Which roles can see this nav item
  badge?: string;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/admin", icon: "LayoutDashboard", roles: ["super-admin", "manager", "staff"] },
  { id: "bookings", label: "Bookings", href: "/admin/bookings", icon: "CalendarCheck", roles: ["super-admin", "manager", "staff"] },
  { id: "services", label: "Services", href: "/admin/services", icon: "Sparkles", roles: ["super-admin", "manager"] },
  { id: "staff", label: "Staff", href: "/admin/staff", icon: "Users", roles: ["super-admin", "manager"] },
  { id: "gallery", label: "Gallery", href: "/admin/gallery", icon: "Image", roles: ["super-admin", "manager"] },
  { id: "testimonials", label: "Testimonials", href: "/admin/testimonials", icon: "MessageSquareQuote", roles: ["super-admin", "manager"] },
  { id: "blog", label: "Blog & SEO", href: "/admin/blog", icon: "FileText", roles: ["super-admin"] },
  { id: "settings", label: "Settings", href: "/admin/settings", icon: "Settings", roles: ["super-admin"] },
];

// ─── Firestore Collection Names ───
export const FS_COLLECTIONS = {
  USERS: "users",
  BOOKINGS: "bookings",
  SERVICES: "services",
  STAFF: "staff",
  GALLERY: "gallery",
  TESTIMONIALS: "testimonials",
  BLOG_POSTS: "blogPosts",
  ANALYTICS: "analytics",
  ACTIVITY_LOG: "activityLog",
} as const;
