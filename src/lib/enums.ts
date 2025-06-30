// Vehicle Size Enums
export enum VehicleSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  VAN = 'van'
}

// Service Type Enums
export enum ServiceType {
  BASIC_WASH = 'basic-wash',
  FULL_VALET = 'full-valet',
  PREMIUM_DETAIL = 'premium-detail'
}

// Booking Status Enums
export enum BookingStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Payment Status Enums
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

// Payment Method Enums
export enum PaymentMethod {
  CARD = 'card',
  CASH = 'cash',
  STRIPE = 'stripe',
  PAYPAL = 'paypal'
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
  BLOCKED = 'blocked',
}

// Image Type Enums
export enum ImageType {
  VEHICLE = 'vehicle',
  PROFILE = 'profile',
  SERVICE = 'service',
  GALLERY = 'gallery'
}

// User Role Enums
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

// Notification Type Enums
export enum NotificationType {
  BOOKING_CONFIRMED = 'booking-confirmed',
  BOOKING_REMINDER = 'booking-reminder',
  BOOKING_CANCELLED = 'booking-cancelled',
  PAYMENT_RECEIVED = 'payment-received',
  PAYMENT_FAILED = 'payment-failed',
  REWARD_EARNED = 'reward-earned',
  TIER_UPGRADE = 'tier-upgrade'
}

// Notification Channel Enums
export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
}

// Role Type Enums
export enum RoleType {
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

// Discount Type Enums
export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  FREE_SERVICE = 'free_service',
} 