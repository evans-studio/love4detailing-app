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
          { label: "Email", value: "info@love4detailing.com" },
          { label: "Phone", value: "+44 20 1234 5678" }
        ]
      }
    },
    copyright: "© 2024 Love 4 Detailing. All rights reserved."
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