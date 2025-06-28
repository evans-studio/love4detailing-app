import { ClientConfig } from '../schema';

export const love4detailingConfig: ClientConfig = {
  branding: {
    appName: "Love4Detailing",
    logoUrl: "https://www.love4detailing.com/logo.png",
    faviconUrl: "https://www.love4detailing.com/favicon.ico",
    colors: {
      primary: "#8A2B85",
      secondary: "#141414",
      accent: "#F8F4EB",
      background: "#141414",
      foreground: "#F8F4EB",
    },
  },
  businessInfo: {
    name: "Love4Detailing",
    contact: {
      email: "zell@love4detailing.com",
      phone: "07908 625 581",
      address: "South West London",
      googleMapsUrl: "https://maps.google.com"
    },
  },
  pricing: {
    vehicleSizes: [
      { id: 'small', name: 'Small', description: 'e.g., Ford Fiesta, VW Polo' },
      { id: 'medium', name: 'Medium', description: 'e.g., VW Golf, Audi A3' },
      { id: 'large', name: 'Large', description: 'e.g., BMW 5 Series, SUVs' },
      { id: 'extra-large', name: 'Extra Large', description: 'e.g., Vans, 7-Seaters' }
    ],
    services: [
      {
        id: 'essential-clean',
        name: 'Essential Clean',
        description: 'A thorough interior and exterior clean to bring back the shine.',
        features: ['Exterior wash & wax', 'Interior vacuum', 'Dashboard clean', 'Window clean'],
        prices: { small: 55, medium: 60, large: 65, 'extra-large': 70 },
        duration: 90,
      },
    ],
    addons: [
      { id: 'pet-hair-removal', name: 'Pet Hair Removal', description: 'Deep removal of pet hair from all surfaces.', price: 20, duration: 30 },
      { id: 'leather-treatment', name: 'Leather Treatment', description: 'Clean and condition leather seats.', price: 25, duration: 30 },
      { id: 'engine-bay-clean', name: 'Engine Bay Clean', description: 'Degrease and clean the engine bay.', price: 30, duration: 45 },
    ],
  },
  booking: {
    minLeadTimeHours: 24,
    maxBookingDaysInAdvance: 90,
    slotDurationMinutes: 30,
    operatingHours: [
      { day: "Monday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
      { day: "Tuesday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
      { day: "Wednesday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
      { day: "Thursday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
      { day: "Friday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
      { day: "Saturday", isOpen: true, openTime: "10:00", closeTime: "16:00" },
      { day: "Sunday", isOpen: false },
    ],
    serviceArea: {
      center: { lat: 51.5074, lng: -0.1278 },
      radiusKm: 20,
    },
    travelFee: {
      baseFee: 5,
      perKmMile: 1.5,
      freeRadiusKm: 10,
    },
  },
  content: {
    hero: {
      title: "Restoring the Shine, One Street at a Time.",
      subtitle: "Book a detail today and drive clean tomorrow.",
      ctaButtonText: "Book Your Detail",
    },
    faq: [
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
      }
    ],
    sidebar: {
      mainNav: [
        { href: '/', label: 'Home', icon: 'Home' },
        { href: '/booking', label: 'Book Now', icon: 'Calendar' },
        { href: '/services', label: 'Services', icon: 'Star' },
        { href: '/faq', label: 'FAQs', icon: 'FileText' }
      ],
      adminNav: [
        { href: '/dashboard/admin', label: 'Admin Dashboard', icon: 'Shield' }
      ],
      contact: [
        { icon: 'Phone', label: '07908 625 581', href: 'tel:07908625581' },
        { icon: 'MapPin', label: 'South West London', href: null }
      ]
    }
  }
};
