import { 
  VehicleSize, 
  BookingStatus, 
  PaymentStatus, 
  PaymentMethod,
  LoyaltyTier,
  CustomerStatus,
  ServiceType,
  NotificationType,
  NotificationChannel,
  RoleType,
  ImageType,
  DiscountType,
} from './enums'

export const BRAND = {
  name: 'Love4Detailing',
  description: 'Professional Car Detailing Services',
  tagline: 'Restoring the Shine, One Street at a Time.',
  
  // Colors from system-guide.md
  colors: {
    // Primary colors
    primary: '#9747FF',
    black: '#141414', 
    offWhite: '#F8F4EB',
    
    // Secondary colors
    supportAccent: '#DAD7CE',
    surfaceLight: '#262626',
    textMuted: '#C7C7C7',
    
    // State colors
    error: '#BA0C2F',
    success: '#28C76F',
    warning: '#FFA726',
    info: '#29B6F6',
    
    // Purple variations
    purple: {
      50: 'rgba(151, 71, 255, 0.05)',
      100: 'rgba(151, 71, 255, 0.1)',
      200: 'rgba(151, 71, 255, 0.2)',
      300: 'rgba(151, 71, 255, 0.3)',
      400: 'rgba(151, 71, 255, 0.4)',
      500: '#9747FF',
      600: '#8532FF',
      700: '#721DFF',
      800: '#5F08FF',
      900: '#4C00F2',
    },
  },
  
  // Contact information - client editable
  contact: {
    phone: '07908 625 581',
    email: 'zell@love4detailing.com',
    location: 'SW London',
    coverage: 'South West London',
  },
} as const

export const SERVICES = {
  packages: {
    'essential-clean': {
      id: 'essential-clean',
      name: 'Essential Clean',
      description: 'Perfect for regular maintenance',
      duration: '2-3 hours',
      features: [
        'Exterior wash & dry',
        'Interior vacuum', 
        'Window cleaning',
        'Tyre shine',
        'Dashboard cleaning',
      ],
    },
    'premium-detail': {
      id: 'premium-detail',
      name: 'Premium Detail',
      description: 'Enhanced detailing with protection',
      duration: '3-4 hours',
      features: [
        'Everything in Essential',
        'Paint decontamination',
        'Interior deep clean',
        'Leather conditioning',
        'Paint protection',
      ],
    },
    'ultimate-protection': {
      id: 'ultimate-protection', 
      name: 'Ultimate Protection',
      description: 'Complete detailing with ceramic coating',
      duration: '4-6 hours',
      features: [
        'Everything in Premium',
        'Ceramic coating application',
        'Engine bay cleaning',
        'Headlight restoration',
        '6-month protection warranty',
      ],
    },
  },
  
  vehicleSizes: {
    small: {
      id: 'small',
      label: 'Small Vehicle',
      description: 'Fiesta, Polo, Mini',
      examples: ['Ford Fiesta', 'Volkswagen Polo', 'Mini Cooper'],
      pricing: {
        'essential-clean': 55,
        'premium-detail': 75,
        'ultimate-protection': 95,
      },
    },
    medium: {
      id: 'medium',
      label: 'Medium Vehicle', 
      description: 'Focus, Golf, Civic',
      examples: ['Ford Focus', 'Volkswagen Golf', 'Honda Civic'],
      pricing: {
        'essential-clean': 60,
        'premium-detail': 80,
        'ultimate-protection': 100,
      },
    },
    large: {
      id: 'large',
      label: 'Large Vehicle',
      description: 'BMW 5 Series, SUV, Estate',
      examples: ['BMW 5 Series', 'Audi A6', 'Mercedes E-Class'],
      pricing: {
        'essential-clean': 65,
        'premium-detail': 85,
        'ultimate-protection': 105,
      },
    },
    extraLarge: {
      id: 'extraLarge',
      label: 'Extra Large Vehicle',
      description: 'Van, Range Rover, 7-Seater',
      examples: ['Range Rover', 'Mercedes Sprinter', 'Ford Transit'],
      pricing: {
        'essential-clean': 70,
        'premium-detail': 90,
        'ultimate-protection': 110,
      },
    },
  },
  
  addOns: {
    interiorProtection: {
      id: 'interiorProtection',
      name: 'Interior Protection',
      description: 'Fabric & leather protection treatment',
      price: 25,
    },
    engineClean: {
      id: 'engineClean', 
      name: 'Engine Bay Clean',
      description: 'Complete engine bay detailing',
      price: 30,
    },
    headlightRestoration: {
      id: 'headlightRestoration',
      name: 'Headlight Restoration',
      description: 'Restore cloudy headlights',
      price: 35,
    },
  },
} as const

export const BOOKING = {
  timeSlots: ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'] as const,
  constraints: {
    maxPhotos: 5,
    maxBookingsPerDay: 8,
    advanceBookingDays: 30,
    cancellationHours: 24,
  },
  statuses: {
    PENDING: BookingStatus.PENDING,
    CONFIRMED: BookingStatus.CONFIRMED,
    COMPLETED: BookingStatus.COMPLETED,
    CANCELLED: BookingStatus.CANCELLED,
  },
  payment: {
    PENDING: PaymentStatus.PENDING,
    PAID: PaymentStatus.PAID,
    FAILED: PaymentStatus.FAILED,
  },
  workingHours: {
    monday: {
      start: '09:00',
      end: '17:00',
      interval: 90, // minutes
    },
    tuesday: {
      start: '09:00',
      end: '17:00',
      interval: 90,
    },
    wednesday: {
      start: '09:00',
      end: '17:00',
      interval: 90,
    },
    thursday: {
      start: '09:00',
      end: '17:00',
      interval: 90,
    },
    friday: {
      start: '09:00',
      end: '17:00',
      interval: 90,
    },
    saturday: {
      start: '10:00',
      end: '16:00',
      interval: 90,
    },
    sunday: null, // Closed
  },
} as const

export const EMAIL = {
  // Email provider configuration
  provider: {
    type: 'resend' as const,
    fromName: BRAND.name,
    fromEmail: 'zell@love4detailing.com',
    replyTo: BRAND.contact.email,
  },
  
  // Email templates
  templates: {
    bookingConfirmation: {
      subject: 'Booking Confirmation - Love4Detailing',
      heading: 'Booking Confirmed',
      subheading: 'Your car detailing service is scheduled',
    },
    bookingReminder: {
      subject: 'Reminder: Your Car Detailing Service Tomorrow',
      heading: 'Service Reminder',
      subheading: 'Your appointment is coming up',
    },
    adminAlert: {
      subject: 'New Booking Alert',
      heading: 'New Booking Received',
      subheading: 'A new booking requires your attention',
    },
    loyaltyRedemption: {
      subject: 'Reward Points Redeemed',
      heading: 'Points Redeemed',
      subheading: 'Your loyalty reward has been applied',
    },
  },
  
  // Reminder settings
  reminders: {
    enabled: true,
    schedule: {
      '24h': true,
      '1h': true,
    },
  },
  
  // Admin notifications
  adminNotifications: {
    enabled: true,
    recipients: [BRAND.contact.email],
  },
  
  // Footer content
  footer: {
    address: '123 Detailing Street, London SW1 1AA',
    contact: {
      phone: BRAND.contact.phone,
      email: BRAND.contact.email,
    },
    legal: {
      privacyUrl: '/privacy',
      termsUrl: '/terms',
      unsubscribeUrl: '/unsubscribe',
    },
  },
} as const

export const REWARDS = {
  pointsEarning: {
    booking: 100,
    review: 50,
    referral: 200,
    socialShare: 25,
    firstBooking: 150,
  },
  tiers: {
    bronze: {
      id: 'bronze',
      name: 'Bronze',
      threshold: 0,
      benefits: ['Point earning', 'Birthday discount'],
      discountPercentage: 0,
    },
    silver: {
      id: 'silver', 
      name: 'Silver',
      threshold: 500,
      benefits: ['5% discount', 'Priority booking', 'Exclusive offers'],
      discountPercentage: 5,
    },
    gold: {
      id: 'gold',
      name: 'Gold', 
      threshold: 1000,
      benefits: ['10% discount', 'Free add-ons', 'Personal detailer'],
      discountPercentage: 10,
    },
    platinum: {
      id: 'platinum',
      name: 'Platinum',
      threshold: 2000, 
      benefits: ['15% discount', 'VIP treatment', 'Annual free detail'],
      discountPercentage: 15,
    },
  },
  redemptions: {
    discount10: { points: 200, value: 10, type: 'discount' },
    discount20: { points: 400, value: 20, type: 'discount' },
    freeAddOn: { points: 300, value: 30, type: 'service' },
    freeDetail: { points: 1000, value: 60, type: 'service' },
  },
}

export const ROUTES = {
  // Public routes
  home: '/',
  services: '/services',
  booking: '/booking',
  faq: '/faq',
  
  // Auth routes
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  
  // Dashboard routes
  dashboard: {
    root: '/dashboard',
    profile: '/dashboard/profile',
    bookings: '/dashboard/bookings',
    rewards: '/dashboard/rewards',
    settings: '/dashboard/settings',
    
    // Admin routes
    admin: {
      root: '/dashboard/admin',
      customers: '/dashboard/admin/customers',
      bookings: '/dashboard/admin/bookings',
      analytics: '/dashboard/admin/analytics',
      settings: '/dashboard/admin/settings',
    },
  },
  
  // Legal pages
  legal: {
    privacy: '/privacy',
    terms: '/terms',
    refund: '/refund',
  },
} as const

export const API = {
  endpoints: {
    // User endpoints
    auth: '/api/auth',
    profile: '/api/profile',
    
    // Booking endpoints  
    bookings: '/api/bookings',
    availability: '/api/availability',
    
    // Rewards endpoints
    rewards: '/api/rewards',
    
    // Gallery endpoints
    gallery: '/api/gallery',
    upload: '/api/upload',
    
    // Admin endpoints
    admin: {
      customers: '/api/admin/customers',
      bookings: '/api/admin/bookings',
      analytics: '/api/admin/analytics',
    },
  },
  
  // HTTP methods
  methods: {
    GET: 'GET',
    POST: 'POST', 
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
  } as const,
} as const

export const ANALYTICS = {
  revenue: {
    day: 1200,
    week: 8500,
    month: 35000,
    year: 420000,
  },
  revenueGrowth: {
    day: 5,
    week: 8,
    month: 12,
    year: 15,
  },
  bookings: {
    day: 8,
    week: 56,
    month: 240,
    year: 2880,
  },
  bookingsGrowth: {
    day: 4,
    week: 6,
    month: 10,
    year: 14,
  },
  averageOrderValue: {
    day: 150,
    week: 152,
    month: 146,
    year: 145,
  },
  aovGrowth: {
    day: 2,
    week: 3,
    month: 5,
    year: 7,
  },
  satisfaction: {
    day: 98,
    week: 97,
    month: 96,
    year: 95,
  },
  reviews: {
    day: 6,
    week: 42,
    month: 180,
    year: 2160,
  },
  services: {
    day: {
      'Essential Clean': { bookings: 4, revenue: 600, growth: 5 },
      'Premium Detail': { bookings: 3, revenue: 450, growth: 8 },
      'Ultimate Protection': { bookings: 1, revenue: 150, growth: 3 },
    },
    week: {
      'Essential Clean': { bookings: 28, revenue: 4200, growth: 7 },
      'Premium Detail': { bookings: 21, revenue: 3150, growth: 10 },
      'Ultimate Protection': { bookings: 7, revenue: 1050, growth: 5 },
    },
    month: {
      'Essential Clean': { bookings: 120, revenue: 18000, growth: 12 },
      'Premium Detail': { bookings: 90, revenue: 13500, growth: 15 },
      'Ultimate Protection': { bookings: 30, revenue: 4500, growth: 8 },
    },
    year: {
      'Essential Clean': { bookings: 1440, revenue: 216000, growth: 16 },
      'Premium Detail': { bookings: 1080, revenue: 162000, growth: 18 },
      'Ultimate Protection': { bookings: 360, revenue: 54000, growth: 12 },
    },
  },
  retention: {
    day: {
      repeatRate: 60,
      repeatCount: 5,
      averageVisits: 2.5,
      churnRate: 5,
    },
    week: {
      repeatRate: 65,
      repeatCount: 36,
      averageVisits: 2.8,
      churnRate: 4,
    },
    month: {
      repeatRate: 70,
      repeatCount: 168,
      averageVisits: 3.2,
      churnRate: 3,
    },
    year: {
      repeatRate: 75,
      repeatCount: 2160,
      averageVisits: 3.5,
      churnRate: 2,
    },
  },
  rewards: {
    day: {
      pointsEarned: 800,
      pointsRedeemed: 400,
      activeMembers: 6,
      redemptionValue: 40,
    },
    week: {
      pointsEarned: 5600,
      pointsRedeemed: 2800,
      activeMembers: 42,
      redemptionValue: 280,
    },
    month: {
      pointsEarned: 24000,
      pointsRedeemed: 12000,
      activeMembers: 180,
      redemptionValue: 1200,
    },
    year: {
      pointsEarned: 288000,
      pointsRedeemed: 144000,
      activeMembers: 2160,
      redemptionValue: 14400,
    },
  },
} as const 

export const LABELS = {
  vehicleSize: {
    [VehicleSize.SMALL]: 'Small Vehicle',
    [VehicleSize.MEDIUM]: 'Medium Vehicle',
    [VehicleSize.LARGE]: 'Large Vehicle',
    [VehicleSize.XLARGE]: 'Extra Large Vehicle',
  },
  bookingStatus: {
    [BookingStatus.PENDING]: { label: 'Pending', color: 'warning' },
    [BookingStatus.CONFIRMED]: { label: 'Confirmed', color: 'info' },
    [BookingStatus.IN_PROGRESS]: { label: 'In Progress', color: 'primary' },
    [BookingStatus.COMPLETED]: { label: 'Completed', color: 'success' },
    [BookingStatus.CANCELLED]: { label: 'Cancelled', color: 'error' },
  },
  paymentStatus: {
    [PaymentStatus.PENDING]: { label: 'Pending', color: 'info' },
    [PaymentStatus.PAID]: { label: 'Paid', color: 'success' },
    [PaymentStatus.REFUNDED]: { label: 'Refunded', color: 'info' },
    [PaymentStatus.FAILED]: { label: 'Failed', color: 'error' },
  },
  paymentMethod: {
    [PaymentMethod.CASH]: {
      label: 'Cash Payment',
      description: 'Pay in cash on the day of service',
      icon: 'cash',
    },
    [PaymentMethod.CARD]: {
      label: 'Card Payment',
      description: 'Pay securely with your credit or debit card',
      icon: 'card',
    },
    [PaymentMethod.STRIPE]: {
      label: 'Online Payment',
      description: 'Secure online payment via Stripe',
      icon: 'stripe',
    },
    [PaymentMethod.PAYPAL]: {
      label: 'PayPal',
      description: 'Pay securely with PayPal',
      icon: 'paypal',
    },
  },
  loyaltyTier: {
    [LoyaltyTier.BRONZE]: {
      label: 'Bronze',
      color: '#CD7F32',
      minPoints: 0,
      discount: 0,
    },
    [LoyaltyTier.SILVER]: {
      label: 'Silver',
      color: '#C0C0C0',
      minPoints: 100,
      discount: 5,
    },
    [LoyaltyTier.GOLD]: {
      label: 'Gold',
      color: '#FFD700',
      minPoints: 500,
      discount: 10,
    },
    [LoyaltyTier.PLATINUM]: {
      label: 'Platinum',
      color: '#E5E4E2',
      minPoints: 1000,
      discount: 15,
    },
  },
  customerStatus: {
    [CustomerStatus.ACTIVE]: { label: 'Active', color: 'success' },
    [CustomerStatus.INACTIVE]: { label: 'Inactive', color: 'warning' },
    [CustomerStatus.BLOCKED]: { label: 'Blocked', color: 'error' },
  },
  serviceType: {
    [ServiceType.BASIC]: {
      label: 'Basic Detail',
      description: 'Essential cleaning service',
      duration: 90,
    },
    [ServiceType.PREMIUM]: {
      label: 'Premium Detail',
      description: 'Comprehensive cleaning and protection',
      duration: 180,
    },
    [ServiceType.DELUXE]: {
      label: 'Deluxe Detail',
      description: 'Ultimate detailing experience',
      duration: 240,
    },
    [ServiceType.CUSTOM]: {
      label: 'Custom Service',
      description: 'Tailored to your needs',
      duration: 120,
    },
  },
  notificationType: {
    [NotificationType.BOOKING_CONFIRMATION]: 'Booking Confirmed',
    [NotificationType.BOOKING_REMINDER]: 'Booking Reminder',
    [NotificationType.BOOKING_CANCELLED]: 'Booking Cancelled',
    [NotificationType.PAYMENT_RECEIVED]: 'Payment Received',
    [NotificationType.REWARD_EARNED]: 'Reward Points Earned',
  },
  notificationChannel: {
    [NotificationChannel.EMAIL]: 'Email',
    [NotificationChannel.SMS]: 'SMS',
    [NotificationChannel.PUSH]: 'Push Notification',
    [NotificationChannel.IN_APP]: 'In-App Notification',
  },
  roleType: {
    [RoleType.ADMIN]: 'Administrator',
    [RoleType.STAFF]: 'Staff Member',
    [RoleType.CUSTOMER]: 'Customer',
  },
  imageType: {
    [ImageType.VEHICLE]: 'Vehicle Photo',
    [ImageType.PROFILE]: 'Profile Picture',
    [ImageType.SERVICE]: 'Service Image',
    [ImageType.GALLERY]: 'Gallery Image',
  },
  discountType: {
    [DiscountType.PERCENTAGE]: 'Percentage Off',
    [DiscountType.FIXED]: 'Fixed Amount Off',
    [DiscountType.FREE_SERVICE]: 'Free Service',
  },
} as const 