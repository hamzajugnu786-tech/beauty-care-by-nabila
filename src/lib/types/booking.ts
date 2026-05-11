// ─── Booking Types & Interfaces ───

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "no-show";

export type PaymentStatus = "unpaid" | "deposit" | "paid" | "refunded";

export interface BookingService {
  id: string;
  title: string;
  category: string;
  price: string;
  duration: string;
  icon: string;
  addOns?: readonly string[];
}

export interface BookingArtist {
  id: string;
  name: string;
  title: string;
  specialties: readonly string[];
  experience: string;
  image: string;
  rating: number;
  available: boolean;
}

export interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
  artistId?: string;
}

export interface BookingBranch {
  id: string;
  name: string;
  address: string;
  phone: string;
  isMain: boolean;
}

export interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export interface Booking {
  id: string;
  // Step 1: Branch
  branch: BookingBranch;
  // Step 2: Service
  service: BookingService;
  addOns: string[];
  // Step 3: Artist
  artist: BookingArtist | null;
  // Step 4: Date
  date: string;
  // Step 5: Time
  timeSlot: TimeSlot;
  // Step 6: Client info
  client: BookingFormData;
  // Status
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  // Meta
  createdAt: string;
  updatedAt: string;
  confirmationCode: string;
  whatsappSent: boolean;
}

// ─── Booking Step Definitions ───
export const BOOKING_STEPS = [
  { id: 1, key: "branch", label: "Branch", icon: "map-pin" },
  { id: 2, key: "service", label: "Service", icon: "sparkles" },
  { id: 3, key: "artist", label: "Artist", icon: "user" },
  { id: 4, key: "datetime", label: "Date & Time", icon: "calendar" },
  { id: 5, key: "details", label: "Your Details", icon: "clipboard" },
  { id: 6, key: "confirm", label: "Confirm", icon: "check" },
] as const;

export type BookingStepKey = (typeof BOOKING_STEPS)[number]["key"];
