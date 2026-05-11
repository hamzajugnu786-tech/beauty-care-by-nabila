"use client";

import { cn } from "@/lib/utils";

export function GoldDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-champagne-gold/40 to-transparent" />
      <div className="w-1.5 h-1.5 rotate-45 bg-champagne-gold/60" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-champagne-gold/40 to-transparent" />
    </div>
  );
}

export function SectionHeading({
  kicker,
  title,
  description,
  align = "center",
  className,
}: {
  kicker?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {kicker && (
        <p className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.3em] text-champagne-gold mb-4">
          {kicker}
        </p>
      )}
      <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-medium text-text-primary leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-5 font-[family-name:var(--font-cormorant)] text-lg sm:text-xl text-text-muted leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  return (
    <span className="tabular-nums">
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
