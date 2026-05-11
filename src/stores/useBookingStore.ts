"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  BookingService,
  BookingArtist,
  TimeSlot,
  BookingBranch,
  BookingFormData,
  BookingStatus,
  PaymentStatus,
  BookingStepKey,
} from "@/lib/types/booking";
import { BOOKING_STEPS } from "@/lib/types/booking";

interface BookingState {
  // Current step
  currentStep: number;
  completedSteps: number[];
  direction: 1 | -1;

  // Step 1: Branch
  selectedBranch: BookingBranch | null;

  // Step 2: Service
  selectedService: BookingService | null;
  selectedAddOns: string[];

  // Step 3: Artist
  selectedArtist: BookingArtist | null;

  // Step 4: Date & Time
  selectedDate: string;
  selectedTimeSlot: TimeSlot | null;
  availableSlots: TimeSlot[];

  // Step 5: Client details
  clientDetails: BookingFormData;

  // Booking result
  bookingId: string | null;
  confirmationCode: string | null;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;

  // UI state
  isSubmitting: boolean;
  isCheckingAvailability: boolean;
  error: string | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  selectBranch: (branch: BookingBranch) => void;
  selectService: (service: BookingService) => void;
  toggleAddOn: (addOn: string) => void;
  selectArtist: (artist: BookingArtist | null) => void;
  selectDate: (date: string) => void;
  selectTimeSlot: (slot: TimeSlot) => void;
  setAvailableSlots: (slots: TimeSlot[]) => void;
  setClientDetails: (details: Partial<BookingFormData>) => void;
  setSubmitting: (val: boolean) => void;
  setCheckingAvailability: (val: boolean) => void;
  setError: (error: string | null) => void;
  completeBooking: (bookingId: string, confirmationCode: string) => void;
  cancelBooking: () => void;
  resetBooking: () => void;
  getStepKey: () => BookingStepKey;
  canProceed: () => boolean;
}

const initialClientDetails: BookingFormData = {
  name: "",
  phone: "",
  email: "",
  notes: "",
};

const initialState = {
  currentStep: 1,
  completedSteps: [] as number[],
  direction: 1 as const,
  selectedBranch: null as BookingBranch | null,
  selectedService: null as BookingService | null,
  selectedAddOns: [] as string[],
  selectedArtist: null as BookingArtist | null,
  selectedDate: "",
  selectedTimeSlot: null as TimeSlot | null,
  availableSlots: [] as TimeSlot[],
  clientDetails: initialClientDetails,
  bookingId: null as string | null,
  confirmationCode: null as string | null,
  bookingStatus: "pending" as BookingStatus,
  paymentStatus: "unpaid" as PaymentStatus,
  isSubmitting: false,
  isCheckingAvailability: false,
  error: null as string | null,
};

export const useBookingStore = create<BookingState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setStep: (step: number) => {
        const current = get().currentStep;
        set({
          currentStep: step,
          direction: step > current ? 1 : -1,
        });
      },

      nextStep: () => {
        const { currentStep, completedSteps } = get();
        const maxStep = BOOKING_STEPS.length;
        if (currentStep < maxStep) {
          const newCompleted = completedSteps.includes(currentStep)
            ? completedSteps
            : [...completedSteps, currentStep];
          set({
            currentStep: currentStep + 1,
            completedSteps: newCompleted,
            direction: 1,
            error: null,
          });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({
            currentStep: currentStep - 1,
            direction: -1,
            error: null,
          });
        }
      },

      selectBranch: (branch) => {
        set({ selectedBranch: branch, error: null });
      },

      selectService: (service) => {
        set({ selectedService: service, error: null });
      },

      toggleAddOn: (addOn) => {
        const { selectedAddOns } = get();
        const exists = selectedAddOns.includes(addOn);
        set({
          selectedAddOns: exists
            ? selectedAddOns.filter((a) => a !== addOn)
            : [...selectedAddOns, addOn],
        });
      },

      selectArtist: (artist) => {
        set({ selectedArtist: artist, error: null });
      },

      selectDate: (date) => {
        set({ selectedDate: date, selectedTimeSlot: null, error: null });
      },

      selectTimeSlot: (slot) => {
        set({ selectedTimeSlot: slot, error: null });
      },

      setAvailableSlots: (slots) => {
        set({ availableSlots: slots });
      },

      setClientDetails: (details) => {
        set((state) => ({
          clientDetails: { ...state.clientDetails, ...details },
          error: null,
        }));
      },

      setSubmitting: (val) => set({ isSubmitting: val }),
      setCheckingAvailability: (val) => set({ isCheckingAvailability: val }),
      setError: (error) => set({ error }),

      completeBooking: (bookingId, confirmationCode) => {
        set({
          bookingId,
          confirmationCode,
          bookingStatus: "confirmed",
          isSubmitting: false,
          currentStep: 6,
        });
      },

      cancelBooking: () => {
        set({ bookingStatus: "cancelled" });
      },

      resetBooking: () => {
        set(initialState);
      },

      getStepKey: () => {
        const { currentStep } = get();
        return BOOKING_STEPS[currentStep - 1]?.key ?? "branch";
      },

      canProceed: () => {
        const state = get();
        switch (state.currentStep) {
          case 1:
            return state.selectedBranch !== null;
          case 2:
            return state.selectedService !== null;
          case 3:
            return true; // Artist selection is optional
          case 4:
            return state.selectedDate !== "" && state.selectedTimeSlot !== null;
          case 5:
            return (
              state.clientDetails.name.trim() !== "" &&
              state.clientDetails.phone.trim() !== ""
            );
          default:
            return false;
        }
      },
    }),
    { name: "booking-store" }
  )
);
