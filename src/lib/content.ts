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
      title: 'Professional Car Detailing Services',
      subtitle: 'Transform your vehicle with our expert detailing services',
    },
  },
  booking: {
    title: 'Book Your Service',
    subtitle: 'Schedule your detailing service in a few simple steps',
    steps: {
      vehicleDetails: {
        title: 'Vehicle Details',
        description: 'Tell us about your vehicle',
        fields: {
          make: 'Vehicle Make',
          model: 'Vehicle Model',
          year: 'Year of Manufacture',
          color: 'Vehicle Color',
          registration: 'Registration Number',
          size: {
            title: 'Vehicle Size',
            description: 'Select your vehicle size',
          },
        },
        errors: {
          make: 'Please enter your vehicle make',
          model: 'Please enter your vehicle model',
          year: 'Please enter a valid year',
          registration: 'Please enter a valid registration number',
          size: 'Please select your vehicle size',
        },
        lookup: {
          button: 'Lookup',
          loading: 'Looking up...',
          error: 'Vehicle lookup failed. Please enter details manually.',
          success: 'Vehicle details found',
        },
      },
      serviceSelection: {
        title: 'Choose Your Service Package',
        description: 'Select the detailing package that best suits your needs',
        addOns: {
          title: 'Add-on Services',
          description: 'Enhance your service with these optional extras',
        },
        details: {
          title: 'Service Details',
          description: 'What\'s included in your selected package',
          duration: 'Duration',
          included: 'What\'s included',
        },
      },
      dateTime: {
        title: 'Select Date & Time',
        description: 'Choose your preferred appointment date and time',
        fields: {
          date: {
            label: 'Select Date',
            helperText: 'You can book up to 30 days in advance',
          },
          time: {
            label: 'Choose Time Slot',
            description: 'Select your preferred appointment time',
          },
        },
        errors: {
          date: 'Please select a valid date',
          time: 'Please select a time slot',
          unavailable: 'This time slot is no longer available',
        },
        messages: {
          selectedDate: 'Selected Date',
          loading: 'Checking availability...',
          unavailable: 'No time slots available for this date',
          chooseAnother: 'Choose Different Date',
        },
        advanceBookingNote: 'Bookings must be made at least 24 hours in advance',
      },
      contactDetails: {
        title: 'Contact Details',
        description: 'Provide your contact information',
        fields: {
          name: {
            label: 'Full Name',
            placeholder: 'e.g. John Smith',
          },
          email: {
            label: 'Email Address',
            placeholder: 'e.g. john@example.com',
          },
          phone: {
            label: 'Phone Number',
            placeholder: 'e.g. 07123 456789',
          },
          postcode: {
            label: 'Postcode',
            placeholder: 'e.g. SW1A 1AA',
          },
          address: {
            label: 'Service Address',
            placeholder: 'Enter your full address',
          },
          notes: {
            label: 'Special Requirements',
            placeholder: 'Any special requests or requirements',
          },
        },
        errors: {
          name: 'Please enter your full name',
          email: 'Please enter a valid email address',
          phone: 'Please enter a valid phone number',
          postcode: 'Please enter a valid postcode',
          address: 'Please enter your service address',
        },
        sections: {
          personal: {
            title: 'Personal Information',
            description: 'Your contact details',
          },
          address: {
            title: 'Service Address',
            description: 'Where should we provide the detailing service?',
          },
          notes: {
            title: 'Special Instructions',
            description: 'Any additional information we should know?',
          },
        },
      },
      confirmation: {
        title: 'Confirm Booking',
        description: 'Review and confirm your booking details',
        sections: {
          vehicle: {
            title: 'Vehicle Details',
            make: 'Make',
            model: 'Model',
            year: 'Year',
            color: 'Color',
            size: 'Size',
          },
          service: {
            title: 'Service Details',
            package: 'Package',
            addOns: 'Add-ons',
            duration: 'Duration',
          },
          appointment: {
            title: 'Appointment',
            date: 'Date',
            time: 'Time',
          },
          contact: {
            title: 'Contact Details',
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
          },
          pricing: {
            title: 'Pricing',
            basePrice: 'Base Price',
            addOns: 'Add-ons',
            subtotal: 'Subtotal',
            discount: 'Discount',
            total: 'Total',
          },
        },
      },
    },
    buttons: {
      previous: 'Previous',
      next: 'Next',
      submit: 'Submit Booking',
      processing: 'Processing...',
      select: 'Select',
    },
  },
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
  name: 'Love 4 Detailing',
  tagline: 'Professional Car Detailing Services',
  description: 'Transform your vehicle with our expert detailing services',
  contact: {
    email: 'info@love4detailing.com',
    phone: '+44 123 456 7890',
    address: '123 Car Street, London, UK',
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