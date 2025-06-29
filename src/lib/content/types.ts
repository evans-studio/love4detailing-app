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
  value?: string
}

export type SidebarContent = {
  mainNav: NavItem[]
  adminNav: NavItem[]
  contact: ContactItem[]
}

export type ServiceCard = {
  id: string
  title: string
  description: string
  duration: string
  features: readonly string[]
  popular?: boolean
  price?: string
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

export type ContentConfig = {
  navigation: {
    main: NavItem[]
    dashboard: NavItem[]
    admin: NavItem[]
    footer: {
      company: NavItem[]
      legal: NavItem[]
      social: NavItem[]
    }
  }
  contact: {
    primary: ContactItem[]
    hours: {
      weekdays: string
      weekends: string
    }
    emergency: {
      phone: string
      email: string
    }
  }
  services: {
    heading: string
    subheading: string
    cards: ServiceCard[]
  }
  pages: {
    home: {
      hero: {
        title: string
        subtitle: string
      }
    }
    booking: {
      title: string
      subtitle: string
      steps: {
        vehicleDetails: {
          title: string
          description: string
          fields: {
            make: string
            model: string
            year: string
            color: string
            registration: string
            size: {
              title: string
              description: string
            }
          }
          errors: {
            make: string
            model: string
            year: string
            registration: string
            size: string
          }
          lookup: {
            button: string
            loading: string
            error: string
            success: string
          }
        }
        serviceSelection: {
          title: string
          description: string
          addOns: {
            title: string
            description: string
          }
          details: {
            title: string
            description: string
            duration: string
            included: string
          }
        }
        dateTime: {
          title: string
          description: string
          fields: {
            date: {
              label: string
              helperText: string
            }
            time: {
              label: string
              description: string
            }
          }
          errors: {
            date: string
            time: string
            unavailable: string
          }
          messages: {
            selectedDate: string
            loading: string
            unavailable: string
            chooseAnother: string
          }
          advanceBookingNote: string
        }
        contactDetails: {
          title: string
          description: string
          fields: {
            name: {
              label: string
              placeholder: string
            }
            email: {
              label: string
              placeholder: string
            }
            phone: {
              label: string
              placeholder: string
            }
            postcode: {
              label: string
              placeholder: string
            }
            address: {
              label: string
              placeholder: string
            }
            notes: {
              label: string
              placeholder: string
            }
          }
          errors: {
            name: string
            email: string
            phone: string
            postcode: string
            address: string
          }
          sections: {
            personal: {
              title: string
              description: string
            }
            address: {
              title: string
              description: string
            }
            notes: {
              title: string
              description: string
            }
          }
        }
        confirmation: {
          title: string
          description: string
          sections: {
            vehicle: {
              title: string
              make: string
              model: string
              year: string
              color: string
              size: string
            }
            service: {
              title: string
              package: string
              addOns: string
              duration: string
            }
            appointment: {
              title: string
              date: string
              time: string
            }
            contact: {
              title: string
              name: string
              email: string
              phone: string
            }
            pricing: {
              title: string
              basePrice: string
              addOns: string
              subtotal: string
              discount: string
              total: string
            }
          }
        }
      }
      buttons: {
        previous: string
        next: string
        submit: string
        processing: string
        select: string
      }
    }
  }
  admin: {
    dashboard: {
      title: string
      subtitle: string
    }
    customers: {
      title: string
      subtitle: string
      filters: {
        all: string
        high_value: string
        loyal: string
      }
      sort: {
        name: string
        spent: string
        loyalty: string
        recent: string
      }
    }
    bookings: {
      title: string
      subtitle: string
      filters: {
        all: string
        today: string
        week: string
        month: string
      }
      sort: {
        date: string
        status: string
        value: string
      }
    }
    services: {
      title: string
      subtitle: string
    }
    rewards: {
      title: string
      subtitle: string
    }
  }
  common: {
    errors: {
      required: string
      invalid: string
      email: string
      phone: string
      postcode: string
    }
    buttons: {
      submit: string
      cancel: string
      save: string
      delete: string
      edit: string
    }
  }
  auth: {
    signIn: {
      title: string
      subtitle: string
      emailLabel: string
      passwordLabel: string
      submitButton: string
      forgotPassword: string
      noAccount: string
      signUp: string
      errors: {
        invalidCredentials: string
        serverError: string
      }
    }
    signUp: {
      title: string
      subtitle: string
      nameLabel: string
      emailLabel: string
      passwordLabel: string
      confirmPasswordLabel: string
      submitButton: string
      hasAccount: string
      signIn: string
      errors: {
        emailInUse: string
        passwordMismatch: string
        serverError: string
      }
    }
  }
  brand: {
    name: string
    tagline: string
    description: string
    contact: {
      email: string
      phone: string
      address: string
    }
  }
  profile: {
    settings: {
      title: string
      subtitle: string
      tabs: {
        general: string
        notifications: string
        security: string
      }
      sections: {
        personalInfo: {
          title: string
          subtitle: string
          description: string
          buttons: {
            changePhoto: string
            save: string
            cancel: string
          }
          fields: {
            fullName: string
            email: string
            phone: string
            address: string
          }
        }
      }
    }
  }
} 