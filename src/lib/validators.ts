// ─── Input Validation Schemas ───
// Zod-based validation for all API inputs
// Provides type-safe validation with detailed error messages

import { z } from "zod";

// ─── Custom Zod Refinements ───

/**
 * Pakistan phone number validation
 * Accepts: +92XXXXXXXXXX, 0XXXXXXXXXX, 3XXXXXXXXX
 */
export const pakistanPhoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .transform((val) => val.replace(/[\s\-\(\)]/g, ""))
  .refine(
    (val) => /^(\+92|0)?3\d{9}$/.test(val),
    "Please enter a valid Pakistani phone number (e.g., 03001234567)"
  );

/**
 * Email validation with sanitization
 */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .transform((val) => val.trim().toLowerCase())
  .refine(
    (val) => /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(val),
    "Please enter a valid email address"
  );

/**
 * Optional email validation
 */
export const optionalEmailSchema = z
  .string()
  .transform((val) => val?.trim().toLowerCase() || "")
  .refine(
    (val) => !val || /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(val),
    "Please enter a valid email address"
  );

/**
 * Name validation - allows letters, spaces, hyphens, apostrophes
 */
export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .refine(
    (val) => /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s\-'.]+$/.test(val.trim()),
    "Name can only contain letters, spaces, hyphens, and apostrophes"
  );

/**
 * Sanitized text field - strips HTML and scripts
 * Use sanitizedTextField(maxLen, minLen?) to create constrained versions
 */
const sanitizeTransform = (val: string) =>
  val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();

export function sanitizedTextField(maxLen: number = 1000, minLen: number = 0) {
  return z
    .string()
    .min(minLen, minLen > 0 ? `Must be at least ${minLen} characters` : undefined)
    .max(maxLen, `Must be less than ${maxLen} characters`)
    .transform(sanitizeTransform);
}

/**
 * Default sanitized text (0-1000 chars)
 */
export const sanitizedTextSchema = sanitizedTextField(1000);

/**
 * Short text field with strict limits
 */
export const shortTextSchema = z
  .string()
  .min(1, "This field is required")
  .max(200, "Text must be less than 200 characters")
  .transform((val) => val.trim());

/**
 * Date string validation (YYYY-MM-DD)
 */
export const dateStringSchema = z
  .string()
  .min(1, "Date is required")
  .refine(
    (val) => /^\d{4}-\d{2}-\d{2}$/.test(val),
    "Date must be in YYYY-MM-DD format"
  )
  .refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Invalid date")
  .refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, "Date cannot be in the past");

/**
 * Time slot validation (HH:MM format)
 */
export const timeSlotSchema = z
  .string()
  .min(1, "Time slot is required")
  .refine(
    (val) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(val),
    "Time slot must be in HH:MM format"
  );

/**
 * Confirmation code validation
 */
export const confirmationCodeSchema = z
  .string()
  .min(1, "Confirmation code is required")
  .refine(
    (val) => /^NBL-[A-HJ-NP-Z2-9]{6}$/.test(val),
    "Invalid confirmation code format"
  );

/**
 * CUID validation (for database IDs)
 */
export const cuidSchema = z
  .string()
  .min(1, "ID is required")
  .refine(
    (val) => /^[a-z0-9]{20,30}$/.test(val),
    "Invalid ID format"
  );

// ─── SQL Injection Pattern Detection ───

const SQL_INJECTION_REGEX = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b)/i,
  /(--\s*$)/m,
  /(\bOR\b\s+\d+\s*=\s*\d+)/i,
  /(\bAND\b\s+\d+\s*=\s*\d+)/i,
  /(\b1\s*=\s*1\b)/i,
  /(\bWAITFOR\b\s+\bDELAY\b)/i,
  /(\bSLEEP\b\s*\()/i,
  /(\bLOAD_FILE\b\s*\()/i,
  /(\bINTO\s+(OUT|DUMP)FILE\b)/i,
];

/**
 * Schema refinement to check for SQL injection patterns
 */
export const noSQLInjection = z.string().refine(
  (val) => !SQL_INJECTION_REGEX.some((regex) => regex.test(val)),
  "Input contains disallowed patterns"
);

// ─── XSS Pattern Detection ───

const XSS_REGEX = [
  /<script\b/i,
  /javascript\s*:/i,
  /on\w+\s*=/i,
  /<iframe\b/i,
  /<object\b/i,
  /<embed\b/i,
  /data\s*:\s*text\/html/i,
  /vbscript\s*:/i,
  /expression\s*\(/i,
];

/**
 * Schema refinement to check for XSS patterns
 */
export const noXSS = z.string().refine(
  (val) => !XSS_REGEX.some((regex) => regex.test(val)),
  "Input contains disallowed content"
);

// ─── Booking Schemas ───

export const createBookingSchema = z.object({
  branchId: cuidSchema,
  branchName: shortTextSchema,
  serviceId: cuidSchema,
  serviceTitle: shortTextSchema,
  serviceCategory: shortTextSchema,
  servicePrice: shortTextSchema,
  serviceDuration: shortTextSchema,
  addOns: z.array(z.object({
    id: z.string().max(50),
    title: z.string().max(200),
    price: z.string().max(50),
  })).max(10, "Maximum 10 add-ons allowed").default([]),
  artistId: cuidSchema.optional().nullable(),
  artistName: shortTextSchema.optional().nullable(),
  date: dateStringSchema,
  timeSlot: timeSlotSchema,
  clientName: nameSchema,
  clientPhone: pakistanPhoneSchema,
  clientEmail: optionalEmailSchema.optional().default(""),
  clientNotes: sanitizedTextField(500).default(""),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const lookupBookingByCodeSchema = z.object({
  code: confirmationCodeSchema,
});

export const lookupBookingByPhoneSchema = z.object({
  phone: pakistanPhoneSchema,
  status: z.enum(["pending", "confirmed", "in-progress", "completed", "cancelled", "no-show"]).optional(),
});

export const cancelBookingSchema = z.object({
  confirmationCode: confirmationCodeSchema.optional(),
  bookingId: cuidSchema.optional(),
  action: z.literal("cancel"),
}).refine(
  (data) => data.confirmationCode || data.bookingId,
  "Provide either a confirmation code or booking ID"
);

export const rescheduleBookingSchema = z.object({
  confirmationCode: confirmationCodeSchema.optional(),
  bookingId: cuidSchema.optional(),
  action: z.literal("reschedule"),
  newDate: dateStringSchema,
  newTimeSlot: timeSlotSchema,
}).refine(
  (data) => data.confirmationCode || data.bookingId,
  "Provide either a confirmation code or booking ID"
);

export const updateBookingSchema = z.discriminatedUnion("action", [
  cancelBookingSchema,
  rescheduleBookingSchema,
  z.object({
    confirmationCode: confirmationCodeSchema.optional(),
    bookingId: cuidSchema.optional(),
    action: z.literal("confirm"),
  }).refine(
    (data) => data.confirmationCode || data.bookingId,
    "Provide either a confirmation code or booking ID"
  ),
]);

export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;

// ─── Contact Form Schema ───

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: pakistanPhoneSchema.optional().default(""),
  subject: shortTextSchema,
  message: sanitizedTextField(2000, 10),
  serviceInterest: z.string().max(100).optional().default(""),
  preferredBranch: z.string().max(100).optional().default(""),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// ─── Admin Operations Schemas ───

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const adminCreateServiceSchema = z.object({
  title: shortTextSchema,
  category: z.enum(["bridal", "hair", "makeup", "skincare", "nails", "spa"]),
  price: shortTextSchema,
  duration: shortTextSchema,
  icon: z.string().max(50).default("sparkles"),
  description: sanitizedTextField(1000).default(""),
  isActive: z.boolean().default(true),
});

export type AdminCreateServiceInput = z.infer<typeof adminCreateServiceSchema>;

export const adminUpdateServiceSchema = adminCreateServiceSchema.partial();

export const adminCreateStaffSchema = z.object({
  name: nameSchema,
  title: shortTextSchema,
  specialties: z.array(z.string().max(100)).max(20).default([]),
  experience: shortTextSchema,
  image: z.string().max(500).default(""),
  rating: z.number().min(0).max(5).default(5.0),
  isActive: z.boolean().default(true),
});

export type AdminCreateStaffInput = z.infer<typeof adminCreateStaffSchema>;

export const adminCreateTestimonialSchema = z.object({
  name: nameSchema,
  role: shortTextSchema,
  quote: sanitizedTextField(500, 10),
  rating: z.number().min(1).max(5).default(5),
  image: z.string().max(500).default(""),
});

export type AdminCreateTestimonialInput = z.infer<typeof adminCreateTestimonialSchema>;

export const adminUpdateBookingStatusSchema = z.object({
  bookingId: cuidSchema,
  status: z.enum(["pending", "confirmed", "in-progress", "completed", "cancelled", "no-show"]),
  paymentStatus: z.enum(["unpaid", "deposit", "paid", "refunded"]).optional(),
});

export type AdminUpdateBookingStatusInput = z.infer<typeof adminUpdateBookingStatusSchema>;

// ─── User Registration Schema ───

export const userRegistrationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: pakistanPhoneSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .refine((val) => /[a-z]/.test(val), "Password must contain a lowercase letter")
    .refine((val) => /[A-Z]/.test(val), "Password must contain an uppercase letter")
    .refine((val) => /\d/.test(val), "Password must contain a number")
    .refine(
      (val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val),
      "Password must contain a special character"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;

// ─── File Upload Validation Schema ───

export const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"] as const;
export const ALLOWED_DOCUMENT_EXTENSIONS = ["pdf"] as const;
export const ALL_ALLOWED_EXTENSIONS = [...ALLOWED_IMAGE_EXTENSIONS, ...ALLOWED_DOCUMENT_EXTENSIONS] as const;

export const fileUploadSchema = z.object({
  name: z
    .string()
    .min(1, "File name is required")
    .max(255, "File name is too long")
    .refine(
      (val) => !val.includes("..") && !val.includes("/") && !val.includes("\\"),
      "Invalid file name"
    )
    .refine(
      (val) => {
        const ext = val.split(".").pop()?.toLowerCase() || "";
        return ALL_ALLOWED_EXTENSIONS.includes(ext as any);
      },
      `File must be one of: ${ALL_ALLOWED_EXTENSIONS.join(", ")}`
    ),
  type: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
  ] as const),
  size: z
    .number()
    .positive("File size must be positive")
    .max(5 * 1024 * 1024, "File size must be less than 5MB"),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;

// ─── Gallery Upload Schema ───

export const galleryUploadSchema = z.object({
  alt: z.string().min(1, "Alt text is required").max(200, "Alt text must be less than 200 characters").transform((val) => val.trim()),
  category: z.enum(["bridal", "hair", "makeup", "skincare", "nails", "spa", "transformation"]),
  file: fileUploadSchema,
});

export type GalleryUploadInput = z.infer<typeof galleryUploadSchema>;

// ─── Utility: Safe Parse with Sanitized Error ───

/**
 * Parse and validate input, returning a safe error response
 * that does not leak internal details
 */
export function safeParse<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue) => {
    const field = issue.path.join(".");
    return field ? `${field}: ${issue.message}` : issue.message;
  });

  return { success: false, errors };
}
