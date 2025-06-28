import { z } from 'zod';

// =================================================================
// Branding & Business Information
// =================================================================
const brandingSchema = z.object({
  appName: z.string().min(1, "App name cannot be empty."),
  logoUrl: z.string().url("Invalid logo URL."),
  faviconUrl: z.string().url("Invalid favicon URL."),
  colors: z.object({
    primary: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Invalid hex color."),
    secondary: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Invalid hex color."),
    accent: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Invalid hex color."),
    background: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Invalid hex color."),
    foreground: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Invalid hex color."),
  }),
});

const businessInfoSchema = z.object({
  name: z.string().min(1, "Business name cannot be empty."),
  contact: z.object({
    email: z.string().email("Invalid email address."),
    phone: z.string().min(1, "Phone number cannot be empty."),
    address: z.string().min(1, "Address cannot be empty."),
    googleMapsUrl: z.string().url("Invalid Google Maps URL."),
  }),
});

// =================================================================
// Pricing & Services
// =================================================================
const vehicleSizeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
});

const serviceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  features: z.array(z.string()),
  prices: z.record(z.number().positive()),
  duration: z.number().positive(),
});

const addonSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  duration: z.number().positive(),
});

const pricingSchema = z.object({
  vehicleSizes: z.array(vehicleSizeSchema),
  services: z.array(serviceSchema),
  addons: z.array(addonSchema),
});

// =================================================================
// Booking System
// =================================================================
const operatingHoursSchema = z.object({
  day: z.string(),
  isOpen: z.boolean(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
});

const bookingSchema = z.object({
  minLeadTimeHours: z.number().int().min(0),
  maxBookingDaysInAdvance: z.number().int().positive(),
  slotDurationMinutes: z.number().int().positive(),
  operatingHours: z.array(operatingHoursSchema),
  serviceArea: z.object({
    center: z.object({ lat: z.number(), lng: z.number() }),
    radiusKm: z.number().positive(),
  }),
  travelFee: z.object({
    baseFee: z.number().min(0),
    perKmMile: z.number().min(0),
    freeRadiusKm: z.number().min(0),
  }),
});

// =================================================================
// Website Content
// =================================================================
export const heroSectionSchema = z.object({
  title: z.string().min(1, "Hero title cannot be empty."),
  subtitle: z.string().min(1, "Hero subtitle cannot be empty."),
  ctaButtonText: z.string().min(1, "CTA button text cannot be empty."),
});
export type HeroSection = z.infer<typeof heroSectionSchema>;

export const faqItemSchema = z.object({
  question: z.string().min(1, "FAQ question cannot be empty."),
  answer: z.string().min(1, "FAQ answer cannot be empty."),
});
export type FAQItem = z.infer<typeof faqItemSchema>;

const sidebarContentSchema = z.object({
  mainNav: z.array(z.object({
    href: z.string(),
    label: z.string(),
    icon: z.string(),
  })),
  adminNav: z.array(z.object({
    href: z.string(),
    label: z.string(),
    icon: z.string(),
  })),
  contact: z.array(z.object({
    icon: z.string(),
    label: z.string(),
    href: z.string().nullable(),
  })),
});

const contentSchema = z.object({
  hero: heroSectionSchema,
  faq: z.array(faqItemSchema),
  sidebar: sidebarContentSchema,
});

// =================================================================
// Master Schema
// =================================================================
export const clientConfigSchema = z.object({
  branding: brandingSchema,
  businessInfo: businessInfoSchema,
  pricing: pricingSchema,
  booking: bookingSchema,
  content: contentSchema,
});

// Export inferred types for type safety in the application
export type ClientConfig = z.infer<typeof clientConfigSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Addon = z.infer<typeof addonSchema>;
export type VehicleSize = z.infer<typeof vehicleSizeSchema>;
export type Content = z.infer<typeof contentSchema>; 