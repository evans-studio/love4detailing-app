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
import PaymentButton from '@/components/payments/PaymentButton'
import { VehicleAutocomplete } from '@/components/ui/VehicleAutocomplete'
import { VehicleSearchResult, LicensePlateResult } from '@/lib/utils/vehicleDatabase'

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
    try {
      const values = form.getValues()
      
      switch (currentStep) {
        case 0: // Your Details
          return (
            <motion.div
              key="details"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <User className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Your Details</h2>
                <p className="text-muted-foreground">Let's start with your contact information</p>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="h-12 border-2 focus:border-primary transition-colors"
                          placeholder="Enter your full name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!user && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            {...field} 
                            className="h-12 border-2 focus:border-primary transition-colors"
                            placeholder="Enter your email address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Postcode</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="h-12 border-2 focus:border-primary transition-colors"
                          placeholder="Enter your postcode (e.g., SW1A 1AA)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          )

        case 1: // Service Selection
          return (
            <motion.div
              key="service"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <Car className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Vehicle Lookup</h2>
                <p className="text-muted-foreground">Enter your registration or search for your vehicle</p>
              </div>

              {/* Vehicle Lookup */}
              <FormField
                control={form.control}
                name="vehicleLookup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Vehicle Registration or Search</FormLabel>
                    <FormControl>
                      <VehicleAutocomplete
                        value={field.value}
                        onChange={(value, vehicleData) => {
                          field.onChange(value)
                          handleVehicleChange(value, vehicleData)
                        }}
                        placeholder="Enter reg plate (AB12 CDE) or search vehicle..."
                        className="h-12 border-2 focus:border-primary transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Vehicle Size Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Select Vehicle Size</h3>
                  {autoDetectedSize && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Auto-detected
                    </Badge>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="vehicleSize"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(vehicleSizes).map(([key, size]) => (
                        <Card
                          key={key}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            field.value === key
                              ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => field.onChange(key)}
                        >
                          <CardContent className="p-6">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-foreground">{size.label}</h3>
                                <span className="text-2xl font-bold text-primary">£{size.price}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{size.description}</p>
                              {key === 'medium' && (
                                <Badge variant="secondary" className="w-fit">Popular</Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              
              {/* Premium care message */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    High-spec and performance vehicles are always handled with premium care — at no additional cost.
                  </p>
                </div>
              </div>
            </motion.div>
          )

        case 2: // Date & Time
          return (
            <motion.div
              key="datetime"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">When would you like your service?</h2>
                <p className="text-muted-foreground">Choose your preferred date and time slot</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Select Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          min={format(new Date(), 'yyyy-MM-dd')}
                          {...field}
                          className="h-12 border-2 focus:border-primary transition-colors"
                          onChange={(e) => {
                            const selectedDate = new Date(e.target.value)
                            if (isWorkingDay(selectedDate, workingDays)) {
                              field.onChange(e.target.value)
                            } else {
                              toast({
                                title: "Invalid Date",
                                description: "Please select a weekday (Monday-Saturday)",
                                variant: "destructive"
                              })
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Select Time</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-2 focus:border-primary transition-colors">
                            <SelectValue placeholder={selectedDate ? "Choose time slot" : "Select date first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedDate ? (
                            availableTimeSlots.length > 0 ? (
                              availableTimeSlots.map(slot => (
                                <SelectItem
                                  key={slot.time}
                                  value={slot.time}
                                  disabled={!slot.isAvailable}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span>{slot.label}</span>
                                    {!slot.isAvailable && (
                                      <span className="text-red-500 text-xs ml-2">Fully Booked</span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-slots-available" disabled>
                                No time slots available for this date
                              </SelectItem>
                            )
                          ) : (
                            <SelectItem value="select-date-first" disabled>
                              Please select a date first
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          )

        case 3: // Add-ons & Photos
          return (
            <motion.div
              key="extras"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <Plus className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Enhance Your Service</h2>
                <p className="text-muted-foreground">Add extra services and upload vehicle photos (optional)</p>
              </div>

              <div className="space-y-6">
                <div>
                  <FormLabel className="text-lg font-semibold mb-4 block">Add-on Services</FormLabel>
                  <div className="grid grid-cols-1 gap-4">
                    {addOns.map(addon => {
                      const isSelected = values.addOns?.includes(addon.id) || false
                      
                      const handleToggle = () => {
                        const currentValue = values.addOns || []
                        const newValue = isSelected
                          ? currentValue.filter((v) => v !== addon.id)
                          : [...currentValue, addon.id]
                        form.setValue('addOns', newValue)
                      }
                      
                      return (
                        <Card 
                          key={addon.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            isSelected
                              ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                              : 'hover:border-primary/50'
                          }`}
                          onClick={handleToggle}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  isSelected 
                                    ? 'bg-primary border-primary text-primary-foreground' 
                                    : 'border-border'
                                }`}>
                                  {isSelected && (
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-foreground">{addon.label}</h4>
                                  <p className="text-sm text-muted-foreground">{addon.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-semibold text-primary">+£{addon.price}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <FormLabel className="text-lg font-semibold mb-4 block flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Vehicle Photos (Optional)
                  </FormLabel>
                  <div className="p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center">
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Image upload feature coming soon</p>
                    <p className="text-sm text-muted-foreground mt-2">You can add photos after booking</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )

        case 4: // Summary
          return (
            <motion.div
              key="summary"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Review Your Booking</h2>
                <p className="text-muted-foreground">Please confirm your details before booking</p>
              </div>

              <Card className="border-2">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Booking Summary</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-muted-foreground mb-2">Contact Details</h4>
                      <p><strong>Name:</strong> {values.fullName}</p>
                      <p><strong>Email:</strong> {user?.email || values.email}</p>
                      <p><strong>Postcode:</strong> {values.postcode}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-muted-foreground mb-2">Service Details</h4>
                      {values.vehicleSize && (
                        <p><strong>Vehicle:</strong> {vehicleSizes[values.vehicleSize].label}</p>
                      )}
                      <p><strong>Date:</strong> {values.date && format(new Date(values.date), 'EEEE, MMMM d, yyyy')}</p>
                      <p><strong>Time:</strong> {values.timeSlot}</p>
                    </div>
                  </div>

                  {values.addOns && values.addOns.length > 0 && (
                    <div>
                      <h4 className="font-medium text-muted-foreground mb-2">Add-on Services</h4>
                      <ul className="space-y-1">
                        {values.addOns.map(id => {
                          const addon = addOns.find(a => a.id === id)
                          return addon ? (
                            <li key={id} className="flex justify-between text-sm">
                              <span>{addon.label}</span>
                              <span>+£{addon.price}</span>
                            </li>
                          ) : null
                        })}
                      </ul>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="space-y-2 text-sm">
                      {values.vehicleSize && (
                        <div className="flex justify-between">
                          <span>Service Price</span>
                          <span>£{vehicleSizes[values.vehicleSize].price}</span>
                        </div>
                      )}
                      {values.addOns && values.addOns.length > 0 && (
                        <div className="flex justify-between">
                          <span>Add-ons</span>
                          <span>+£{values.addOns.reduce((total, id) => {
                            const addon = addOns.find(a => a.id === id)
                            return total + (addon ? addon.price : 0)
                          }, 0)}</span>
                        </div>
                      )}
                      {travelFee > 0 && (
                        <div className="flex justify-between">
                          <span>Travel Surcharge</span>
                          <span>+£{travelFee}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total</span>
                        <span className="text-primary">£{totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )

        default:
          return null
      }
    } catch (error) {
      return (
        <div className="text-center p-8">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground">Please refresh the page and try again.</p>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-true-black py-4 sm:py-6 lg:py-8">
      <div className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps - Responsive */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-3 transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-deep-purple text-primary-text shadow-lg shadow-deep-purple/30' 
                    : 'bg-sidebar-bg text-secondary-text border border-deep-purple/30'
                }`}>
                  <step.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <span className={`text-xs sm:text-sm font-medium text-center leading-tight ${
                  index <= currentStep ? 'text-primary-text' : 'text-secondary-text'
                }`}>
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="sm:hidden">{step.title.split(' ')[0]}</span>
                </span>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block absolute top-4 lg:top-6 left-1/2 w-full h-0.5 -z-10 ${
                    index < currentStep ? 'bg-deep-purple' : 'bg-deep-purple/20'
                  }`} style={{ marginLeft: '50%', width: 'calc(100% - 2rem)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container - Responsive */}
        <Card className="bg-sidebar-bg/50 backdrop-blur-sm border-deep-purple/20 overflow-hidden">
          <CardHeader className="p-4 sm:p-6 lg:p-8 border-b border-deep-purple/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-text">
                  {steps[currentStep].title}
                </h2>
                <p className="text-xs sm:text-sm text-secondary-text mt-1">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
              {totalPrice > 0 && (
                <div className="bg-deep-purple/10 rounded-lg p-3 sm:p-4 border border-deep-purple/20">
                  <div className="text-right">
                    <p className="text-xs sm:text-sm text-secondary-text">Total Price</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-deep-purple">
                      £{totalPrice}
                    </p>
                    {travelFee > 0 && (
                      <p className="text-xs text-secondary-text">
                        (inc. £{travelFee} travel fee)
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 lg:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    className="min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]"
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons - Responsive */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-deep-purple/20">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="w-full sm:w-auto order-2 sm:order-1 text-sm sm:text-base"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  
                  <div className="flex-1" />
                  
                  {currentStep < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid(currentStep)}
                      className="w-full sm:w-auto order-1 sm:order-2 text-sm sm:text-base"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <div className="w-full sm:w-auto order-1 sm:order-2">
                      <PaymentButton
                        bookingData={{
                          id: '', // Will be set by the payment system
                          amount: totalPrice,
                          customerEmail: form.getValues('email'),
                          customerName: form.getValues('fullName'),
                          service: `${vehicleSizes[form.getValues('vehicleSize')]?.label} Service`,
                          vehicleSize: form.getValues('vehicleSize')
                        }}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Post Booking Modal */}
        <PostBookingModal
          isOpen={showPostBookingModal}
          onClose={() => setShowPostBookingModal(false)}
          bookingEmail={form.getValues('email') || ''}
        />
      </div>
    </div>
  )
} 