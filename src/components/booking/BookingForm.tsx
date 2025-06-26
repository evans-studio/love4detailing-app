"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { slideVariants, fadeInUp } from '@/lib/animations/motion-variants'
import { bookingLogger } from '@/lib/utils/logger'
import type { BookingFormData, PaymentResult, PaymentError } from '@/types'
import { supabase } from '@/lib/supabase/client'
import { calculateTravelFee } from '@/lib/utils/calculateTravelFee'
import { calculateTimeSlots, getWorkingDays, isWorkingDay } from '@/lib/utils/calculateTimeSlots'
import type { TimeSlot } from '@/types'
import { detectVehicle, getFallbackSize } from '@/lib/utils/vehicleDatabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { v4 as uuidv4 } from 'uuid'
import { PostBookingModal } from '@/components/auth/PostBookingModal'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { 
  User, 
  MapPin, 
  Car, 
  Calendar, 
  Clock, 
  Plus, 
  Camera, 
  CreditCard,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import { ServiceIcons } from '@/components/ui/icons'
import PaymentButton from '@/components/payments/PaymentButton'
import { VehicleAutocomplete } from '@/components/ui/VehicleAutocomplete'
import { VehicleSearchResult, LicensePlateResult } from '@/lib/utils/vehicleDatabase'
import { cn } from '@/lib/utils'

const vehicleSizes = {
  small: { label: 'Small Vehicle', description: 'Fiesta, Polo, Mini, Corsa', price: 55 },
  medium: { label: 'Medium Vehicle', description: 'Focus, Golf, Civic, Astra', price: 60 },
  large: { label: 'Large Vehicle', description: 'BMW 5 Series, SUVs, Estates', price: 65 },
  extraLarge: { label: 'Extra Large Vehicle', description: 'Vans, Range Rover, 7-Seaters', price: 70 },
} as const

const addOns = [
  { id: 'interiorShampoo', label: 'Interior Shampoo', description: 'Deep clean fabric seats & carpets', price: 5 },
  { id: 'wheelShine', label: 'Premium Wheel Shine', description: 'Professional wheel treatment', price: 5 },
] as const

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  postcode: z.string().regex(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i, 'Invalid UK postcode'),
  vehicleLookup: z.string().min(1, 'Please enter your registration number or vehicle details'),
  vehicleSize: z.enum(['small', 'medium', 'large', 'extraLarge']),
  date: z.string().min(1, 'Please select a date'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  addOns: z.array(z.string()),
  vehicleImages: z.array(z.string()).max(3, 'Maximum 3 images allowed').optional(),
})

type FormData = z.infer<typeof formSchema>

const steps = [
  { id: 'details', title: 'Your Details', icon: User },
  { id: 'service', title: 'Service Selection', icon: Car },
  { id: 'datetime', title: 'Date & Time', icon: Calendar },
  { id: 'extras', title: 'Add-ons & Photos', icon: Plus },
  { id: 'summary', title: 'Review & Book', icon: CreditCard },
]

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [travelFee, setTravelFee] = useState(0)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [workingDays, setWorkingDays] = useState<number[]>([1, 2, 3, 4, 5, 6]) // Monday=1, Tuesday=2, etc.
  const { toast } = useToast()
  const [showPostBookingModal, setShowPostBookingModal] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null)
  const [vehicleData, setVehicleData] = useState<VehicleSearchResult | LicensePlateResult | null>(null)
  const [autoDetectedSize, setAutoDetectedSize] = useState<string | null>(null)

  // Redirect authenticated users to dashboard booking form
  useEffect(() => {
    if (user) {
      toast({
        title: "Redirecting to Dashboard",
        description: "Authenticated users should book through the dashboard for a better experience.",
      })
      router.push('/dashboard/book-service')
    }
  }, [user, router, toast])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      postcode: '',
      vehicleLookup: '',
      vehicleSize: undefined,
      date: '',
      timeSlot: '',
      addOns: [],
      vehicleImages: [],
    },
  })

  const { watch } = form
  const selectedDate = watch('date')
  const selectedVehicleSize = watch('vehicleSize')
  const selectedAddOns = watch('addOns')
  const selectedPostcode = watch('postcode')
  const vehicleLookup = watch('vehicleLookup')

  // Fetch working days on component mount
  useEffect(() => {
    const fetchWorkingDays = async () => {
      try {
        // For now, default to Monday-Saturday (1-6)
        // Later this will fetch from your database
        setWorkingDays([1, 2, 3, 4, 5, 6])
      } catch (error) {
        bookingLogger.error('Error fetching working days', error)
        // Fallback to default working days
        setWorkingDays([1, 2, 3, 4, 5, 6])
      }
    }
    fetchWorkingDays()
  }, [])

  const fetchTimeSlots = useCallback(async (dateString: string) => {
    try {
      const date = new Date(dateString)
      const slots = await calculateTimeSlots(date)
      setAvailableTimeSlots(slots)
    } catch (error) {
      setAvailableTimeSlots([])
    }
  }, [])

  const fetchBookedSlots = useCallback(async (date: string) => {
    try {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('booking_date', date)
        .eq('status', 'confirmed')

      if (bookings) {
        setBookedSlots(bookings.map(b => b.booking_time))
      }
    } catch (error) {
      setBookedSlots([])
    }
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate)
      fetchBookedSlots(selectedDate)
    } else {
      setAvailableTimeSlots([])
    }
  }, [selectedDate, fetchTimeSlots, fetchBookedSlots])

  useEffect(() => {
    const calculatePrice = () => {
      let price = selectedVehicleSize ? vehicleSizes[selectedVehicleSize].price : 0
      
      if (selectedAddOns) {
        price += selectedAddOns.reduce((total, id) => {
          const addon = addOns.find(a => a.id === id)
          return total + (addon ? addon.price : 0)
        }, 0)
      }
      
      setTotalPrice(price + travelFee)
    }
    
    calculatePrice()
  }, [selectedVehicleSize, selectedAddOns, travelFee])

  useEffect(() => {
    const checkTravelFee = async () => {
      if (selectedPostcode) {
        try {
          const fee = await calculateTravelFee(selectedPostcode)
          setTravelFee(fee)
        } catch (error) {
          setTravelFee(0)
        }
      }
    }
    checkTravelFee()
  }, [selectedPostcode])

  // Handle vehicle lookup and auto-size detection
  const handleVehicleChange = (value: string, vehicleData?: VehicleSearchResult | LicensePlateResult) => {
    setVehicleData(vehicleData || null)
    
    if (vehicleData?.size) {
      // Convert size from database format to form format
      const sizeMapping = {
        's': 'small',
        'm': 'medium', 
        'l': 'large',
        'xl': 'extraLarge'
      }
      
      const mappedSize = sizeMapping[vehicleData.size as keyof typeof sizeMapping]
      if (mappedSize) {
        setAutoDetectedSize(mappedSize)
        form.setValue('vehicleSize', mappedSize as any)
        
        toast({
          title: "Vehicle Detected!",
          description: `We've automatically selected "${vehicleSizes[mappedSize as keyof typeof vehicleSizes].label}" based on your vehicle.`,
        })
      }
    }
  }

  const createBookingRecord = async (data: FormData) => {
    try {
      // Generate a booking reference number
      const bookingRef = `L4D-${Date.now().toString().slice(-6)}`
      
      // Create booking record in database
      const vehicleInfo = vehicleData ? {
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        registration: 'registrationNumber' in vehicleData ? vehicleData.registrationNumber : '',
        year: 'yearOfManufacture' in vehicleData ? vehicleData.yearOfManufacture : null,
        fuelType: 'fuelType' in vehicleData ? vehicleData.fuelType : '',
        colour: 'colour' in vehicleData ? vehicleData.colour : ''
      } : {}

      const bookingData = {
        customer_name: data.fullName,
        email: user?.email || data.email,
        postcode: data.postcode,
        vehicle_size: data.vehicleSize,
        vehicle_lookup: data.vehicleLookup,
        vehicle_info: vehicleInfo,
        service_date: data.date,
        service_time: data.timeSlot,
        add_ons: data.addOns || [],
        vehicle_images: data.vehicleImages || [],
        notes: '',
        total_price: totalPrice,
        travel_fee: travelFee,
        status: 'pending',
        payment_status: 'pending',
        booking_reference: bookingRef,
        user_id: user?.id || null
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      const booking = await response.json()
      
      // Store booking details in localStorage for the post-booking modal and future account linking
      const bookingDetails = {
        id: booking.id,
        customer: data.fullName,
        email: user?.email || data.email,
        service: data.vehicleSize,
        date: data.date,
        time: data.timeSlot,
        addOns: data.addOns,
        total: totalPrice,
        status: 'pending',
        created_at: new Date().toISOString(),
        notes: `Vehicle Size: ${data.vehicleSize}\\nAdd-ons: ${data.addOns.join(', ')}\\nPreferred Date: ${data.date}\\nPreferred Time: ${data.timeSlot}`
      }
      
      // Clear any existing booking data first
      localStorage.removeItem('lastBooking')
      
      // Store the new booking
      localStorage.setItem('lastBooking', JSON.stringify(bookingDetails))
      
      // Also store in a separate key for account linking after signup
      // But first clean up any old pending bookings for this email
      const existingPendingBookings = JSON.parse(localStorage.getItem('pendingBookings') || '[]')
      const userEmail = user?.email || data.email
      const cleanedPendingBookings = existingPendingBookings.filter((booking: any) => booking.email !== userEmail)
      
      // Add the new booking
      cleanedPendingBookings.push(bookingDetails)
      localStorage.setItem('pendingBookings', JSON.stringify(cleanedPendingBookings))

      setCreatedBookingId(booking.id)
      
      toast({
        title: "Booking Created Successfully!",
        description: `Your booking reference is ${bookingRef}. Please complete payment to confirm your appointment.`,
        variant: "default",
      })

      return booking.id
    } catch (error) {
      console.error('Booking creation error:', error)
      
      toast({
        title: "Booking Creation Failed",
        description: "We're experiencing technical difficulties. Please call us directly at 07123 456 789 to book your service.",
        variant: "destructive",
      })
      throw error
    }
  }

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      // If moving to the final step (payment), create the booking record
      if (currentStep === steps.length - 2) {
        try {
          setIsLoading(true)
          const formData = form.getValues()
          await createBookingRecord(formData)
        } catch (error) {
          // Don't proceed to payment step if booking creation failed
          return
        } finally {
          setIsLoading(false)
        }
      }
      
      setDirection(1)
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    try {
      if (currentStep > 0) {
        setDirection(-1)
        setCurrentStep(currentStep - 1)
      }
    } catch (error) {
      toast({
        title: "Navigation Error",
        description: "There was an error going back to the previous step. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isStepValid = (stepIndex: number): boolean => {
    try {
      const values = form.getValues()
      switch (stepIndex) {
        case 0: // Details
          return !!(values.fullName && (user?.email || values.email) && values.postcode)
        case 1: // Service
          return !!(values.vehicleLookup && values.vehicleSize)
        case 2: // DateTime
          return !!(values.date && values.timeSlot)
        case 3: // Extras
          return true // Optional step
        default:
          return true
      }
    } catch (error) {
      return false
    }
  }

  const onSubmit = async (data: FormData) => {
    // This function is no longer used for booking creation
    // The booking is created when moving to the final step
    // This is just a fallback in case the form is submitted directly
    bookingLogger.debug('Form submitted', data)
  }

  const handlePaymentSuccess = async (paymentDetails: PaymentResult) => {
    try {
      // Update booking with payment details
      const bookingDetails = JSON.parse(localStorage.getItem('lastBooking') || '{}')
      
      if (bookingDetails.id) {
        // Update the booking in the database with payment confirmation
        const response = await fetch('/api/bookings', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: bookingDetails.id,
            payment_status: 'paid',
            payment_id: paymentDetails.paymentId,
            status: 'confirmed'
          }),
        })

        if (response.ok) {
          toast({
            title: "Payment Successful!",
            description: "Your booking has been confirmed. You'll receive a confirmation email shortly.",
            variant: "default",
          })
          
          // Redirect to success page
          router.push('/booking/success')
        }
      }
    } catch (error) {
      bookingLogger.error('Payment success handling error', error)
      toast({
        title: "Payment Processed",
        description: "Your payment was successful, but there was an issue updating your booking. We'll contact you to confirm.",
        variant: "default",
      })
    }
  }

  const handlePaymentError = (error: PaymentError) => {
    bookingLogger.error('Payment error', error)
    toast({
      title: "Payment Failed",
      description: "There was an issue processing your payment. Please try again or contact us for assistance.",
      variant: "destructive",
    })
  }

  const renderStepContent = () => {
    return (
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Card className={cn(
          "bg-[#1E1E1E]/80 border-[#8A2B85]/20",
          "backdrop-blur-sm"
        )}>
          {/* Progress Steps */}
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div 
                    key={step.id}
                    className={cn(
                      "flex flex-col items-center",
                      "relative w-full"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10",
                      "rounded-full flex items-center justify-center",
                      "transition-colors duration-200",
                      index === currentStep 
                        ? "bg-[#8A2B85] text-[#F8F4EB]"
                        : index < currentStep
                          ? "bg-green-500 text-[#F8F4EB]"
                          : "bg-[#8A2B85]/10 text-[#C7C7C7]"
                    )}>
                      {index < currentStep ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                    <span className={cn(
                      "text-xs sm:text-sm mt-2",
                      "hidden sm:block",
                      index === currentStep 
                        ? "text-[#F8F4EB]"
                        : "text-[#C7C7C7]"
                    )}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "absolute top-4 sm:top-5 left-1/2 w-full h-[2px]",
                        index < currentStep
                          ? "bg-green-500"
                          : "bg-[#8A2B85]/10"
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {currentStep === 0 && (
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#F8F4EB]">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name" 
                              {...field}
                              className={cn(
                                "bg-[#1E1E1E]/50 border-[#8A2B85]/20",
                                "text-[#F8F4EB] placeholder:text-[#C7C7C7]",
                                "h-11 touch-target"
                              )}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#F8F4EB]">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your email" 
                              {...field}
                              className={cn(
                                "bg-[#1E1E1E]/50 border-[#8A2B85]/20",
                                "text-[#F8F4EB] placeholder:text-[#C7C7C7]",
                                "h-11 touch-target"
                              )}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#F8F4EB]">Postcode</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Enter your postcode" 
                                {...field}
                                className={cn(
                                  "bg-[#1E1E1E]/50 border-[#8A2B85]/20",
                                  "text-[#F8F4EB] placeholder:text-[#C7C7C7]",
                                  "h-11 touch-target",
                                  "pl-10"
                                )}
                              />
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A2B85] w-4 h-4" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                          {travelFee > 0 && (
                            <Badge 
                              variant="secondary"
                              className={cn(
                                "mt-2 bg-[#8A2B85]/10 text-[#8A2B85]",
                                "border-[#8A2B85]/30"
                              )}
                            >
                              Travel fee: £{travelFee}
                            </Badge>
                          )}
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="vehicleLookup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#F8F4EB]">Vehicle Registration or Details</FormLabel>
                          <FormControl>
                            <VehicleAutocomplete
                              value={field.value}
                              onChange={(value, data) => {
                                field.onChange(value)
                                handleVehicleChange(value, data)
                              }}
                              className={cn(
                                "bg-[#1E1E1E]/50 border-[#8A2B85]/20",
                                "text-[#F8F4EB] placeholder:text-[#C7C7C7]",
                                "h-11 touch-target"
                              )}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehicleSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#F8F4EB]">Vehicle Size</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(vehicleSizes).map(([size, details]) => (
                              <div
                                key={size}
                                className={cn(
                                  "relative p-4 rounded-lg cursor-pointer",
                                  "border-2 transition-all duration-200",
                                  "touch-target min-h-[88px]",
                                  field.value === size
                                    ? "border-[#8A2B85] bg-[#8A2B85]/10"
                                    : "border-[#8A2B85]/20 bg-[#1E1E1E]/50 hover:border-[#8A2B85]/40",
                                  autoDetectedSize === size && "ring-2 ring-[#8A2B85]/30"
                                )}
                                onClick={() => field.onChange(size)}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-medium text-[#F8F4EB]">{details.label}</h3>
                                    <p className="text-sm text-[#C7C7C7]">{details.description}</p>
                                  </div>
                                  <span className="text-lg font-bold text-[#8A2B85]">£{details.price}</span>
                                </div>
                                {autoDetectedSize === size && (
                                  <Badge 
                                    className={cn(
                                      "absolute -top-2 -right-2",
                                      "bg-[#8A2B85] text-[#F8F4EB]"
                                    )}
                                  >
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Detected
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#F8F4EB]">Select Date</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger 
                                className={cn(
                                  "bg-[#1E1E1E]/50 border-[#8A2B85]/20",
                                  "text-[#F8F4EB]",
                                  "h-11 touch-target"
                                )}
                              >
                                <SelectValue placeholder="Choose a date" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1E1E1E] border-[#8A2B85]/20">
                                {workingDays.map((day) => {
                                  const date = new Date()
                                  date.setDate(date.getDate() + ((7 + day - date.getDay()) % 7))
                                  return (
                                    <SelectItem
                                      key={date.toISOString()}
                                      value={date.toISOString()}
                                      className={cn(
                                        "text-[#F8F4EB]",
                                        "hover:bg-[#8A2B85]/10",
                                        "focus:bg-[#8A2B85]/20"
                                      )}
                                    >
                                      {format(date, 'EEEE, do MMMM')}
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {selectedDate && (
                      <FormField
                        control={form.control}
                        name="timeSlot"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#F8F4EB]">Select Time</FormLabel>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {availableTimeSlots.map((slot) => {
                                const isBooked = bookedSlots.includes(slot.time)
                                return (
                                  <div
                                    key={slot.time}
                                    className={cn(
                                      "relative p-3 rounded-lg text-center",
                                      "border-2 transition-all duration-200",
                                      "touch-target min-h-[44px]",
                                      isBooked
                                        ? "border-red-500/20 bg-red-500/5 cursor-not-allowed"
                                        : field.value === slot.time
                                          ? "border-[#8A2B85] bg-[#8A2B85]/10 cursor-pointer"
                                          : "border-[#8A2B85]/20 bg-[#1E1E1E]/50 hover:border-[#8A2B85]/40 cursor-pointer"
                                    )}
                                    onClick={() => !isBooked && field.onChange(slot.time)}
                                  >
                                    <span className={cn(
                                      isBooked ? "text-red-400" : "text-[#F8F4EB]"
                                    )}>
                                      {slot.label}
                                    </span>
                                    {isBooked && (
                                      <Badge 
                                        variant="outline"
                                        className={cn(
                                          "absolute -top-2 -right-2 text-xs",
                                          "bg-red-500/10 text-red-400 border-red-500/20"
                                        )}
                                      >
                                        Booked
                                      </Badge>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    )}
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="addOns"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#F8F4EB]">Additional Services</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {addOns.map((addon) => {
                              const isSelected = field.value?.includes(addon.id)
                              return (
                                <div
                                  key={addon.id}
                                  className={cn(
                                    "relative p-4 rounded-lg cursor-pointer",
                                    "border-2 transition-all duration-200",
                                    "touch-target min-h-[88px]",
                                    isSelected
                                      ? "border-[#8A2B85] bg-[#8A2B85]/10"
                                      : "border-[#8A2B85]/20 bg-[#1E1E1E]/50 hover:border-[#8A2B85]/40"
                                  )}
                                  onClick={() => {
                                    const newValue = isSelected
                                      ? field.value?.filter((id: string) => id !== addon.id)
                                      : [...(field.value || []), addon.id]
                                    field.onChange(newValue)
                                  }}
                                >
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-medium text-[#F8F4EB]">{addon.label}</h3>
                                      <p className="text-sm text-[#C7C7C7]">{addon.description}</p>
                                    </div>
                                    <span className="text-lg font-bold text-[#8A2B85]">+£{addon.price}</span>
                                  </div>
                                  {isSelected && (
                                    <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-[#8A2B85]" />
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehicleImages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#F8F4EB]">Vehicle Photos (Optional)</FormLabel>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "aspect-square rounded-lg",
                                  "border-2 border-dashed",
                                  "flex items-center justify-center",
                                  "transition-all duration-200",
                                  "touch-target",
                                  field.value?.[index]
                                    ? "border-[#8A2B85] bg-[#8A2B85]/10"
                                    : "border-[#8A2B85]/20 bg-[#1E1E1E]/50"
                                )}
                              >
                                {field.value?.[index] ? (
                                  <img
                                    src={field.value[index]}
                                    alt={`Vehicle photo ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <Camera className="w-8 h-8 text-[#C7C7C7]" />
                                )}
                              </div>
                            ))}
                          </div>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-4 border-b border-[#8A2B85]/20">
                        <div>
                          <h3 className="font-medium text-[#F8F4EB]">Contact Details</h3>
                          <div className="text-sm text-[#C7C7C7] space-y-1">
                            <p>Name: {form.getValues('fullName')}</p>
                            <p>Email: {form.getValues('email')}</p>
                            <p>Postcode: {form.getValues('postcode')}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pb-4 border-b border-[#8A2B85]/20">
                        <div>
                          <h3 className="font-medium text-[#F8F4EB]">Selected Service</h3>
                          <p className="text-sm text-[#C7C7C7]">
                            {selectedVehicleSize && vehicleSizes[selectedVehicleSize].label}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-[#8A2B85]">
                          £{selectedVehicleSize && vehicleSizes[selectedVehicleSize].price}
                        </span>
                      </div>

                      {selectedAddOns?.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="font-medium text-[#F8F4EB]">Add-ons</h3>
                          {selectedAddOns.map((id) => {
                            const addon = addOns.find(a => a.id === id)
                            return addon ? (
                              <div key={id} className="flex items-center justify-between">
                                <span className="text-sm text-[#C7C7C7]">{addon.label}</span>
                                <span className="text-sm font-medium text-[#8A2B85]">+£{addon.price}</span>
                              </div>
                            ) : null
                          })}
                        </div>
                      )}

                      {travelFee > 0 && (
                        <div className="flex items-center justify-between pb-4 border-b border-[#8A2B85]/20">
                          <div>
                            <h3 className="font-medium text-[#F8F4EB]">Travel Fee</h3>
                            <p className="text-sm text-[#C7C7C7]">Based on your location</p>
                          </div>
                          <span className="text-lg font-bold text-[#8A2B85]">£{travelFee}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4">
                        <h3 className="text-lg font-bold text-[#F8F4EB]">Total</h3>
                        <span className="text-2xl font-bold text-[#8A2B85]">£{totalPrice}</span>
                      </div>
                    </div>

                    <PaymentButton
                      bookingData={{
                        id: createdBookingId || '',
                        amount: totalPrice,
                        customerEmail: form.getValues('email'),
                        customerName: form.getValues('fullName'),
                        service: selectedVehicleSize ? vehicleSizes[selectedVehicleSize].label : '',
                        vehicleSize: selectedVehicleSize
                      }}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </motion.div>
                )}

                <div className="flex justify-between pt-6">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className={cn(
                        "border-[#8A2B85]/20 text-[#C7C7C7]",
                        "hover:bg-[#8A2B85]/10 hover:text-[#F8F4EB]",
                        "touch-target min-h-[44px]"
                      )}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  )}
                  {currentStep < steps.length - 1 && (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className={cn(
                        "bg-[#8A2B85] hover:bg-[#8A2B85]/90",
                        "text-[#F8F4EB]",
                        "touch-target min-h-[44px]",
                        "ml-auto"
                      )}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {renderStepContent()}
      </AnimatePresence>
      <PostBookingModal
        isOpen={showPostBookingModal}
        onClose={() => setShowPostBookingModal(false)}
        bookingEmail={form.getValues('email')}
      />
    </>
  )
} 