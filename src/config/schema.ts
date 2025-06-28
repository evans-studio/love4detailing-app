import { z } from 'zod';

// =================================================================
// Branding & Theme
// =================================================================
export const brandingSchema = z.object({
  appName: z.string(),
  logoUrl: z.string().url(),
  faviconUrl: z.string().url(),
  colors: z.object({
    primary: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i),
    secondary: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i),
    accent: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i),
    background: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i),
    foreground: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i),
  }),
});
export type Branding = z.infer<typeof brandingSchema>;

// =================================================================
// Business Information
// =================================================================
export const contactSchema = z.object({
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  googleMapsUrl: z.string().url(),
});
export type Contact = z.infer<typeof contactSchema>;

export const businessInfoSchema = z.object({
  name: z.string(),
  contact: contactSchema,
  vatNumber: z.string().optional(),
});
export type BusinessInfo = z.infer<typeof businessInfoSchema>;

// =================================================================
// Services & Pricing
// =================================================================

export const vehicleSizeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});
export type VehicleSize = z.infer<typeof vehicleSizeSchema>;

export const priceSchema = z.record(z.string(), z.number().positive());

export const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  prices: priceSchema,
  duration: z.number().positive().describe("Duration in minutes"),
});
export type Service = z.infer<typeof serviceSchema>;

export const addonSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  duration: z.number().positive().describe("Duration in minutes"),
});
export type Addon = z.infer<typeof addonSchema>;

export const pricingConfigSchema = z.object({
  vehicleSizes: z.array(vehicleSizeSchema),
  services: z.array(serviceSchema),
  addons: z.array(addonSchema),
});
export type PricingConfig = z.infer<typeof pricingConfigSchema>;


// =================================================================
// Booking & Operations
// =================================================================
export const operatingHoursSchema = z.object({
  day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
  isOpen: z.boolean(),
  openTime: z.string().optional(), // "HH:MM"
  closeTime: z.string().optional(), // "HH:MM"
});
export type OperatingHours = z.infer<typeof operatingHoursSchema>;

export const bookingSettingsSchema = z.object({
  minLeadTimeHours: z.number().int().positive(),
  maxBookingDaysInAdvance: z.number().int().positive(),
  slotDurationMinutes: z.number().int().positive(),
  operatingHours: z.array(operatingHoursSchema),
  serviceArea: z.object({
    center: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    radiusKm: z.number().positive(),
  }),
  travelFee: z.object({
      baseFee: z.number().nonnegative(),
      perKmMile: z.number().nonnegative(),
      freeRadiusKm: z.number().nonnegative(),
  })
});
export type BookingSettings = z.infer<typeof bookingSettingsSchema>;

// =================================================================
// Website Content
// =================================================================
export const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});
export type FAQItem = z.infer<typeof faqItemSchema>;

export const heroSectionSchema = z.object({
    title: z.string(),
    subtitle: z.string(),
    ctaButtonText: z.string(),
});
export type HeroSection = z.infer<typeof heroSectionSchema>;

export const contentSchema = z.object({
    hero: heroSectionSchema,
    faq: z.array(faqItemSchema),
    // Add other content sections here as needed
});
export type Content = z.infer<typeof contentSchema>;

// =-----------------------------------------------------------------
// Main Client Configuration Schema
// =-----------------------------------------------------------------
export const clientConfigSchema = z.object({
  branding: brandingSchema,
  businessInfo: businessInfoSchema,
  pricing: pricingConfigSchema,
  booking: bookingSettingsSchema,
  content: contentSchema,
});
export type ClientConfig = z.infer<typeof clientConfigSchema>; 