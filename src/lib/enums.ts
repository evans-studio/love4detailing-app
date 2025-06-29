// Vehicle Size Enums
export enum VehicleSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  XLARGE = 'XLARGE',
}

// Booking Status Enums
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Payment Status Enums
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed'
}

// Payment Method Enums
export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  TRANSFER = 'transfer'
}

// Loyalty Tier Enums
export enum LoyaltyTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum'
}

// Customer Status Enums
export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'BLOCKED',
}

// Service Type Enums
export enum ServiceType {
  BASIC = 'basic',
  PREMIUM = 'premium',
  ULTIMATE = 'ultimate',
  LUXURY = 'luxury',
  DELUXE = 'DELUXE',
  CUSTOM = 'CUSTOM',
}

// Notification Type Enums
export enum NotificationType {
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION',
  BOOKING_REMINDER = 'BOOKING_REMINDER',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  REWARD_EARNED = 'REWARD_EARNED',
}

// Notification Channel Enums
export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

// Role Type Enums
export enum RoleType {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}

// Image Type Enums
export enum ImageType {
  VEHICLE = 'VEHICLE',
  PROFILE = 'PROFILE',
  SERVICE = 'SERVICE',
  GALLERY = 'GALLERY',
}

// Discount Type Enums
export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
  FREE_SERVICE = 'FREE_SERVICE',
} 