"use client";

import { motion } from "framer-motion";
import type { BookingArtist } from "@/lib/types/booking";
import { BRIDAL_ARTISTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Extend the BRIDAL_ARTISTS data with booking-specific fields
const BOOKING_ARTISTS: BookingArtist[] = BRIDAL_ARTISTS.map((artist) => ({
  id: artist.id,
  name: artist.name,
  title: artist.title,
  specialties: artist.specialties,
  experience: artist.experience,
  image: artist.image,
  rating: 4.9,
  available: true,
}));

// Add "Any Available" option
const ANY_ARTIST: BookingArtist = {
  id: "any",
  name: "Any Available Artist",
  title: "We'll assign the best available",
  specialties: [] as readonly string[],
  experience: "",
  image: "",
  rating: 5,
  available: true,
};

interface ArtistPickerProps {
  selectedArtist: BookingArtist | null;
  onSelect: (artist: BookingArtist | null) => void;
  serviceCategory?: string;
}

export function ArtistPicker({ selectedArtist, onSelect, serviceCategory }: ArtistPickerProps) {
  // Filter artists by service category if provided
  const relevantArtists = serviceCategory
    ? BOOKING_ARTISTS.filter((a) => {
        if (a.id === "any") return true;
        const categoryMap: Record<string, string[]> = {
          bridal: ["Bridal Couture", "Traditional Redesign", "Celebrity Styling", "Contemporary Bridal", "Airbrush Techniques"],
          hair: ["Hairstyling", "Bridal Updos", "Hair Extensions", "Traditional Styling"],
          makeup: ["Airbrush Techniques", "Colour Theory", "HD & Airbrush"],
          skincare: ["Skin Preparation"],
          nails: [],
          spa: [],
        };
        const relevant = categoryMap[serviceCategory] || [];
        return relevant.some((s) => a.specialties.includes(s)) || relevant.length === 0;
      })
    : BOOKING_ARTISTS;

  const displayArtists = [ANY_ARTIST, ...relevantArtists.filter((a) => a.id !== "any")];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-medium text-text-primary">
          Choose Your Artist
        </h3>
        <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg text-text-muted">
          Select your preferred stylist — or let us assign the best available
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {displayArtists.map((artist, i) => {
          const isSelected = selectedArtist?.id === artist.id;
          const isAny = artist.id === "any";

          return (
            <motion.button
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(isAny ? null : artist)}
              className={cn(
                "relative text-left p-5 rounded-sm border transition-all duration-500 overflow-hidden",
                isSelected
                  ? "border-champagne-gold/50 bg-champagne-gold/5"
                  : "border-champagne-gold/10 bg-dark-card hover:border-champagne-gold/25",
                !artist.available && "opacity-40 cursor-not-allowed"
              )}
              disabled={!artist.available}
            >
              {/* Selected indicator */}
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

              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors duration-500",
                  isSelected ? "border-champagne-gold/40 bg-champagne-gold/10" : "border-champagne-gold/15 bg-dark-elevated"
                )}>
                  {isAny ? (
                    <svg className="w-5 h-5 text-champagne-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  ) : (
                    <span className="font-[family-name:var(--font-playfair)] text-sm text-champagne-gold/60">
                      {artist.name.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className={cn(
                    "font-[family-name:var(--font-playfair)] text-base font-medium transition-colors duration-500",
                    isSelected ? "text-champagne-gold" : "text-text-primary"
                  )}>
                    {artist.name}
                  </h4>
                  <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.12em] text-text-muted/50 mt-0.5">
                    {artist.title}
                  </p>

                  {/* Specialties */}
                  {!isAny && artist.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {artist.specialties.slice(0, 3).map((spec) => (
                        <span
                          key={spec}
                          className="font-[family-name:var(--font-inter)] text-[8px] uppercase tracking-[0.1em] text-champagne-gold/40 border border-champagne-gold/8 px-2 py-0.5 rounded-sm"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Experience & Rating */}
                  {!isAny && (
                    <div className="flex items-center gap-3 mt-2">
                      {artist.experience && (
                        <span className="font-[family-name:var(--font-inter)] text-[8px] uppercase tracking-[0.1em] text-text-muted/40">
                          {artist.experience}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-champagne-gold/50" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-[family-name:var(--font-inter)] text-[8px] text-champagne-gold/40">
                          {artist.rating}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
