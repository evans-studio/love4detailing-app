// =================================================================
// CONTENT CONFIGURATION - Single source of truth for all UI text
// Following system-guide.md principles for license-ready deployment
// =================================================================

import { BRAND, SERVICES, ROUTES, BOOKING } from '@/lib/constants'

// =================================================================
// TYPE DEFINITIONS - Strongly typed content structure
// =================================================================

export type NavItem = {
  href: string
  label: string
  icon: string
  external?: boolean
}

export type ContactItem = {
  icon: string
  label: string
  href: string | null
  value: string
}

export type ServiceCard = {
  id: string
  title: string
  description: string
  duration: string
  features: readonly string[]
  popular?: boolean
}

export type TestimonialItem = {
  id: string
  name: string
  location: string
  rating: number
  comment: string
  service: string
  date: string
}

export type FAQItem = {
  id: string
  question: string
  answer: string
  category: 'general' | 'booking' | 'services' | 'pricing'
}

export type FeatureItem = {
  icon: string
  title: string
  description: string
}

// =================================================================
// NAVIGATION CONFIGURATION
// =================================================================

export const navigation = {
  // Main public navigation
  main: [
    { href: ROUTES.home, label: 'Home', icon: 'Home' },
    { href: ROUTES.services, label: 'Services', icon: 'Calendar' },
    { href: ROUTES.booking, label: 'Book Now', icon: 'Calendar' },
    { href: ROUTES.faq, label: 'FAQ', icon: 'HelpCircle' },
  ] as NavItem[],

  // Dashboard navigation for authenticated users
  dashboard: [
    { href: ROUTES.dashboard.root, label: 'Dashboard', icon: 'BarChart3' },
    { href: ROUTES.dashboard.profile, label: 'My Profile', icon: 'User' },
    { href: ROUTES.dashboard.bookings, label: 'My Bookings', icon: 'Calendar' },
    { href: ROUTES.dashboard.rewards, label: 'Rewards', icon: 'Star' },
  ] as NavItem[],

  // Admin navigation
  admin: [
    { href: ROUTES.dashboard.admin.root, label: 'Admin Dashboard', icon: 'Shield' },
    { href: ROUTES.dashboard.admin.customers, label: 'Customers', icon: 'Users' },
    { href: ROUTES.dashboard.admin.bookings, label: 'All Bookings', icon: 'Calendar' },
    { href: ROUTES.dashboard.admin.analytics, label: 'Analytics', icon: 'BarChart3' },
  ] as NavItem[],

  // Footer navigation
  footer: {
    company: [
      { href: '/about', label: 'About Us', icon: 'Info' },
      { href: ROUTES.services, label: 'Services', icon: 'Calendar' },
      { href: '/gallery', label: 'Gallery', icon: 'Image' },
      { href: '/contact', label: 'Contact', icon: 'Phone' },
    ] as NavItem[],
    legal: [
      { href: ROUTES.legal.privacy, label: 'Privacy Policy', icon: 'Shield' },
      { href: ROUTES.legal.terms, label: 'Terms of Service', icon: 'FileText' },
      { href: ROUTES.legal.refund, label: 'Refund Policy', icon: 'RotateCcw' },
    ] as NavItem[],
    social: [
      { href: 'https://facebook.com/love4detailing', label: 'Facebook', icon: 'Facebook', external: true },
      { href: 'https://instagram.com/love4detailing', label: 'Instagram', icon: 'Instagram', external: true },
      { href: 'https://twitter.com/love4detailing', label: 'Twitter', icon: 'Twitter', external: true },
    ] as NavItem[],
  },
}

// =================================================================
// CONTACT INFORMATION
// =================================================================

export const contact = {
  primary: [
    {
      icon: 'Phone',
      label: 'Call Us',
      value: BRAND.contact.phone,
      href: `tel:${BRAND.contact.phone.replace(/\s/g, '')}`,
    },
    {
      icon: 'Mail',
      label: 'Email Us',
      value: BRAND.contact.email,
      href: `mailto:${BRAND.contact.email}`,
    },
    {
      icon: 'MapPin',
      label: 'Service Area',
      value: BRAND.contact.coverage,
      href: null,
    },
  ] as ContactItem[],

  hours: {
    title: 'Service Hours',
    schedule: [
      { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 5:00 PM' },
      { day: 'Sunday', hours: '10:00 AM - 4:00 PM' },
    ],
  },

  emergency: {
    available: true,
    note: 'Emergency services available for urgent needs',
    surcharge: '£20 call-out fee applies',
  },
}

// =================================================================
// PAGE CONTENT - Hero sections, CTAs, etc.
// =================================================================

export const pages = {
  home: {
    hero: {
      title: BRAND.tagline,
      subtitle: `Professional car detailing services across ${BRAND.contact.coverage}. Book your detail today and drive clean tomorrow.`,
      ctaButton: 'Book Your Detail',
      ctaSecondary: 'View Services',
      backgroundImage: '/assets/hero-bg.jpg',
    },

    features: {
      heading: 'Why Choose Us',
      subheading: 'Experience the difference of professional detailing',
      items: [
        {
          icon: 'Sparkles',
          title: 'Professional Equipment',
          description: 'Using only the finest tools and premium products for exceptional results.',
        },
        {
          icon: 'Clock',
          title: 'Flexible Scheduling',
          description: 'Easy online booking with time slots that work around your schedule.',
        },
        {
          icon: 'MapPin',
          title: 'Mobile Service',
          description: `We come to you anywhere in ${BRAND.contact.coverage} with our fully equipped mobile unit.`,
        },
        {
          icon: 'Shield',
          title: 'Fully Insured',
          description: 'Complete peace of mind with comprehensive insurance coverage.',
        },
        {
          icon: 'Star',
          title: 'Satisfaction Guaranteed',
          description: 'Not happy with the results? We\'ll make it right or refund your money.',
        },
        {
          icon: 'Users',
          title: 'Trusted by 1000+ Customers',
          description: 'Join our growing community of satisfied customers across London.',
        },
      ] as FeatureItem[],
    },

  cta: {
      heading: 'Ready to Transform Your Vehicle?',
      subheading: 'Book your appointment today and experience the Love4Detailing difference',
      button: 'Book Now',
      secondaryButton: 'Get Quote',
      footerNote: `Serving ${BRAND.contact.coverage} • Fully Insured • Satisfaction Guaranteed`,
    },
  },

  services: {
    hero: {
      title: 'Our Services',
      subtitle: 'Choose from our range of professional detailing packages',
    },

    packages: Object.values(SERVICES.packages).map(pkg => ({
      id: pkg.id,
      title: pkg.name,
      description: pkg.description,
      duration: pkg.duration,
      features: pkg.features,
      popular: pkg.id === 'premium', // Mark premium as popular
    })) as ServiceCard[],

    addOns: {
      heading: 'Enhance Your Service',
      subheading: 'Add these extras to your booking for the ultimate experience',
      items: Object.values(SERVICES.addOns),
    },
  },

  booking: {
    steps: {
      vehicleDetails: {
        title: 'Vehicle Information',
        description: 'Tell us about your vehicle to ensure we bring the right equipment',
        fields: {
          registration: 'Vehicle Registration (Optional)',
          make: 'Make',
          model: 'Model',
          year: 'Year',
          color: 'Color',
          size: 'Vehicle Size',
        },
      },
      serviceSelection: {
        title: 'Choose Your Service',
        description: 'Select the detailing package that suits your needs',
        addOnsTitle: 'Add Extra Services',
        addOnsDescription: 'Enhance your service with these popular add-ons',
      },
      dateTime: {
        title: 'Pick Date & Time',
        description: 'Choose your preferred appointment slot',
        unavailableMessage: 'This time slot is not available',
                 advanceBookingNote: `Bookings can be made up to ${BOOKING.constraints.advanceBookingDays} days in advance`,
      },
      contactDetails: {
        title: 'Contact Information',
        description: 'How can we reach you?',
        fields: {
          fullName: 'Full Name',
          email: 'Email Address',
          phone: 'Phone Number',
          address: 'Service Address',
          postcode: 'Postcode',
        },
      },
      confirmation: {
        title: 'Confirm Your Booking',
        description: 'Please review your booking details',
        termsText: 'By confirming this booking, you agree to our Terms of Service and Privacy Policy',
        cancellationPolicy: `Free cancellation up to 24 hours before your appointment`,
      },
    },

    buttons: {
      next: 'Continue',
      previous: 'Back',
      submit: 'Confirm Booking',
      calculating: 'Calculating...',
      processing: 'Processing...',
    },

    messages: {
      success: 'Booking confirmed! Check your email for details.',
      error: 'Something went wrong. Please try again.',
      validation: 'Please correct the errors above.',
    },
  },

  dashboard: {
    welcome: {
      title: 'Welcome back',
      subtitle: 'Manage your bookings and profile',
    },

    profile: {
      title: 'My Profile',
      subtitle: 'Manage your personal information and preferences',
      sections: {
        personalInfo: {
          title: 'Personal Information',
          description: 'Keep your contact details up to date',
        },
        vehicles: {
          title: 'My Vehicles',
          description: 'Manage your saved vehicles for faster booking',
          addVehicle: 'Add Vehicle',
          noVehicles: 'No vehicles saved yet',
        },
        preferences: {
          title: 'Preferences',
          description: 'Customize your booking experience',
        },
      },
    },

    bookings: {
      title: 'My Bookings',
      subtitle: 'View and manage your appointments',
      filters: {
        all: 'All Bookings',
        upcoming: 'Upcoming',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
      actions: {
        reschedule: 'Reschedule',
        cancel: 'Cancel',
        review: 'Leave Review',
        rebook: 'Book Again',
      },
      empty: {
        title: 'No bookings found',
        subtitle: 'Ready to book your first detail?',
        cta: 'Book Now',
      },
    },

    rewards: {
      title: 'Loyalty Rewards',
      subtitle: 'Earn points with every booking and unlock exclusive benefits',
      pointsLabel: 'Available Points',
      tierLabel: 'Current Tier',
      nextTierLabel: 'Next Tier',
      history: {
        title: 'Points History',
        empty: 'No points history yet',
      },
      redemption: {
        title: 'Redeem Points',
        empty: 'No rewards available',
      },
    },
  },

  admin: {
    dashboard: {
      title: 'Admin Dashboard',
      subtitle: 'Manage bookings, customers, and business analytics',
    },

    customers: {
      title: 'Customer Management',
      subtitle: 'View and manage your customer base',
      filters: {
        all: 'All Customers',
        highValue: 'High Value',
        loyal: 'Loyal Customers',
        recent: 'Recent Customers',
      },
      sort: {
        name: 'Name',
        totalSpent: 'Total Spent',
        loyaltyPoints: 'Loyalty Points',
        lastBooking: 'Last Booking',
      },
      actions: {
        viewProfile: 'View Profile',
        newBooking: 'New Booking',
        sendEmail: 'Send Email',
      },
    },

    bookings: {
      title: 'Booking Management',
      subtitle: 'Manage all customer bookings',
      filters: {
        all: 'All Bookings',
        today: 'Today',
        week: 'This Week',
        month: 'This Month',
        pending: 'Pending',
        confirmed: 'Confirmed',
      },
      actions: {
        confirm: 'Confirm',
        reschedule: 'Reschedule',
        cancel: 'Cancel',
        complete: 'Mark Complete',
      },
    },
  },
}

// =================================================================
// FREQUENTLY ASKED QUESTIONS
// =================================================================

export const faq: FAQItem[] = [
  {
    id: 'coverage-area',
    category: 'general',
    question: 'What areas do you cover?',
    answer: `We currently service all of ${BRAND.contact.coverage}, including Richmond, Kingston, Wimbledon, Putney, and surrounding areas. Contact us to confirm coverage for your specific location.`,
  },
  {
    id: 'service-duration',
    category: 'services',
    question: 'How long does a detail take?',
    answer: 'Service times vary by package: Essential Clean (2-3 hours), Premium Detail (3-4 hours), Ultimate Protection (4-6 hours). We\'ll provide a specific time estimate when you book.',
  },
  {
    id: 'mobile-service',
    category: 'general',
    question: 'Do you provide mobile service?',
    answer: 'Yes! We come to your location with all necessary equipment and water supply. Just ensure there\'s safe parking and space for us to work around your vehicle.',
  },
  {
    id: 'payment-methods',
    category: 'general',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, Apple Pay, Google Pay, and bank transfers. Payment is processed securely through our booking system.',
  },
  {
    id: 'whats-included',
    category: 'services',
    question: 'What\'s included in your basic service?',
    answer: 'Our Essential Clean includes exterior wash, wheel cleaning, tire dressing, interior vacuum, dashboard/console cleaning, and window cleaning inside and out.',
  },
  {
    id: 'weather-policy',
    category: 'booking',
    question: 'What happens if it rains?',
    answer: 'Light rain won\'t stop us, but we may need to reschedule for heavy rain or severe weather. We\'ll contact you in advance if weather conditions aren\'t suitable.',
  },
  {
    id: 'cancellation-policy',
    category: 'booking',
    question: 'Can I cancel or reschedule my booking?',
    answer: 'Yes, you can cancel or reschedule up to 24 hours before your appointment for a full refund. Changes within 24 hours may incur a fee.',
  },
  {
    id: 'pricing',
    category: 'pricing',
    question: 'How is pricing determined?',
    answer: 'Pricing is based on your vehicle size and chosen service package. Additional services and travel fees (if applicable) will be clearly shown during booking.',
  },
  {
    id: 'satisfaction-guarantee',
    category: 'services',
    question: 'Do you guarantee your work?',
    answer: 'Absolutely! We\'re committed to your satisfaction. If you\'re not happy with the results, we\'ll return to make it right or provide a full refund.',
  },
  {
    id: 'loyalty-program',
    category: 'general',
    question: 'Do you have a loyalty program?',
    answer: 'Yes! Earn points with every booking, review, and referral. Points can be redeemed for discounts on future services. Higher tiers unlock exclusive benefits.',
  },
]

// =================================================================
// TESTIMONIALS & REVIEWS
// =================================================================

export const testimonials: TestimonialItem[] = [
  {
    id: 'sarah-richmond',
    name: 'Sarah Johnson',
    location: 'Richmond',
    rating: 5,
    service: 'Premium Detail',
    date: '2024-11-15',
    comment: 'Absolutely fantastic service! My car looks better than when I first bought it. The team was professional, punctual, and incredibly thorough. Will definitely be booking again.',
  },
  {
    id: 'mike-kingston',
    name: 'Michael Chen',
    location: 'Kingston',
    rating: 5,
    service: 'Ultimate Protection',
    date: '2024-11-10',
    comment: 'The ceramic coating service was exceptional. Three months later and my car still beads water like magic. Worth every penny for the protection and ease of maintenance.',
  },
  {
    id: 'emma-wimbledon',
    name: 'Emma Williams',
    location: 'Wimbledon',
    rating: 5,
    service: 'Essential Clean',
    date: '2024-11-08',
    comment: 'Great value for money and very convenient. They came to my office and had my car spotless by the time I finished work. Professional and friendly service.',
  },
  {
    id: 'james-putney',
    name: 'James Mitchell',
    location: 'Putney',
    rating: 5,
    service: 'Premium Detail',
    date: '2024-11-05',
    comment: 'I\'ve been using Love4Detailing for over a year now. Consistently excellent service, great value, and the loyalty points are a nice bonus. Highly recommended!',
  },
]

// =================================================================
// LEGAL CONTENT
// =================================================================

export const legal = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: '2024-11-01',
    sections: [
      {
        title: 'Information We Collect',
        content: 'We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support.',
      },
      {
        title: 'How We Use Your Information',
        content: 'We use the information we collect to provide, maintain, and improve our services, process bookings, and communicate with you.',
      },
      {
        title: 'Information Sharing',
        content: 'We do not sell, trade, or rent your personal information to third parties without your consent, except as described in this policy.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: '2024-11-01',
    sections: [
      {
        title: 'Service Agreement',
        content: 'By booking our services, you agree to these terms and conditions. Services are provided subject to availability and weather conditions.',
      },
      {
        title: 'Payment Terms',
        content: 'Payment is due at the time of booking. We accept major credit cards and digital payments. Refunds are available according to our cancellation policy.',
      },
    ],
  },
  refund: {
    title: 'Refund Policy',
    lastUpdated: '2024-11-01',
    policy: 'Full refund available for cancellations made 24+ hours in advance. Satisfaction guarantee - if you\'re not happy, we\'ll make it right or refund your money.',
  },
}

// =================================================================
// ERROR MESSAGES & NOTIFICATIONS
// =================================================================

export const messages = {
  success: {
    bookingConfirmed: 'Booking confirmed! Check your email for details.',
    profileUpdated: 'Profile updated successfully.',
    passwordChanged: 'Password changed successfully.',
    vehicleAdded: 'Vehicle added to your profile.',
    reviewSubmitted: 'Thank you for your review!',
  },
  error: {
    general: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    unauthorized: 'Please sign in to access this page.',
    notFound: 'The page you\'re looking for doesn\'t exist.',
    validation: 'Please correct the errors above.',
    booking: {
      unavailable: 'This time slot is no longer available.',
      pastDate: 'Please select a future date.',
      tooFarInAdvance: 'Bookings can only be made 30 days in advance.',
    },
  },
  loading: {
    bookings: 'Loading your bookings...',
    profile: 'Loading profile...',
    availability: 'Checking availability...',
  },
}

// =================================================================
// EXPORT CONFIGURATION
// =================================================================

export const content = {
  navigation,
  contact,
  pages,
  faq,
  testimonials,
  legal,
  messages,
  brand: BRAND,
} as const

export type ContentConfig = typeof content 