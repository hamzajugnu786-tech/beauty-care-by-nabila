"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import type { TimeSlot } from "@/lib/types/booking";
import { useBookingStore } from "@/stores/useBookingStore";
import { cn } from "@/lib/utils";

// Generate next 30 days of available dates
function generateAvailableDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const date = addDays(today, i);
    // Skip Sundays (by appointment only)
    if (date.getDay() !== 0) {
      dates.push(date);
    }
  }
  return dates;
}

export function DateTimePicker() {
  const {
    selectedDate,
    selectedTimeSlot,
    selectedArtist,
    selectDate,
    selectTimeSlot,
    setAvailableSlots,
    isCheckingAvailability,
    setCheckingAvailability,
  } = useBookingStore();

  const [availableDates] = useState<Date[]>(generateAvailableDates());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [dateSelected, setDateSelected] = useState(!!selectedDate);

  // Simulate fetching availability when date changes
  const fetchAvailability = useCallback(
    async (dateStr: string) => {
      setCheckingAvailability(true);
      try {
        const params = new URLSearchParams({ date: dateStr });
        if (selectedArtist?.id) {
          params.set("artistId", selectedArtist.id);
        }
        const res = await fetch(`/api/availability?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setSlots(data.slots || []);
          setAvailableSlots(data.slots || []);
        } else {
          // Fallback: generate local slots
          generateLocalSlots(dateStr);
        }
      } catch {
        // Fallback: generate local slots
        generateLocalSlots(dateStr);
      }
      setCheckingAvailability(false);
    },
    [selectedArtist, setAvailableSlots, setCheckingAvailability]
  );

  // Generate local slots as fallback
  const generateLocalSlots = (dateStr: string) => {
    const date = parseISO(dateStr);
    const now = new Date();
    const isToday = isSameDay(date, now);
    const currentHour = now.getHours();

    const localSlots: TimeSlot[] = [];
    for (let hour = 10; hour < 20; hour++) {
      const timeStr = `${hour.toString().padStart(2, "0")}:00`;
      const label = hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;

      // Simulate some slots being taken
      const isPeakHour = hour >= 12 && hour <= 14 || hour >= 17 && hour <= 19;
      const isRandomlyTaken = Math.random() < 0.25;
      const isPast = isToday && hour <= currentHour;

      localSlots.push({
        time: timeStr,
        label: hour === 12 ? "12:00 PM" : label,
        available: !isPast && !(isPeakHour && isRandomlyTaken),
      });
    }
    setSlots(localSlots);
    setAvailableSlots(localSlots);
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate);
      setDateSelected(true);
    }
  }, [selectedDate, selectedArtist, fetchAvailability]);

  const handleDateSelect = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    selectDate(dateStr);
  };

  // Group slots into time periods
  const morningSlots = slots.filter((s) => parseInt(s.time) < 12);
  const afternoonSlots = slots.filter((s) => parseInt(s.time) >= 12 && parseInt(s.time) < 17);
  const eveningSlots = slots.filter((s) => parseInt(s.time) >= 17);

  const selectedDateObj = selectedDate ? parseISO(selectedDate) : null;
  const availableCount = slots.filter((s) => s.available).length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-medium text-text-primary">
          Pick Your Date & Time
        </h3>
        <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg text-text-muted">
          Choose a convenient slot for your appointment
        </p>
      </div>

      {/* Date picker - horizontal scrollable */}
      <div>
        <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.25em] text-champagne-gold/60 mb-3">
          Select Date
        </p>
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 custom-scrollbar">
          {availableDates.map((date) => {
            const isSelected = selectedDateObj && isSameDay(date, selectedDateObj);
            const dayName = format(date, "EEE");
            const dayNum = format(date, "d");
            const monthName = format(date, "MMM");

            return (
              <motion.button
                key={date.toISOString()}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateSelect(date)}
                className={cn(
                  "flex-shrink-0 w-16 sm:w-[72px] py-3 rounded-sm border text-center transition-all duration-500",
                  isSelected
                    ? "border-champagne-gold/50 bg-champagne-gold/10 text-champagne-gold"
                    : "border-champagne-gold/10 bg-dark-card hover:border-champagne-gold/25 text-text-muted"
                )}
              >
                <p className={cn(
                  "font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.1em]",
                  isSelected ? "text-champagne-gold/70" : "text-text-muted/40"
                )}>
                  {dayName}
                </p>
                <p className={cn(
                  "font-[family-name:var(--font-playfair)] text-xl font-medium mt-0.5",
                  isSelected ? "text-champagne-gold" : "text-text-primary"
                )}>
                  {dayNum}
                </p>
                <p className={cn(
                  "font-[family-name:var(--font-inter)] text-[8px] tracking-[0.08em]",
                  isSelected ? "text-champagne-gold/50" : "text-text-muted/30"
                )}>
                  {monthName}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <AnimatePresence mode="wait">
        {dateSelected ? (
          <motion.div
            key="timeslots"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.25em] text-champagne-gold/60">
                Select Time
              </p>
              {!isCheckingAvailability && (
                <p className="font-[family-name:var(--font-inter)] text-[9px] tracking-[0.1em] text-text-muted/40">
                  {availableCount} slots available
                </p>
              )}
            </div>

            {isCheckingAvailability ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-champagne-gold/50"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-champagne-gold/50"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-champagne-gold/50"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                  <span className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.15em] text-text-muted/50 ml-2">
                    Checking availability
                  </span>
                </div>
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted/50 italic">
                  Closed on Sundays — by appointment only
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-1 custom-scrollbar">
                {/* Morning */}
                {morningSlots.length > 0 && (
                  <div>
                    <p className="font-[family-name:var(--font-inter)] text-[8px] uppercase tracking-[0.2em] text-text-muted/30 mb-2">
                      Morning
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {morningSlots.map((slot) => (
                        <TimeSlotButton
                          key={slot.time}
                          slot={slot}
                          isSelected={selectedTimeSlot?.time === slot.time}
                          onSelect={selectTimeSlot}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Afternoon */}
                {afternoonSlots.length > 0 && (
                  <div>
                    <p className="font-[family-name:var(--font-inter)] text-[8px] uppercase tracking-[0.2em] text-text-muted/30 mb-2">
                      Afternoon
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {afternoonSlots.map((slot) => (
                        <TimeSlotButton
                          key={slot.time}
                          slot={slot}
                          isSelected={selectedTimeSlot?.time === slot.time}
                          onSelect={selectTimeSlot}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Evening */}
                {eveningSlots.length > 0 && (
                  <div>
                    <p className="font-[family-name:var(--font-inter)] text-[8px] uppercase tracking-[0.2em] text-text-muted/30 mb-2">
                      Evening
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {eveningSlots.map((slot) => (
                        <TimeSlotButton
                          key={slot.time}
                          slot={slot}
                          isSelected={selectedTimeSlot?.time === slot.time}
                          onSelect={selectTimeSlot}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-12 h-12 mx-auto rounded-full border border-champagne-gold/15 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-champagne-gold/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <p className="font-[family-name:var(--font-cormorant)] text-base text-text-muted/50">
              Please select a date to view available times
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
          height: 3px;
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

function TimeSlotButton({
  slot,
  isSelected,
  onSelect,
}: {
  slot: TimeSlot;
  isSelected: boolean;
  onSelect: (slot: TimeSlot) => void;
}) {
  return (
    <motion.button
      whileHover={slot.available ? { y: -1 } : undefined}
      whileTap={slot.available ? { scale: 0.95 } : undefined}
      onClick={() => slot.available && onSelect(slot)}
      disabled={!slot.available}
      className={cn(
        "py-2.5 px-2 rounded-sm border text-center transition-all duration-300",
        isSelected
          ? "border-champagne-gold/50 bg-champagne-gold/10 text-champagne-gold"
          : slot.available
          ? "border-champagne-gold/10 bg-dark-card text-text-muted hover:border-champagne-gold/25 hover:text-text-primary"
          : "border-champagne-gold/5 bg-dark-surface/50 text-text-muted/20 cursor-not-allowed line-through"
      )}
    >
      <span className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.08em]">
        {slot.label}
      </span>
    </motion.button>
  );
}
