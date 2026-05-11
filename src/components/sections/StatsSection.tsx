"use client";

import { motion } from "framer-motion";
import { STATS } from "@/lib/constants";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useCounter, useInView } from "@/hooks/useAnimations";

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, inView } = useInView(0.3);
  const { count, startCounting } = useCounter(value, 2500);

  if (inView && count === 0) startCounting();

  return (
    <div ref={ref} className="text-center group">
      <motion.div
        initial={{ scale: 0.95 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl font-medium text-champagne-gold">
          {count.toLocaleString()}
          {suffix}
        </p>
        <p className="mt-3 font-[family-name:var(--font-inter)] text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-text-muted group-hover:text-text-primary/70 transition-colors duration-500">
          {label}
        </p>
      </motion.div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background with gold accent */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-dark-surface" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(212,175,55,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,175,55,0.1) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        {/* Gold gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-champagne-gold/[0.02] via-transparent to-champagne-gold/[0.02]" />
      </div>

      <div className="relative z-10 section-padding max-w-[1440px] mx-auto">
        <RevealOnScroll>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {STATS.map((stat) => (
              <StatCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </RevealOnScroll>
      </div>

      {/* Top and bottom borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-champagne-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-champagne-gold/20 to-transparent" />
    </section>
  );
}
