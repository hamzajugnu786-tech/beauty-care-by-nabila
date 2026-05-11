// ─── Admin Store ───
// Zustand store for admin dashboard state management

"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AdminRole } from "@/lib/types/admin";

interface AdminState {
  // Auth
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    uid: string;
    email: string;
    name: string;
    role: AdminRole;
    image: string | null;
  } | null;
  permissions: Record<string, boolean>;

  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeSection: string;

  // Global search
  searchQuery: string;
  searchOpen: boolean;

  // Notifications
  notifications: AdminNotification[];
  unreadCount: number;

  // Actions
  setAuth: (user: AdminState["user"], permissions: Record<string, boolean>) => void;
  clearAuth: () => void;
  setLoading: (val: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (val: boolean) => void;
  setActiveSection: (section: string) => void;
  setSearchQuery: (query: string) => void;
  setSearchOpen: (open: boolean) => void;
  addNotification: (notification: Omit<AdminNotification, "id" | "createdAt">) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

export interface AdminNotification {
  id: string;
  type: "booking" | "system" | "alert" | "success";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null as AdminState["user"],
  permissions: {} as Record<string, boolean>,
  sidebarOpen: true,
  sidebarCollapsed: false,
  activeSection: "dashboard",
  searchQuery: "",
  searchOpen: false,
  notifications: [] as AdminNotification[],
  unreadCount: 0,
};

export const useAdminStore = create<AdminState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setAuth: (user, permissions) => {
        set({ user, permissions, isAuthenticated: !!user, isLoading: false });
      },

      clearAuth: () => {
        set({ ...initialState, isLoading: false });
      },

      setLoading: (val) => set({ isLoading: val }),

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),

      setActiveSection: (section) => set({ activeSection: section }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setSearchOpen: (open) => set({ searchOpen: open }),

      addNotification: (notification) => {
        const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const newNotif = { ...notification, id, createdAt: new Date().toISOString(), read: false };
        set((state) => ({
          notifications: [newNotif, ...state.notifications].slice(0, 50),
          unreadCount: state.unreadCount + 1,
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    }),
    { name: "admin-store" }
  )
);
