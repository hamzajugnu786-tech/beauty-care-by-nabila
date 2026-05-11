"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { GoldDivider } from "@/components/ui/LuxuryElements";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { BookingStepIndicator } from "@/components/booking/BookingStepIndicator";
import { BranchSelector } from "@/components/booking/BranchSelector";
import { ServiceSelector } from "@/components/booking/ServiceSelector";
import { ArtistPicker } from "@/components/booking/ArtistPicker";
import { DateTimePicker } from "@/components/booking/DateTimePicker";
import { ClientDetailsForm } from "@/components/booking/ClientDetailsForm";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { WhatsAppConcierge } from "@/components/booking/WhatsAppConcierge";
import { useBookingStore } from "@/stores/useBookingStore";

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function BookingPage() {
  const {
    currentStep,
    completedSteps,
    direction,
    selectedBranch,
    selectedService,
    selectedAddOns,
    selectedArtist,
    selectedDate,
    selectedTimeSlot,
    clientDetails,
    bookingId,
    confirmationCode,
    isSubmitting,
    error,
    nextStep,
    prevStep,
    selectBranch,
    selectService,
    toggleAddOn,
    selectArtist,
    setClientDetails,
    setSubmitting,
    setError,
    completeBooking,
    canProceed,
    resetBooking,
  } = useBookingStore();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [whatsappLink, setWhatsappLink] = useState<string>("");

  const validateCurrentStep = useCallback((): boolean => {
    setFormErrors({});

    switch (currentStep) {
      case 1:
        if (!selectedBranch) {
          setError("Please select a branch");
          return false;
        }
        return true;
      case 2:
        if (!selectedService) {
          setError("Please select a service");
          return false;
        }
        return true;
      case 3:
        return true; // Artist is optional
      case 4:
        if (!selectedDate) {
          setError("Please select a date");
          return false;
        }
        if (!selectedTimeSlot) {
          setError("Please select a time slot");
          return false;
        }
        return true;
      case 5: {
        const errors: Record<string, string> = {};
        if (!clientDetails.name.trim() || clientDetails.name.trim().length < 2) {
          errors.name = "Please enter your full name";
        }
        if (!clientDetails.phone.trim() || clientDetails.phone.trim().length < 10) {
          errors.phone = "Please enter a valid phone number";
        }
        if (clientDetails.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientDetails.email)) {
          errors.email = "Please enter a valid email address";
        }
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
          setError("Please fill in all required fields");
          return false;
        }
        return true;
      }
      default:
        return true;
    }
  }, [currentStep, selectedBranch, selectedService, selectedDate, selectedTimeSlot, clientDetails, setError]);

  const handleNext = useCallback(() => {
    if (!validateCurrentStep()) return;
    setError(null);

    if (currentStep === 5) {
      handleSubmitBooking();
    } else {
      nextStep();
    }
  }, [currentStep, validateCurrentStep, nextStep, setError]);

  const handleSubmitBooking = useCallback(async () => {
    if (!selectedBranch || !selectedService || !selectedDate || !selectedTimeSlot) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId: selectedBranch.id,
          branchName: selectedBranch.name,
          serviceId: selectedService.id,
          serviceTitle: selectedService.title,
          serviceCategory: selectedService.category,
          servicePrice: selectedService.price,
          serviceDuration: selectedService.duration,
          addOns: selectedAddOns,
          artistId: selectedArtist?.id || null,
          artistName: selectedArtist?.name || null,
          date: selectedDate,
          timeSlot: selectedTimeSlot.time,
          clientName: clientDetails.name,
          clientPhone: clientDetails.phone,
          clientEmail: clientDetails.email || null,
          clientNotes: clientDetails.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create booking");
        setSubmitting(false);
        return;
      }

      completeBooking(data.booking.id, data.booking.confirmationCode);
      setWhatsappLink(data.whatsappLink || "");
      nextStep();
    } catch (err) {
      console.error("Booking submission error:", err);
      setError("Something went wrong. Please try again or contact us via WhatsApp.");
      setSubmitting(false);
    }
  }, [
    selectedBranch, selectedService, selectedDate, selectedTimeSlot,
    selectedAddOns, selectedArtist, clientDetails,
    setSubmitting, setError, completeBooking, nextStep,
  ]);

  const isConfirmed = !!confirmationCode;

  return (
    <div className="min-h-screen flex flex-col bg-matte-black">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <PageHero
          kicker="Book Your Experience"
          title="Reserve Your Appointment"
          description="A seamless booking experience crafted with the same care we bring to every service. Your journey to beauty begins here."
        />

        {/* Booking Flow */}
        <section className="section-padding pb-20 sm:pb-28">
          <div className="max-w-4xl mx-auto">
            {/* Step Indicator */}
            <div className="mb-10 sm:mb-14">
              <BookingStepIndicator
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepClick={(step) => {
                  if (step < currentStep) {
                    useBookingStore.getState().setStep(step);
                  }
                }}
              />
            </div>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-red-500/5 border border-red-500/20 rounded-sm px-5 py-3 flex items-center gap-3">
                    <svg className="w-4 h-4 text-red-400/70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.12em] text-red-400/80">
                      {error}
                    </p>
                    <button
                      onClick={() => setError(null)}
                      className="ml-auto text-red-400/40 hover:text-red-400/70 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Content */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {currentStep === 1 && (
                    <BranchSelector
                      selectedBranch={selectedBranch}
                      onSelect={selectBranch}
                    />
                  )}

                  {currentStep === 2 && (
                    <ServiceSelector
                      selectedService={selectedService}
                      selectedAddOns={selectedAddOns}
                      onSelectService={selectService}
                      onToggleAddOn={toggleAddOn}
                    />
                  )}

                  {currentStep === 3 && (
                    <ArtistPicker
                      selectedArtist={selectedArtist}
                      onSelect={selectArtist}
                      serviceCategory={selectedService?.category}
                    />
                  )}

                  {currentStep === 4 && (
                    <DateTimePicker />
                  )}

                  {currentStep === 5 && (
                    <ClientDetailsForm
                      details={clientDetails}
                      onUpdate={setClientDetails}
                      errors={formErrors}
                    />
                  )}

                  {currentStep === 6 && (
                    <BookingConfirmation
                      branch={selectedBranch!}
                      service={selectedService!}
                      addOns={selectedAddOns}
                      artist={selectedArtist}
                      date={selectedDate}
                      timeSlot={selectedTimeSlot!}
                      client={clientDetails}
                      confirmationCode={confirmationCode}
                      isSubmitting={isSubmitting}
                      whatsappLink={whatsappLink}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            {!isConfirmed && currentStep < 6 && (
              <div className="mt-10 sm:mt-14 flex items-center justify-between gap-4">
                {/* Back */}
                {currentStep > 1 ? (
                  <LuxuryButton
                    variant="ghost"
                    size="md"
                    onClick={prevStep}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back
                  </LuxuryButton>
                ) : (
                  <div />
                )}

                {/* Next / Submit */}
                <LuxuryButton
                  variant="primary"
                  size="lg"
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                  className={!canProceed() ? "opacity-40 cursor-not-allowed" : ""}
                >
                  {currentStep === 5 ? (
                    <>
                      {isSubmitting ? "Confirming..." : "Confirm Booking"}
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </>
                  ) : (
                    <>
                      Continue
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                      </svg>
                    </>
                  )}
                </LuxuryButton>
              </div>
            )}

            {/* New booking after confirmation */}
            {isConfirmed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-8 text-center"
              >
                <button
                  onClick={resetBooking}
                  className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] text-champagne-gold/40 hover:text-champagne-gold/70 transition-colors duration-500"
                >
                  Book Another Appointment
                </button>
              </motion.div>
            )}

            {/* Smart recommendation */}
            {!isConfirmed && currentStep === 2 && selectedService && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 max-w-lg mx-auto"
              >
                <div className="bg-dark-card border border-champagne-gold/8 rounded-sm p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full border border-champagne-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-champagne-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.15em] text-champagne-gold/60 mb-1">
                      Recommended
                    </p>
                    <p className="font-[family-name:var(--font-cormorant)] text-sm text-text-muted leading-relaxed">
                      {selectedService.category === "bridal"
                        ? "Bridal services often require a consultation first. We recommend booking a trial session at least 6 weeks before your event."
                        : selectedService.category === "skincare"
                        ? "For best results, we recommend scheduling skincare treatments at least 2 weeks before any special event."
                        : selectedService.category === "hair"
                        ? "Hair colour treatments require a patch test 48 hours before your appointment. Please let us know if this is your first visit."
                        : "Add a complementary service to make the most of your visit."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Booking status lookup */}
        <section className="relative py-16 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 luxury-gradient opacity-30" />
          <div className="relative z-10 section-padding max-w-xl mx-auto text-center">
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] text-champagne-gold/50 mb-3">
              Already Booked?
            </p>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary">
              Check Your Booking Status
            </h3>
            <p className="mt-2 font-[family-name:var(--font-cormorant)] text-base text-text-muted">
              Enter your confirmation code to view or manage your appointment
            </p>
            <div className="mt-6 flex items-center gap-3 max-w-sm mx-auto">
              <input
                type="text"
                placeholder="NBL-XXXXXX"
                className="flex-1 bg-dark-card border border-champagne-gold/10 rounded-sm px-4 py-3 font-[family-name:var(--font-inter)] text-sm tracking-[0.15em] text-text-primary placeholder:text-text-muted/25 outline-none focus:border-champagne-gold/30 transition-colors uppercase text-center"
              />
              <LuxuryButton variant="outline" size="sm">
                Lookup
              </LuxuryButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppConcierge />
    </div>
  );
}
