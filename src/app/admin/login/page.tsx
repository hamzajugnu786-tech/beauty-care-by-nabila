"use client";

// Force dynamic rendering
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("firebase-credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo quick-login buttons (remove in production)
  const handleDemoLogin = (role: string) => {
    const demoEmails: Record<string, string> = {
      "super-admin": "admin@nabilalahore.com",
      manager: "manager@nabilalahore.com",
      staff: "staff@nabilalahore.com",
    };
    setEmail(demoEmails[role] || "");
    setPassword("demo1234");
  };

  return (
    <div className="min-h-screen bg-matte-black flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-matte-black via-dark-surface to-matte-black" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-champagne-gold/5 rounded-full blur-[120px]" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-champagne-gold/3 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Sparkles className="w-6 h-6 text-champagne-gold" />
            <span className="text-champagne-gold font-serif text-lg tracking-widest uppercase">
              Admin Portal
            </span>
            <Sparkles className="w-6 h-6 text-champagne-gold" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-serif text-text-primary mb-2">
            {BRAND.name}
          </h1>
          <p className="text-text-muted text-sm">Sign in to manage your salon</p>
        </div>

        {/* Login Card */}
        <div className="bg-dark-card/80 backdrop-blur-xl border border-border-gold/30 rounded-2xl p-8 shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nabilalahore.com"
                  className="w-full pl-11 pr-4 py-3 bg-dark-elevated border border-border-gold/20 rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-champagne-gold/50 focus:ring-1 focus:ring-champagne-gold/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 bg-dark-elevated border border-border-gold/20 rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-champagne-gold/50 focus:ring-1 focus:ring-champagne-gold/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-champagne-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3.5 bg-champagne-gold hover:bg-champagne-gold/90 text-matte-black font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-champagne-gold/20"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-matte-black/20 border-t-matte-black rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Demo Logins */}
          <div className="mt-6 pt-6 border-t border-border-gold/10">
            <p className="text-text-muted/60 text-xs text-center mb-3 uppercase tracking-wider">
              Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["super-admin", "manager", "staff"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => handleDemoLogin(role)}
                  className="px-3 py-2 bg-dark-elevated border border-border-gold/10 rounded-lg text-xs text-text-muted hover:text-champagne-gold hover:border-champagne-gold/20 transition-all capitalize"
                >
                  {role.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-text-muted/40 text-xs mt-6">
          {BRAND.name} &mdash; Admin Dashboard v1.0
        </p>
      </motion.div>
    </div>
  );
}
