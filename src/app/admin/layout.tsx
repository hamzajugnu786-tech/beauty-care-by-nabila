"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAdminStore } from "@/stores/useAdminStore";
import { ADMIN_NAV } from "@/lib/types/admin";
import type { AdminRole } from "@/lib/types/admin";
import {
  LayoutDashboard,
  CalendarCheck,
  Sparkles,
  Users,
  Image,
  MessageSquareQuote,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
  Crown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { BRAND } from "@/lib/constants";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const iconMap: Record<string, any> = {
  LayoutDashboard,
  CalendarCheck,
  Sparkles,
  Users,
  Image,
  MessageSquareQuote,
  FileText,
  Settings,
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // ALL hooks must be called before any early return (Rules of Hooks)
  const {
    user,
    setAuth,
    clearAuth,
    sidebarCollapsed,
    setSidebarCollapsed,
    sidebarOpen,
    toggleSidebar,
    notifications,
    unreadCount,
  } = useAdminStore();

  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setRedirecting(false);
      const role = (session.user as any).role as AdminRole || "super-admin";
      setAuth(
        {
          uid: (session.user as any).uid || "demo-uid",
          email: session.user.email || "",
          name: session.user.name || "Admin",
          role,
          image: session.user.image ?? null,
        },
        getPermissionsForRole(role)
      );
    } else if (status === "unauthenticated" && mounted) {
      // Only redirect after mounting to avoid flash from initial session loading
      clearAuth();
      setRedirecting(true);
      const timer = setTimeout(() => {
        router.push("/admin/login");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [session, status, mounted, setAuth, clearAuth, router]);

  // Login page should NOT have admin layout (sidebar, auth checks, etc.)
  // Without this check, the auth gate below creates an infinite redirect loop
  // because the login page is inside /admin/ directory
  const isLoginPage = pathname === "/admin/login";
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading while mounting or session is loading
  if (!mounted || status === "loading") {
    return <AdminLoadingSkeleton />;
  }

  // Show redirect message instead of blank page when unauthenticated
  if (status !== "authenticated" || redirecting) {
    return (
      <div className="min-h-screen bg-matte-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-champagne-gold/10 border border-champagne-gold/20 flex items-center justify-center animate-pulse">
            <Crown className="w-6 h-6 text-champagne-gold" />
          </div>
          <p className="text-text-muted text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const role = user?.role || "super-admin";
  const filteredNav = ADMIN_NAV.filter((item) => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-matte-black flex">
      {/* ─── Sidebar ─── */}
      <AnimatePresence>
        {(sidebarOpen || typeof window !== "undefined") && (
          <motion.aside
            initial={false}
            animate={{
              width: sidebarCollapsed ? 72 : 260,
              opacity: 1,
            }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed lg:relative z-40 h-screen flex flex-col bg-dark-surface border-r border-border-gold/10 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            } transition-transform lg:transition-none`}
          >
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-border-gold/10">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="flex items-center gap-3 w-full group"
              >
                <div className="w-9 h-9 rounded-xl bg-champagne-gold/10 border border-champagne-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-champagne-gold/20 transition-colors">
                  <Crown className="w-4 h-4 text-champagne-gold" />
                </div>
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      <p className="text-sm font-serif text-champagne-gold tracking-wider">NABILA</p>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest">Admin</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              {/* Mobile close */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden ml-auto p-1 text-text-muted hover:text-champagne-gold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
              {filteredNav.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const isActive = pathname === item.href;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => router.push(item.href)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? "bg-champagne-gold/10 text-champagne-gold border border-champagne-gold/20"
                        : "text-text-muted hover:text-text-primary hover:bg-dark-elevated border border-transparent"
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="text-sm font-medium overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {item.badge && !sidebarCollapsed && (
                      <span className="ml-auto bg-champagne-gold/20 text-champagne-gold text-[10px] px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* Collapse Toggle (desktop) */}
            <div className="hidden lg:flex items-center justify-center py-3 border-t border-border-gold/10">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg text-text-muted hover:text-champagne-gold hover:bg-dark-elevated transition-all"
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>

            {/* User */}
            <div className="p-3 border-t border-border-gold/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-champagne-gold/30 to-champagne-gold/10 flex items-center justify-center text-champagne-gold text-xs font-semibold flex-shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                      <p className="text-[10px] text-champagne-gold uppercase tracking-wider">{role.replace("-", " ")}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!sidebarCollapsed && (
                  <button
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="p-1.5 text-text-muted hover:text-red-400 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── Mobile Overlay ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border-gold/10 bg-dark-surface/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-text-muted hover:text-champagne-gold transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-dark-elevated border border-border-gold/10 rounded-xl px-4 py-2 w-64">
              <Search className="w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 outline-none w-full"
              />
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-dark-surface text-[10px] text-text-muted border border-border-gold/10">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-text-muted hover:text-champagne-gold transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-champagne-gold text-matte-black text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {/* Notification dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-dark-card border border-border-gold/20 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-border-gold/10 flex items-center justify-between">
                      <span className="text-sm font-medium">Notifications</span>
                      <span className="text-xs text-champagne-gold">{unreadCount} new</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-text-muted text-sm">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3 border-b border-border-gold/5 hover:bg-dark-elevated/50 transition-colors cursor-pointer ${
                              !notif.read ? "bg-champagne-gold/5" : ""
                            }`}
                          >
                            <p className="text-sm font-medium text-text-primary">{notif.title}</p>
                            <p className="text-xs text-text-muted mt-0.5">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Avatar (mobile) */}
            <div className="lg:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-champagne-gold/30 to-champagne-gold/10 flex items-center justify-center text-champagne-gold text-xs font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Page Content with Error Boundary */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Loading Skeleton ───
function AdminLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-matte-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-champagne-gold/10 border border-champagne-gold/20 flex items-center justify-center animate-pulse">
          <Crown className="w-6 h-6 text-champagne-gold" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-champagne-gold animate-bounce [animation-delay:0ms]" />
          <div className="w-2 h-2 rounded-full bg-champagne-gold animate-bounce [animation-delay:150ms]" />
          <div className="w-2 h-2 rounded-full bg-champagne-gold animate-bounce [animation-delay:300ms]" />
        </div>
        <p className="text-text-muted text-sm">Loading dashboard...</p>
      </div>
    </div>
  );
}

function getPermissionsForRole(role: AdminRole): Record<string, boolean> {
  switch (role) {
    case "super-admin":
      return {
        canManageBookings: true,
        canManageServices: true,
        canManageStaff: true,
        canManageGallery: true,
        canManageTestimonials: true,
        canManageBlog: true,
        canManageSettings: true,
        canViewAnalytics: true,
        canDeleteRecords: true,
      };
    case "manager":
      return {
        canManageBookings: true,
        canManageServices: true,
        canManageStaff: true,
        canManageGallery: true,
        canManageTestimonials: true,
        canManageBlog: false,
        canManageSettings: false,
        canViewAnalytics: true,
        canDeleteRecords: true,
      };
    case "staff":
      return {
        canManageBookings: true,
        canManageServices: false,
        canManageStaff: false,
        canManageGallery: false,
        canManageTestimonials: false,
        canManageBlog: false,
        canManageSettings: false,
        canViewAnalytics: false,
        canDeleteRecords: false,
      };
    default:
      return {};
  }
}
