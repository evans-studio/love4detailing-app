// Vehicle Size Enums
export enum VehicleSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  XLARGE = 'XLARGE',
}

// Booking Status Enums
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Payment Status Enums
export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// Payment Method Enums
export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
}

// Loyalty Tier Enums
export enum LoyaltyTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

// Customer Status Enums
export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

// Service Type Enums
export enum ServiceType {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
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