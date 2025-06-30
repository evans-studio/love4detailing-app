import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { VehicleSize, ServiceType } from '@/lib/enums'
import { calculateBasePrice, calculateAddOnsPrice } from '@/lib/utils/pricing'

interface BookingState {
  // Vehicle details
  vehicle: {
    registration: string
    make: string
    model: string
    year: string
  } | null
  vehicleSize: VehicleSize
  vehicleImages: string[]

  // Service details
  serviceType: ServiceType | null
  addOns: string[]

  // Date and time
  date: string | null
  timeSlot: string | null

  // Contact details
  fullName: string
  email: string
  phone: string
  postcode: string
  address: string

  // Pricing
  basePrice: number
  addOnsPrice: number
  travelFee: number
  totalPrice: number

  // Status
  status: 'draft' | 'pending' | 'confirmed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed'
  paymentMethod: string | null

  // Actions
  setVehicle: (vehicle: BookingState['vehicle']) => void
  setVehicleSize: (size: VehicleSize) => void
  setVehicleImages: (images: string[]) => void
  setServiceType: (type: ServiceType | null) => void
  setAddOns: (addOns: string[]) => void
  setDateTime: (date: string | null, timeSlot: string | null) => void
  setContactDetails: (details: Partial<{
    fullName: string
    email: string
    phone: string
    postcode: string
    address: string
  }>) => void
  calculatePricing: () => void
  reset: () => void
}

const initialState = {
  vehicle: null,
  vehicleSize: VehicleSize.MEDIUM,
  vehicleImages: [],
  serviceType: null,
  addOns: [],
  date: null,
  timeSlot: null,
  fullName: '',
  email: '',
  phone: '',
  postcode: '',
  address: '',
  basePrice: 0,
  addOnsPrice: 0,
  travelFee: 0,
  totalPrice: 0,
  status: 'draft' as const,
  paymentStatus: 'pending' as const,
  paymentMethod: null
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setVehicle: (vehicle) => set({ vehicle }),
      
      setVehicleSize: (size) => {
        set({ vehicleSize: size })
        get().calculatePricing()
      },
      
      setVehicleImages: (images) => set({ vehicleImages: images }),
      
      setServiceType: (type) => {
        set({ serviceType: type })
        get().calculatePricing()
      },
      
      setAddOns: (addOns) => {
        set({ addOns })
        get().calculatePricing()
      },
      
      setDateTime: (date, timeSlot) => set({ date, timeSlot }),
      
      setContactDetails: (details) => set((state) => ({
        ...state,
        ...details
      })),
      
      calculatePricing: () => {
        const { serviceType, vehicleSize, addOns } = get()
        
        const basePrice = serviceType 
          ? calculateBasePrice(serviceType, vehicleSize)
          : 0
          
        const addOnsPrice = addOns.length > 0
          ? calculateAddOnsPrice(addOns, vehicleSize)
          : 0
          
        // TODO: Implement travel fee calculation based on postcode
        const travelFee = 0
        
        set({
          basePrice,
          addOnsPrice,
          travelFee,
          totalPrice: basePrice + addOnsPrice + travelFee
        })
      },
      
      reset: () => set(initialState)
    }),
    {
      name: 'booking-store',
      skipHydration: true, // Important for SSR
      partialize: (state) => ({
        // Only persist necessary fields
        vehicle: state.vehicle,
        vehicleSize: state.vehicleSize,
        serviceType: state.serviceType,
        addOns: state.addOns,
        date: state.date,
        timeSlot: state.timeSlot,
        fullName: state.fullName,
        email: state.email,
        phone: state.phone,
        postcode: state.postcode,
        address: state.address
      })
    }
  )
) 