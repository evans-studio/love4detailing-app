// =================================================================
// CONTENT CONFIGURATION - Single source of truth for all UI text
// Following system-guide.md principles for license-ready deployment
// =================================================================

// =================================================================
// TYPE DEFINITIONS - Strongly typed content structure
// =================================================================

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

// =================================================================
// NAVIGATION CONFIGURATION
// =================================================================

export const navigation = {
  main: [] as NavItem[],
  dashboard: [] as NavItem[],
  admin: [] as NavItem[],
  footer: {
    company: [] as NavItem[],
    legal: [] as NavItem[],
    social: [] as NavItem[],
  },
}

// =================================================================
// CONTACT INFORMATION
// =================================================================

export const contact = {
  primary: [] as ContactItem[],
  hours: {
    weekdays: '9:00 AM - 5:00 PM',
    weekends: 'Closed',
  },
  emergency: {
    phone: '999',
    email: 'emergency@love4detailing.com',
  },
}

// =================================================================
// PAGE CONTENT - Hero sections, CTAs, etc.
// =================================================================

export const pages = {
  home: {
    hero: {
      title: 'Professional Car Detailing',
      subtitle: 'Transform your vehicle with our premium valeting services',
      cta: 'Book Now'
    },
  },
  booking: {
    title: 'Book a Service',
    description: 'Complete the form below to book your car detailing service.',
    steps: {
      vehicle: {
        title: 'Vehicle Details',
        description: 'Tell us about your vehicle',
        fields: {
          registration: {
            label: 'Registration Number',
            placeholder: 'e.g. AB12 CDE',
            error: 'Please enter a valid registration'
          },
          size: {
            label: 'Vehicle Size',
            placeholder: 'Select vehicle size',
            error: 'Please select your vehicle size'
          },
          images: {
            label: 'Vehicle Photos',
            description: 'Upload up to 3 photos of your vehicle',
            error: 'Please upload at least one photo'
          }
        }
      },
      service: {
        title: 'Service Selection',
        description: 'Choose your service package and any add-ons',
        fields: {
          service: {
            label: 'Service Package',
            placeholder: 'Select a service',
            error: 'Please select a service'
          },
          addons: {
            label: 'Optional Add-ons',
            description: 'Enhance your service with these extras'
          }
        }
      },
      datetime: {
        title: 'Date & Time',
        description: 'Select your preferred appointment time',
        fields: {
          date: {
            label: 'Preferred Date',
            error: 'Please select a date'
          },
          time: {
            label: 'Preferred Time',
            error: 'Please select a time slot'
          }
        }
      },
      contact: {
        title: 'Contact Details',
        description: 'Enter your contact information',
        fields: {
          fullName: {
            label: 'Full Name',
            placeholder: 'John Doe',
            error: 'Please enter your full name'
          },
          email: {
            label: 'Email Address',
            placeholder: 'john@example.com',
            error: 'Please enter a valid email'
          },
          phone: {
            label: 'Phone Number',
            placeholder: '07123 456789',
            error: 'Please enter a valid phone number'
          },
          postcode: {
            label: 'Postcode',
            placeholder: 'BN1 1AA',
            error: 'Please enter a valid postcode'
          },
          address: {
            label: 'Full Address',
            placeholder: 'Enter your full address',
            error: 'Please enter your address'
          }
        }
      },
      confirmation: {
        title: 'Confirm Booking',
        description: 'Review your booking details',
        sections: {
          vehicle: 'Vehicle Details',
          service: 'Service Details',
          datetime: 'Appointment',
          contact: 'Contact Details',
          pricing: 'Price Breakdown'
        }
      }
    },
    buttons: {
      next: 'Next',
      back: 'Back',
      skip: 'Skip',
    },
  },
  confirmation: {
    title: 'Booking Confirmed',
    description: 'Thank you for booking with Love4Detailing',
    message: 'We have sent you a confirmation email with all the details of your appointment.',
    nextSteps: [
      'We will arrive at your location at the scheduled time',
      'Please ensure your vehicle is accessible',
      'Have your keys ready for handover'
    ]
  },
  dashboard: {
    welcome: 'Welcome back',
    sections: {
      bookings: {
        title: 'My Bookings',
        empty: 'No bookings found',
        statuses: {
          pending: 'Pending',
          confirmed: 'Confirmed',
          completed: 'Completed',
          cancelled: 'Cancelled'
        }
      },
      profile: {
        title: 'My Profile',
        sections: {
          personal: 'Personal Details',
          vehicles: 'My Vehicles',
          preferences: 'Preferences'
        }
      }
    }
  }
}

export const admin = {
  dashboard: {
    title: 'Admin Dashboard',
    subtitle: 'Manage your business operations',
  },
  customers: {
    title: 'Customer Management',
    subtitle: 'View and manage your customer base',
    filters: {
      all: 'All Customers',
      high_value: 'High Value',
      loyal: 'Loyal Customers',
    },
    sort: {
      name: 'Sort by Name',
      spent: 'Sort by Total Spent',
      loyalty: 'Sort by Loyalty Points',
      recent: 'Sort by Recent Activity',
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
    },
    sort: {
      date: 'Sort by Date',
      status: 'Sort by Status',
      value: 'Sort by Value',
    },
  },
  services: {
    title: 'Service Management',
    subtitle: 'Configure your service offerings',
  },
  rewards: {
    title: 'Rewards Management',
    subtitle: 'Configure your loyalty program',
  },
}

export const common = {
  errors: {
    required: 'This field is required',
    invalid: 'Invalid input',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    postcode: 'Please enter a valid postcode',
  },
  buttons: {
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save Changes',
    delete: 'Delete',
    edit: 'Edit',
  },
}

export const auth = {
  signIn: {
    title: 'Sign In',
    subtitle: 'Welcome back! Please sign in to continue.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    submitButton: 'Sign In',
    forgotPassword: 'Forgot Password?',
    noAccount: 'Don\'t have an account?',
    signUp: 'Sign Up',
    errors: {
      invalidCredentials: 'Invalid email or password',
      serverError: 'Something went wrong. Please try again.',
    },
  },
  signUp: {
    title: 'Sign Up',
    subtitle: 'Create your account to get started.',
    nameLabel: 'Full Name',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    confirmPasswordLabel: 'Confirm Password',
    submitButton: 'Sign Up',
    hasAccount: 'Already have an account?',
    signIn: 'Sign In',
    errors: {
      emailInUse: 'This email is already in use',
      passwordMismatch: 'Passwords do not match',
      serverError: 'Something went wrong. Please try again.',
    },
  },
}

export const brand = {
  name: 'Love4Detailing',
  tagline: 'Professional Car Valeting Services',
  description: 'Premium car detailing and valeting services in Brighton & Hove',
  contact: {
    email: 'info@love4detailing.com',
    phone: '01273 123456',
    address: 'Brighton & Hove, UK'
  },
}

export const profile = {
  settings: {
    title: 'Profile Settings',
    subtitle: 'Manage your account preferences',
    tabs: {
      general: 'General',
      notifications: 'Notifications',
      security: 'Security',
    },
    sections: {
      personalInfo: {
        title: 'Personal Information',
        subtitle: 'Update your personal details',
        description: 'Update your personal information and how we can reach you',
        buttons: {
          changePhoto: 'Change Photo',
          save: 'Save Changes',
          cancel: 'Cancel',
        },
        fields: {
          fullName: 'Full Name',
          email: 'Email Address',
          phone: 'Phone Number',
          address: 'Address',
          postcode: 'Postcode',
        },
      },
      vehicles: {
        title: 'My Vehicles',
        subtitle: 'Manage your saved vehicles',
        description: 'Add and manage your vehicles for faster booking',
        buttons: {
          add: 'Add Vehicle',
          edit: 'Edit',
          delete: 'Delete',
        },
      },
      preferences: {
        title: 'Preferences',
        subtitle: 'Customize your experience',
        description: 'Set your preferences for notifications and communications',
        buttons: {
          save: 'Save Changes',
          reset: 'Reset to Default',
        },
      },
      notifications: {
        title: 'Notifications',
        subtitle: 'Manage your notifications',
        description: 'Choose how you want to be notified about your bookings and updates',
        buttons: {
          save: 'Save Preferences',
          enableAll: 'Enable All',
          disableAll: 'Disable All',
        },
      },
      security: {
        title: 'Security',
        subtitle: 'Manage your security settings',
        description: 'Update your password and security preferences',
        buttons: {
          changePassword: 'Change Password',
          enable2FA: 'Enable 2FA',
          disable2FA: 'Disable 2FA',
        },
      },
    },
  },
  vehicles: {
    title: 'My Vehicles',
    subtitle: 'Manage your saved vehicles',
    empty: 'No vehicles added yet',
    add: 'Add Vehicle',
  },
  bookings: {
    title: 'My Bookings',
    subtitle: 'View and manage your appointments',
    empty: 'No bookings found',
  },
  rewards: {
    title: 'My Rewards',
    subtitle: 'View your rewards and points',
    empty: 'No rewards earned yet',
  },
}

export const faq = {
  title: 'Frequently Asked Questions',
  subtitle: 'Find answers to common questions about our services',
  questions: [
    {
      id: 'coverage-area',
      category: 'general',
      question: 'What areas do you cover?',
      answer: 'We currently service all of London, including Richmond, Kingston, Wimbledon, Putney, and surrounding areas. Contact us to confirm coverage for your specific location.',
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
  ],
}

export const services = {
  heading: 'Our Services',
  subheading: 'Professional detailing services for every need',
  cards: [
    {
      id: 'essential',
      title: 'Essential Clean',
      description: 'A thorough interior and exterior clean to bring back the shine.',
      duration: '2-3 hours',
      price: 'From £55',
      features: [
        'Exterior wash & wax',
        'Interior vacuum',
        'Dashboard clean',
        'Window clean',
      ],
    },
    {
      id: 'premium',
      title: 'Premium Detail',
      description: 'A comprehensive detail for a showroom-worthy finish.',
      duration: '3-4 hours',
      price: 'From £95',
      features: [
        'Everything in Essential Clean',
        'Clay bar treatment',
        'Paint sealant',
        'Leather conditioning',
        'Wheel deep clean',
      ],
    },
    {
      id: 'ultimate',
      title: 'Ultimate Protection',
      description: 'The ultimate in paint protection and interior care.',
      duration: '4-6 hours',
      price: 'From £195',
      features: [
        'Everything in Premium Detail',
        'Ceramic coating',
        'Paint correction',
        'Interior sanitization',
        'Engine bay detail',
      ],
      popular: true,
    },
    {
      id: 'maintenance',
      title: 'Maintenance Detail',
      description: 'Regular maintenance to keep your vehicle in top condition.',
      duration: '1-2 hours',
      price: 'From £35',
      features: [
        'Quick exterior wash',
        'Interior vacuum',
        'Tire dressing',
        'Glass cleaning',
      ],
    },
  ],
}

export const content = {
  navigation,
  contact,
  pages,
  admin,
  common,
  auth,
  brand,
  profile,
  faq,
  services,
} as const

export type ContentConfig = typeof content 