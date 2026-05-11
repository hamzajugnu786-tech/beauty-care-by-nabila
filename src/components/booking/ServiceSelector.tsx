"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BookingService } from "@/lib/types/booking";
import { DETAILED_SERVICES, SERVICE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ServiceSelectorProps {
  selectedService: BookingService | null;
  selectedAddOns: string[];
  onSelectService: (service: BookingService) => void;
  onToggleAddOn: (addOn: string) => void;
}

const serviceIcons: Record<string, JSX.Element> = {
  crown: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 21V7.5l4.5 3 4.5-6 4.5 6 4.5-3V21" />
    </svg>
  ),
  scissors: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.696.14-1.025m-1.223 2.863l2.077-1.199m0-3.328l2.774 1.6a2.165 2.165 0 002.166 0l2.774-1.6M14.5 12l2.307 1.327M14.5 12l-2.307 1.327M14.5 12V8.25m7.5 3.75l-1.536-.887M21.75 12a3 3 0 11-5.196 3 3 3 0 015.196-3zm-1.536.887a2.165 2.165 0 00-1.083-1.838 4.49 4.49 0 00-.14-1.025m1.223 2.863l-2.077-1.199" />
    </svg>
  ),
  sparkles: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  palette: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
    </svg>
  ),
  gem: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  leaf: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
};

export function ServiceSelector({
  selectedService,
  selectedAddOns,
  onSelectService,
  onToggleAddOn,
}: ServiceSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredServices =
    activeCategory === "all"
      ? DETAILED_SERVICES
      : DETAILED_SERVICES.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-medium text-text-primary">
          Select Your Service
        </h3>
        <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg text-text-muted">
          Choose the experience that calls to you
        </p>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 flex-wrap justify-center mb-6">
        {SERVICE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "font-[family-name:var(--font-inter)] text-[9px] sm:text-[10px] uppercase tracking-[0.15em] px-3 sm:px-4 py-1.5 rounded-sm border transition-all duration-500",
              activeCategory === cat.id
                ? "border-champagne-gold text-champagne-gold bg-champagne-gold/5"
                : "border-champagne-gold/10 text-text-muted/50 hover:text-text-muted hover:border-champagne-gold/20"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Service grid */}
      <div className="max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {filteredServices.map((service, i) => {
              const isSelected = selectedService?.id === service.id;

              return (
                <motion.button
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() =>
                    onSelectService({
                      id: service.id,
                      title: service.title,
                      category: service.category,
                      price: service.price,
                      duration: service.duration,
                      icon: service.icon,
                    })
                  }
                  className={cn(
                    "relative text-left p-5 rounded-sm border transition-all duration-500 overflow-hidden",
                    isSelected
                      ? "border-champagne-gold/50 bg-champagne-gold/5"
                      : "border-champagne-gold/8 bg-dark-card hover:border-champagne-gold/20"
                  )}
                >
                  {/* Selected check */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-5 h-5 rounded-full bg-champagne-gold flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-matte-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </motion.div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors duration-500",
                      isSelected ? "border-champagne-gold/40 text-champagne-gold" : "border-champagne-gold/15 text-champagne-gold/50"
                    )}>
                      {serviceIcons[service.icon] || serviceIcons.sparkles}
                    </div>
                    <div className="min-w-0">
                      <h4 className={cn(
                        "font-[family-name:var(--font-playfair)] text-base font-medium transition-colors duration-500 truncate",
                        isSelected ? "text-champagne-gold" : "text-text-primary"
                      )}>
                        {service.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.15em] text-champagne-gold/60">
                          {service.price}
                        </span>
                        <span className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.1em] text-text-muted/40">
                          {service.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add-ons (shown when service is selected) */}
      <AnimatePresence>
        {selectedService && selectedService.addOns && selectedService.addOns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-champagne-gold/10">
              <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.25em] text-champagne-gold/60 mb-3">
                Recommended Add-Ons
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedService.addOns.map((addOn) => {
                  const isSelected = selectedAddOns.includes(addOn);
                  return (
                    <motion.button
                      key={addOn}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onToggleAddOn(addOn)}
                      className={cn(
                        "font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-sm border transition-all duration-300",
                        isSelected
                          ? "border-champagne-gold/40 text-champagne-gold bg-champagne-gold/8"
                          : "border-champagne-gold/10 text-text-muted/50 hover:border-champagne-gold/25 hover:text-text-muted"
                      )}
                    >
                      {isSelected && "+ "}{addOn}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.15);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
