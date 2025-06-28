// Content type definitions
type HeroContent = {
  title: string;
  subtitle: string;
  ctaButton: string;
};

type ServiceCard = {
  title: string;
  description: string;
  price?: string;
  features?: string[];
};

type ServicesContent = {
  heading: string;
  subheading: string;
  cards: ServiceCard[];
};

type CTAContent = {
  heading: string;
  subheading: string;
  button: string;
  footerNote: string;
};

type FeaturesContent = {
  heading: string;
  subheading: string;
  features: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
};

type AuthContent = {
  signIn: {
    title: string;
    subtitle: string;
    button: string;
    switchMode: string;
  };
  signUp: {
    title: string;
    subtitle: string;
    button: string;
    switchMode: string;
    success: {
      title: string;
      message: string;
    };
  };
};

type BookingContent = {
  steps: {
    vehicleDetails: {
      title: string;
      description: string;
    };
    serviceSelection: {
      title: string;
      description: string;
    };
    dateTime: {
      title: string;
      description: string;
    };
    confirmation: {
      title: string;
      description: string;
    };
  };
  buttons: {
    next: string;
    previous: string;
    submit: string;
  };
};

type DashboardContent = {
  navigation: {
    profile: string;
    bookings: string;
    rewards: string;
    settings: string;
  };
  profile: {
    title: string;
    subtitle: string;
    sections: {
      personalInfo: string;
      vehicles: string;
      preferences: string;
    };
  };
  bookings: {
    title: string;
    subtitle: string;
    empty: string;
  };
};

type FooterContent = {
  sections: {
    company: {
      title: string;
      links: Array<{ text: string; href: string }>;
    };
    legal: {
      title: string;
      links: Array<{ text: string; href: string }>;
    };
    contact: {
      title: string;
      info: Array<{ label: string; value: string }>;
    };
  };
  copyright: string;
};

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

type ContactItem = {
  icon: string;
  label: string;
  href: string | null;
};

type SidebarContent = {
  mainNav: NavItem[];
  adminNav: NavItem[];
  contact: ContactItem[];
};

type AdminContent = {
  customers: {
    title: string;
    subtitle: string;
    filters: {
      all: string;
      high_value: string;
      loyal: string;
    };
    sort: {
      name: string;
      spent: string;
      loyalty: string;
      recent: string;
    };
    errors: {
      loadProfile: string;
    };
  };
};

type ProfileContent = {
  settings: {
    title: string;
    subtitle: string;
    tabs: {
      general: string;
      notifications: string;
      security: string;
    };
    sections: {
      personalInfo: {
        title: string;
        description: string;
        fields: {
          fullName: string;
          email: string;
          phone: string;
        };
        buttons: {
          changePhoto: string;
        };
      };
    };
    messages: {
      success: string;
      error: string;
    };
  };
};

type FAQContent = {
  title: string;
  subtitle: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
};

export type ContentSchema = {
  sidebar: SidebarContent;
  hero: HeroContent;
  services: ServicesContent;
  features: FeaturesContent;
  cta: CTAContent;
  auth: AuthContent;
  booking: BookingContent;
  dashboard: DashboardContent;
  footer: FooterContent;
  admin: AdminContent;
  profile: ProfileContent;
  faq: FAQContent;
  common: {
    brandName: string;
    errors: {
      general: string;
      notFound: string;
      unauthorized: string;
    };
  };
};

// Default content configuration
export const content: ContentSchema = {
  sidebar: {
    mainNav: [
      { href: '/', label: 'Home', icon: 'Home' },
      { href: '/services', label: 'Services', icon: 'Calendar' },
      { href: '/book-now', label: 'Book Now', icon: 'Calendar' },
      { href: '/faq', label: 'FAQ', icon: 'Star' },
    ],
    adminNav: [
      { href: '/dashboard/admin', label: 'Admin Dashboard', icon: 'Shield' },
      { href: '/dashboard/admin/customers', label: 'Customers', icon: 'Users' },
      { href: '/dashboard/book-service', label: 'New Booking', icon: 'Calendar' },
      { href: '/dashboard/profile', label: 'My Profile', icon: 'User' },
    ],
    contact: [
      { icon: 'Phone', label: '07908 625 581', href: 'tel:07123456789' },
      { icon: 'MapPin', label: 'SW London', href: null },
      { icon: 'FileText', label: 'zell@love4detailing.com', href: 'mailto:info@love4detailing.com' }
    ]
  },
  hero: {
    title: "Restoring the Shine, One Street at a Time.",
    subtitle: "Book a detail today and drive clean tomorrow.",
    ctaButton: "Book Your Detail"
  },
  services: {
    heading: "What You're Getting",
    subheading: "Choose from our range of professional detailing services",
    cards: [
      {
        title: "Small Vehicle",
        description: "Perfect for compact cars and small SUVs",
        price: "£55",
        features: [
          "Exterior wash & dry",
          "Interior vacuum",
          "Window cleaning",
          "Tyre shine"
        ]
      },
      {
        title: "Medium Vehicle",
        description: "Focus, Golf, Civic, Astra",
        price: "£60",
        features: [
          "Exterior wash & dry",
          "Interior vacuum",
          "Window cleaning",
          "Tyre shine"
        ]
      },
      {
        title: "Large Vehicle",
        description: "BMW 5 Series, SUVs, Estates",
        price: "£65",
        features: [
          "Exterior wash & dry",
          "Interior vacuum",
          "Window cleaning",
          "Tyre shine"
        ]
      },
      {
        title: "Extra Large Vehicle",
        description: "Vans, Range Rovers, 7-Seaters",
        price: "£70",
        features: [
          "Exterior wash & dry",
          "Interior vacuum",
          "Window cleaning",
          "Tyre shine"
        ]
      }
    ]
  },
  features: {
    heading: "Why Choose Us",
    subheading: "Experience the difference of professional detailing",
    features: [
      {
        title: "Professional Equipment",
        description: "Using only the best tools and products in the industry"
      },
      {
        title: "Experienced Team",
        description: "Skilled detailers with years of experience"
      },
      {
        title: "Convenient Booking",
        description: "Easy online booking system with flexible scheduling"
      }
    ]
  },
  cta: {
    heading: "Ready to Transform Your Vehicle?",
    subheading: "Book your appointment today and experience the difference",
    button: "Book Now",
    footerNote: "Powered by Love 4 Detailing"
  },
  auth: {
    signIn: {
      title: "Welcome Back",
      subtitle: "Sign in to manage your bookings",
      button: "Sign In",
      switchMode: "Don't have an account? Sign up"
    },
    signUp: {
      title: "Create Account",
      subtitle: "Join us for premium detailing services",
      button: "Sign Up",
      switchMode: "Already have an account? Sign in",
      success: {
        title: "Welcome to Love 4 Detailing!",
        message: "Your account has been created successfully."
      }
    }
  },
  booking: {
    steps: {
      vehicleDetails: {
        title: "Vehicle Information",
        description: "Tell us about your vehicle"
      },
      serviceSelection: {
        title: "Choose Service",
        description: "Select the detailing package that suits your needs"
      },
      dateTime: {
        title: "Pick a Date & Time",
        description: "Choose your preferred appointment slot"
      },
      confirmation: {
        title: "Confirm Booking",
        description: "Review and confirm your appointment details"
      }
    },
    buttons: {
      next: "Continue",
      previous: "Back",
      submit: "Confirm Booking"
    }
  },
  dashboard: {
    navigation: {
      profile: "My Profile",
      bookings: "My Bookings",
      rewards: "Rewards",
      settings: "Settings"
    },
    profile: {
      title: "My Profile",
      subtitle: "Manage your personal information and preferences",
      sections: {
        personalInfo: "Personal Information",
        vehicles: "My Vehicles",
        preferences: "Preferences"
      }
    },
    bookings: {
      title: "My Bookings",
      subtitle: "View and manage your appointments",
      empty: "No bookings found"
    }
  },
  footer: {
    sections: {
      company: {
        title: "Company",
        links: [
          { text: "About Us", href: "/about" },
          { text: "Services", href: "/services" },
          { text: "Contact", href: "/contact" }
        ]
      },
      legal: {
        title: "Legal",
        links: [
          { text: "Privacy Policy", href: "/privacy" },
          { text: "Terms of Service", href: "/terms" },
          { text: "Refund Policy", href: "/refund" }
        ]
      },
      contact: {
        title: "Contact Us",
        info: [
          { label: "Email", value: "zell@love4detailing.com" },
          { label: "Phone", value: "07908 625 581" }
        ]
      }
    },
    copyright: "© 2024 Love 4 Detailing. All rights reserved."
  },
  admin: {
    customers: {
      title: "Customer Management",
      subtitle: "View and manage your customer base",
      filters: {
        all: "All Customers",
        high_value: "High Value",
        loyal: "Loyal Customers"
      },
      sort: {
        name: "Name",
        spent: "Total Spent",
        loyalty: "Loyalty Points",
        recent: "Recent Activity"
      },
      errors: {
        loadProfile: "Error loading customer profile. Please try again."
      }
    }
  },
  profile: {
    settings: {
      title: "Profile Settings",
      subtitle: "Manage your account settings and preferences",
      tabs: {
        general: "General",
        notifications: "Notifications",
        security: "Security"
      },
      sections: {
        personalInfo: {
          title: "Personal Information",
          description: "Update your personal details and contact information",
          fields: {
            fullName: "Full Name",
            email: "Email",
            phone: "Phone"
          },
          buttons: {
            changePhoto: "Change Photo"
          }
        }
      },
      messages: {
        success: "Profile updated successfully",
        error: "Failed to update profile"
      }
    }
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about our detailing services",
    questions: [
      {
        question: "What areas do you cover?",
        answer: "We currently service all of South West London, including Richmond, Kingston, Wimbledon, and surrounding areas. Contact us for specific coverage details."
      },
      {
        question: "How long does a detail take?",
        answer: "A standard detail typically takes 2-3 hours, depending on the vehicle size and condition. Premium services may take longer. We'll provide a specific time estimate when you book."
      },
      {
        question: "Do you provide mobile service?",
        answer: "Yes! We come to your location with all necessary equipment and water supply. Just ensure there's space for us to work safely around your vehicle."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit/debit cards, Apple Pay, Google Pay, and bank transfers. Payment is processed securely through our booking system."
      },
      {
        question: "What's included in your basic service?",
        answer: "Our Essential Clean includes exterior wash, wheel cleaning, tire dressing, interior vacuum, dashboard/console cleaning, and window cleaning inside and out."
      }
    ]
  },
  common: {
    brandName: "Love 4 Detailing",
    errors: {
      general: "Something went wrong. Please try again.",
      notFound: "Page not found",
      unauthorized: "Please sign in to access this page"
    }
  }
}; 