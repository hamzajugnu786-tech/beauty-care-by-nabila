"use client";

// Force dynamic rendering
export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save, Globe, Phone, Mail, MapPin, Clock, Instagram, Facebook,
  Youtube, Sparkles, Shield, Database, Bell, Palette,
} from "lucide-react";
import { BRAND } from "@/lib/constants";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"brand" | "system" | "notifications">("brand");
  const [saved, setSaved] = useState(false);
  const [brandForm, setBrandForm] = useState({
    name: BRAND.name,
    tagline: BRAND.tagline,
    phone: BRAND.phone,
    whatsapp: BRAND.whatsapp,
    email: BRAND.email,
    address: BRAND.address,
    hours: BRAND.hours,
    instagram: BRAND.social.instagram,
    facebook: BRAND.social.facebook,
    tiktok: BRAND.social.tiktok,
    youtube: BRAND.social.youtube,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "brand" as const, label: "Brand", icon: Palette },
    { id: "system" as const, label: "System", icon: Database },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-text-primary">Settings</h1>
          <p className="text-text-muted text-sm mt-1">Manage your salon configuration</p>
        </div>
        <button onClick={handleSave}
          className="px-5 py-2.5 bg-champagne-gold hover:bg-champagne-gold/90 text-matte-black font-semibold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-champagne-gold/20 transition-all">
          <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="flex items-center gap-2 border-b border-border-gold/10 pb-1">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-1 ${
              activeTab === tab.id
                ? "text-champagne-gold border-champagne-gold"
                : "text-text-muted border-transparent hover:text-text-primary"
            }`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Brand Settings */}
      {activeTab === "brand" && (
        <motion.div variants={item} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-dark-card border border-border-gold/10 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-champagne-gold" /> Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Brand Name</label>
                <input type="text" value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-elevated border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
              </div>
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Tagline</label>
                <input type="text" value={brandForm.tagline}
                  onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-elevated border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
              </div>
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input type="text" value={brandForm.phone}
                    onChange={(e) => setBrandForm({ ...brandForm, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 bg-dark-elevated border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">WhatsApp</label>
                <input type="text" value={brandForm.whatsapp}
                  onChange={(e) => setBrandForm({ ...brandForm, whatsapp: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-elevated border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
              </div>
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input type="email" value={brandForm.email}
                    onChange={(e) => setBrandForm({ ...brandForm, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 bg-dark-elevated border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Hours</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input type="text" value={brandForm.hours}
                    onChange={(e) => setBrandForm({ ...brandForm, hours: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 bg-dark-elevated border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 w-4 h-4 text-text-muted" />
                <input type="text" value={brandForm.address}
                  onChange={(e) => setBrandForm({ ...brandForm, address: e.target.value })}
                  className="w-full pl-11 pr-4 py-2.5 bg-dark-elevated border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-dark-card border border-border-gold/10 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-champagne-gold" /> Social Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block flex items-center gap-1"><Instagram className="w-3 h-3" /> Instagram</label>
                <input type="url" value={brandForm.instagram}
                  onChange={(e) => setBrandForm({ ...brandForm, instagram: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-elevated border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
              </div>
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block flex items-center gap-1"><Facebook className="w-3 h-3" /> Facebook</label>
                <input type="url" value={brandForm.facebook}
                  onChange={(e) => setBrandForm({ ...brandForm, facebook: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-elevated border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
              </div>
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">TikTok</label>
                <input type="url" value={brandForm.tiktok}
                  onChange={(e) => setBrandForm({ ...brandForm, tiktok: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-elevated border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
              </div>
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block flex items-center gap-1"><Youtube className="w-3 h-3" /> YouTube</label>
                <input type="url" value={brandForm.youtube}
                  onChange={(e) => setBrandForm({ ...brandForm, youtube: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-elevated border border-border-gold/10 rounded-xl text-sm text-text-primary focus:outline-none focus:border-champagne-gold/30" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* System Settings */}
      {activeTab === "system" && (
        <motion.div variants={item} className="space-y-6">
          <div className="bg-dark-card border border-border-gold/10 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-champagne-gold" /> Integration Status
            </h2>
            <div className="space-y-3">
              {[
                { name: "Firebase Auth", status: "configured", desc: "Authentication service" },
                { name: "Firestore", status: "configured", desc: "Real-time database" },
                { name: "Sanity CMS", status: "pending", desc: "Content management" },
                { name: "Cloudinary", status: "pending", desc: "Image optimization" },
                { name: "Prisma / SQLite", status: "connected", desc: "Local database" },
              ].map((service) => (
                <div key={service.name} className="flex items-center justify-between p-3 rounded-xl bg-dark-elevated/50">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{service.name}</p>
                    <p className="text-[10px] text-text-muted">{service.desc}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                    service.status === "connected" || service.status === "configured"
                      ? "bg-emerald-400/10 text-emerald-400"
                      : "bg-amber-400/10 text-amber-400"
                  }`}>
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-dark-card border border-border-gold/10 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-champagne-gold" /> Security
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-primary">Two-Factor Authentication</p>
                  <p className="text-xs text-text-muted">Require 2FA for all admin accounts</p>
                </div>
                <button className="px-3 py-1.5 bg-champagne-gold/10 text-champagne-gold rounded-lg text-xs font-medium">Enable</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-primary">Session Timeout</p>
                  <p className="text-xs text-text-muted">Auto-logout after inactivity</p>
                </div>
                <span className="text-sm text-text-muted">24 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-primary">Activity Logging</p>
                  <p className="text-xs text-text-muted">Track admin actions for audit</p>
                </div>
                <span className="text-sm text-emerald-400">Enabled</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications Settings */}
      {activeTab === "notifications" && (
        <motion.div variants={item} className="space-y-6">
          <div className="bg-dark-card border border-border-gold/10 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-text-primary mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { label: "New Booking Alerts", desc: "Get notified for every new booking", enabled: true },
                { label: "Cancellation Alerts", desc: "Immediate notification on cancellations", enabled: true },
                { label: "Daily Summary", desc: "Daily digest of bookings and revenue", enabled: false },
                { label: "Staff Schedule Changes", desc: "Alerts when staff availability changes", enabled: true },
                { label: "Low Rating Alerts", desc: "Notifications for ratings below 4 stars", enabled: false },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between p-3 rounded-xl bg-dark-elevated/50">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{pref.label}</p>
                    <p className="text-xs text-text-muted">{pref.desc}</p>
                  </div>
                  <span className={`text-sm ${pref.enabled ? "text-emerald-400" : "text-text-muted"}`}>
                    {pref.enabled ? "On" : "Off"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
