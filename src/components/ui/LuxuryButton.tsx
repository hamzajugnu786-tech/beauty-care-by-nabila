"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LuxuryButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const LuxuryButton = forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-[family-name:var(--font-inter)] tracking-wider uppercase transition-all duration-500 overflow-hidden group";

    const variants = {
      primary:
        "bg-champagne-gold text-matte-black hover:bg-gold-light border border-champagne-gold hover:border-gold-light",
      outline:
        "bg-transparent text-champagne-gold border border-champagne-gold/40 hover:border-champagne-gold hover:bg-champagne-gold/5",
      ghost:
        "bg-transparent text-champagne-gold border-none hover:text-gold-light",
    };

    const sizes = {
      sm: "px-5 py-2.5 text-[11px] letter-spacing-[0.15em]",
      md: "px-8 py-3.5 text-xs letter-spacing-[0.2em]",
      lg: "px-10 py-4 text-sm letter-spacing-[0.2em]",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        {variant === "primary" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-champagne-gold via-gold-light to-champagne-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              backgroundSize: "200% auto",
              animation: "shimmer 3s linear infinite",
            }}
          />
        )}
        {variant === "outline" && (
          <motion.div
            className="absolute inset-0 bg-champagne-gold/5"
            initial={{ x: "-100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </motion.button>
    );
  }
);

LuxuryButton.displayName = "LuxuryButton";
export { LuxuryButton };
