"use client"

import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { VehicleAutocomplete } from '@/components/ui/VehicleAutocomplete'
import { cn } from '@/lib/utils'
import { Car, Calendar, MapPin, CheckCircle, Clock, Plus, Minus, Sparkles, Star, CreditCard, User, ChevronRight, ChevronLeft, Loader2, Info } from 'lucide-react'
import { calculateTravelFee } from '@/lib/utils/calculateTravelFee'
import { calculateTimeSlots, getWorkingDays, isWorkingDay } from '@/lib/utils/calculateTimeSlots'
import { format, addDays } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth'
import { ServiceIcons } from '@/components/ui/icons'
import type { VehicleData, VehicleSize } from '@/types'
import type { TimeSlot } from '@/types'
import { vehicleSizes } from '@/lib/constants'

const serviceTypes = [
  { 
    id: 'basic', 
    name: 'Car Detailing Service', 
    description: 'Professional exterior and interior car detailing',
    duration: '45min - 1hr',
    included: ['Exterior wash & dry', 'Interior vacuum', 'Dashboard clean', 'Wheel clean', 'Windows', 'Basic wax'],
    multiplier: 1
  },
] as const

const addOns = [
  { id: 'interiorShampoo', label: 'Interior Deep Clean', price: 15, description: 'Deep carpet and upholstery cleaning' },
  { id: 'wheelShine', label: 'Alloy Wheel Polish', price: 10, description: 'Professional wheel polish and protection' },
  { id: 'paintProtection', label: 'Paint Protection', price: 25, description: 'Wax coating for long-lasting shine' },
  { id: 'engineBay', label: 'Engine Bay Clean', price: 20, description: 'Professional engine bay cleaning' },
  { id: 'headlightRestoration', label: 'Headlight Restoration', price: 18, description: 'Restore cloudy headlights' },
] as const

const addOnIds = ['interiorShampoo', 'wheelShine', 'paintProtection', 'engineBay', 'headlightRestoration'] as const
type AddOnId = typeof addOnIds[number]

const formSchema = z.object({
  serviceType: z.literal('basic'),
  vehicleSize: z.enum(['s', 'm', 'l', 'xl'] as const),
  vehicle: z.string().min(1, 'Please select your vehicle'),
  vehicleYear: z.string().min(4, 'Vehicle year is required'),
  vehicleColor: z.string().optional(),
  postcode: z.string().min(1, 'Postcode is required'),
  address: z.string().min(1, 'Address is required'),
  date: z.string().min(1, 'Please select a date'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  addOns: z.array(z.enum(addOnIds)).default([]),
  specialRequests: z.string().optional(),
  vehicleImages: z.array(z.string()).default([]),
  accessInstructions: z.string().optional(),
  // Profile fields
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  vehicleMake: z.string().min(1, 'Vehicle make is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required')
})

type FormData = z.infer<typeof formSchema>

interface ExtendedVehicleData extends VehicleData {
  size?: VehicleSize
}

// Vehicle size determination is now handled by DVLA API
const determineVehicleSize = async (registration: string): Promise<VehicleSize> => {
  try {
    // Call DVLA API endpoint
    const response = await fetch(`/api/dvla/vehicle-details?registration=${registration}`)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch vehicle details')
    }

    // Size determination logic from DVLA data
    const size = data.size as VehicleSize
    if (!size || !vehicleSizes[size]) {
      return 'm'
    }
    return size
  } catch (error) {
    console.error('Error fetching vehicle size:', error)
    // Default to medium size if API fails
    return 'm'
  }
}

interface PaymentResult {
  status: 'succeeded' | 'pending' | 'failed'
  id: string
  amount: number
  currency: string
  metadata?: Record<string, unknown>
}

interface PaymentError {
  code: string
  message: string
  details?: string
}

export default function DashboardBookingForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [workingDays, setWorkingDays] = useState<number[]>([1, 2, 3, 4, 5, 6])
  const [travelFee, setTravelFee] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null)
  const [maxSteps, setMaxSteps] = useState(5)
  const [selectedVehicleData, setSelectedVehicleData] = useState<ExtendedVehicleData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      serviceType: 'basic',
      vehicleSize: 'm' as const,
      vehicle: '',
      vehicleYear: '',
      vehicleColor: '',
      postcode: '',
      address: '',
      date: '',
      timeSlot: '',
      addOns: [],
      specialRequests: '',
      vehicleImages: [],
      accessInstructions: '',
      fullName: '',
      email: '',
      phone: '',
      vehicleMake: '',
      vehicleModel: ''
    }
  })

  const { watch } = form
  const selectedDate = watch('date')
  const vehicleSize = watch('vehicleSize')
  const selectedServiceType = watch('serviceType')
  const selectedAddOns = watch('addOns')
  const selectedPostcode = watch('postcode')
  const watchedVehicle = watch('vehicle')
  const watchedYear = watch('vehicleYear')

  useEffect(() => {
    if (selectedVehicleData?.size) {
      const size = selectedVehicleData.size as VehicleSize
      form.setValue('vehicleSize', size)
    } else {
      form.setValue('vehicleSize', 'm')
    }
  }, [selectedVehicleData, form])

  // Auto-update vehicle size when make/model changes
  useEffect(() => {
    if (watchedVehicle && watchedYear) {
      determineVehicleSize(watchedVehicle + ' ' + watchedYear)
        .then(detectedSize => {
          const currentSize = form.getValues('vehicleSize')
          if (currentSize !== detectedSize) {
            form.setValue('vehicleSize', detectedSize)
            
            // Show a helpful toast
            const sizeLabels = { s: 'Small', m: 'Medium', l: 'Large', xl: 'Extra Large' }
            toast({
              title: "Vehicle Size Detected",
              description: `${watchedVehicle} ${watchedYear} has been categorized as ${sizeLabels[detectedSize]} (£${vehicleSizes[detectedSize].price})`,
            })
          }
        })
        .catch(error => {
          console.error('Error determining vehicle size:', error)
        })
    }
  }, [watchedVehicle, watchedYear, form, toast])

  // Fetch working days on component mount
  useEffect(() => {
    const fetchWorkingDays = async () => {
      const days = await getWorkingDays()
      setWorkingDays(days)
    }
    fetchWorkingDays()
  }, [toast])

  // Update profile loading to handle async vehicle size
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: profile, error } = await createClientComponentClient()
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single()

        if (error) throw error

        if (profile) {
          // Pre-fill form with profile data
          form.setValue('fullName', profile.full_name)
          form.setValue('email', profile.email)
          form.setValue('phone', profile.phone)
          form.setValue('vehicleMake', profile.vehicle_make)
          form.setValue('vehicleModel', profile.vehicle_model)
          form.setValue('vehicleYear', profile.vehicle_year)
          
          // Determine vehicle size based on make/model
          if (profile.vehicle_make && profile.vehicle_model) {
            const vehicleSize = await determineVehicleSize(profile.vehicle_make + ' ' + profile.vehicle_model)
            form.setValue('vehicleSize', vehicleSize)
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }

    if (user) {
      loadProfile()
    }
  }, [user, form])

  // Helper function to get popular models for a given make
  const getPopularModels = (make: string): string => {
    const makeLower = make.toLowerCase()
    
    const popularModels: { [key: string]: string[] } = {
      'bmw': ['1 Series', '2 Series', '3 Series', '5 Series', 'X1', 'X3', 'X5'],
      'mercedes': ['A-Class', 'C-Class', 'E-Class', 'GLA', 'GLC', 'CLA'],
      'audi': ['A3', 'A4', 'A6', 'Q2', 'Q3', 'Q5', 'TT'],
      'volkswagen': ['Golf', 'Polo', 'Passat', 'Tiguan', 'T-Roc'],
      'vw': ['Golf', 'Polo', 'Passat', 'Tiguan', 'T-Roc'],
      'ford': ['Fiesta', 'Focus', 'Kuga', 'Puma', 'Mondeo'],
      'toyota': ['Yaris', 'Corolla', 'RAV4', 'C-HR', 'Prius'],
      'nissan': ['Micra', 'Qashqai', 'Juke', 'X-Trail', 'Leaf'],
      'vauxhall': ['Corsa', 'Astra', 'Mokka', 'Grandland'],
      'peugeot': ['208', '308', '2008', '3008', '5008'],
      'renault': ['Clio', 'Megane', 'Captur', 'Kadjar'],
      'hyundai': ['i10', 'i20', 'i30', 'Tucson', 'Kona'],
      'kia': ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Niro'],
      'honda': ['Civic', 'CR-V', 'HR-V', 'Jazz'],
      'mazda': ['2', '3', '6', 'CX-3', 'CX-5'],
      'volvo': ['XC40', 'XC60', 'XC90', 'V40', 'S60'],
      'jaguar': ['XE', 'XF', 'F-Pace', 'E-Pace'],
      'land rover': ['Evoque', 'Discovery Sport', 'Discovery', 'Defender'],
      'range rover': ['Evoque', 'Sport', 'Velar', 'Vogue'],
      'tesla': ['Model 3', 'Model Y', 'Model S', 'Model X']
    }
    
    const models = popularModels[makeLower] || popularModels[makeLower.replace('mercedes-benz', 'mercedes')]
    return models ? models.slice(0, 4).join(', ') : 'Focus, Golf, Corsa, Civic'
  }

  const fetchTimeSlots = useCallback(async (dateString: string) => {
    try {
      const date = new Date(dateString)
      const slots = await calculateTimeSlots(date)
      setAvailableTimeSlots(slots)
    } catch (error) {
      console.error('Error fetching time slots:', error)
      setAvailableTimeSlots([])
    }
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate)
    }
  }, [selectedDate, fetchTimeSlots])

  useEffect(() => {
    const calculatePrice = () => {
      if (!vehicleSize || !selectedServiceType) return

      const currentSize = vehicleSize as VehicleSize
      const basePrice = vehicleSizes[currentSize].price
      const serviceMultiplier = serviceTypes.find(s => s.id === selectedServiceType)?.multiplier ?? 1
      let price = Math.round(basePrice * serviceMultiplier)
      
      if (selectedAddOns) {
        price += selectedAddOns.reduce((total: number, addon: string) => {
          const addOnItem = addOns.find(a => a.id === addon)
          return total + (addOnItem ? addOnItem.price : 0)
        }, 0)
      }

      price += travelFee
      setTotalPrice(price)
    }

    calculatePrice()
  }, [vehicleSize, selectedServiceType, selectedAddOns, travelFee])

  useEffect(() => {
    const checkTravelFee = async () => {
      if (selectedPostcode && selectedPostcode.match(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i)) {
        const fee = await calculateTravelFee(selectedPostcode)
        setTravelFee(fee)
      }
    }

    checkTravelFee()
  }, [selectedPostcode])

  const fetchBookedSlots = async (date: string) => {
    try {
      const { data: bookings } = await createClientComponentClient()
        .from('bookings')
        .select('booking_time')
        .eq('booking_date', date)
        .eq('status', 'confirmed')

      if (bookings) {
        const bookedTimes = bookings.map(booking => booking.booking_time)
        console.log('Booked times for', date, ':', bookedTimes)
      }
    } catch (error) {
      console.error('Error fetching booked slots:', error)
    }
  }

  const nextStep = async () => {
    if (currentStep < maxSteps) {
      // If moving to the final step (payment), create the booking record
      if (currentStep === maxSteps - 1) {
        try {
          setIsLoading(true)
          const formData = form.getValues()
          
          // Save vehicle details to profile if first time
          if (isFirstTime) {
            await saveVehicleDetailsToProfile(formData)
          }
          
          await createBookingRecord(formData)
        } catch (error) {
          // Don't proceed to payment step if booking creation failed
          return
        } finally {
          setIsLoading(false)
        }
      }
      
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    const minStep = isFirstTime ? 0 : 1
    if (currentStep > minStep) setCurrentStep(currentStep - 1)
  }

  const saveVehicleDetailsToProfile = async (data: FormData) => {
    if (!isFirstTime || !user?.id) return true

    try {
      const { error: profileError } = await createClientComponentClient()
        .from('profiles')
        .update({
          vehicle_make: data.vehicle.split(' ')[0],
          vehicle_model: data.vehicle.split(' ')[1],
          vehicle_year: parseInt(data.vehicleYear),
          vehicle_color: data.vehicleColor,
          address: data.address,
          postcode: data.postcode
        })
        .eq('id', user.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
        toast({
          title: "Profile Update Failed",
          description: "Failed to save vehicle details to your profile.",
          variant: "destructive",
        })
        return false
      }

      toast({
        title: "Vehicle Details Saved!",
        description: "Your vehicle details have been saved to your profile for future bookings.",
      })
      
      setIsFirstTime(false) // Update state to reflect they're no longer first-time
      return true
    } catch (error) {
      console.error('Profile save error:', error)
      return false
    }
  }

  const createBookingRecord = async (formData: FormData) => {
    try {
      const { data: booking, error } = await createClientComponentClient()
        .from('bookings')
        .insert({
          user_id: user?.id,
          service_type: formData.serviceType,
          vehicle_size: formData.vehicleSize,
          vehicle: formData.vehicle,
          vehicle_year: formData.vehicleYear,
          vehicle_color: formData.vehicleColor,
          date: formData.date,
          time_slot: formData.timeSlot,
          postcode: formData.postcode,
          address: formData.address,
          add_ons: formData.addOns,
          special_requests: formData.specialRequests,
          access_instructions: formData.accessInstructions,
          status: 'pending',
          payment_status: 'pending',
          total_amount: totalPrice,
          travel_fee: travelFee
        })
        .select()
        .single()

      if (error) throw error

      // Store booking reference for success page
      localStorage.setItem('lastBooking', JSON.stringify({
        id: booking.id,
        service: serviceTypes.find(s => s.id === formData.serviceType)?.name,
        date: formData.date,
        time: formData.timeSlot
      }))

      toast({
        title: "Booking Created Successfully!",
        description: `Your booking has been created. We'll contact you to confirm the details.`,
        variant: "default",
      })

      // Redirect to bookings page after a short delay
      setTimeout(() => {
        router.push('/dashboard/bookings')
      }, 2000)

      return booking.id
    } catch (error) {
      console.error('Booking creation error:', error)
      
      toast({
        title: "Booking Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create booking. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handlePaymentSuccess = async (paymentResult: PaymentResult) => {
    try {
      if (!createdBookingId) {
        throw new Error('No booking ID found')
      }

      const { error } = await createClientComponentClient()
        .from('bookings')
        .update({
          payment_status: paymentResult.status === 'succeeded' ? 'paid' : 'pending',
          payment_id: paymentResult.id,
          payment_amount: paymentResult.amount,
          payment_currency: paymentResult.currency,
          status: paymentResult.status === 'succeeded' ? 'confirmed' : 'pending'
        })
        .eq('id', createdBookingId)

      if (error) throw error

      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed.",
        variant: "default"
      })

      router.push('/dashboard/bookings')
    } catch (error) {
      const err = error as Error
      console.error('Payment success handling error:', err)
      toast({
        title: "Error",
        description: "Failed to update payment status. Please contact support.",
        variant: "destructive"
      })
    }
  }

  const handlePaymentError = (error: PaymentError) => {
    console.error('Payment error:', error)
    toast({
      title: "Payment Failed",
      description: error.message || "There was an issue processing your payment. Please try again.",
      variant: "destructive"
    })
  }

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      await createBookingRecord(data)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep0 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Car className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Welcome! Let's Set Up Your Vehicle</h2>
        <p className="text-muted-foreground">First, we need some details about your vehicle to provide the best service</p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Smart Vehicle Detection</h3>
              <p className="text-sm text-blue-700 mt-1">
                Simply enter your vehicle make and model, and we'll automatically detect the correct size category and pricing.
                Our system recognizes hundreds of popular vehicles including Golf (Medium), Fiesta (Small), BMW 5 Series (Large), etc.
              </p>
              <p className="text-xs text-blue-600 mt-2">
                💡 You can always manually adjust the size if our detection isn't quite right.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="vehicle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle *</FormLabel>
                <FormControl>
                  <VehicleAutocomplete
                    value={field.value}
                    onChange={(value, vehicleData) => {
                      field.onChange(value)
                      setSelectedVehicleData(vehicleData || null)
                      
                      // Auto-update vehicle size if we have vehicle data
                      if (vehicleData) {
                        const size = (vehicleData.size || 'm') as VehicleSize
                        form.setValue('vehicleSize', size)
                        
                        // Show success toast
                        const trimText = 'trim' in vehicleData ? ` ${vehicleData.trim}` : ''
                        const sizeText = vehicleSizes[size].label || 'Medium Vehicle'
                        
                        toast({
                          title: "Vehicle Detected!",
                          description: `We've automatically selected "${sizeText}" based on your vehicle.`,
                        })
                      }
                    }}
                    placeholder="Start typing your vehicle..."
                    className="w-full"
                  />
                </FormControl>
                <div className="text-xs text-muted-foreground mt-1">
                  Start typing to see suggestions with automatic size detection
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1990" 
                    max={new Date().getFullYear() + 1}
                    placeholder={new Date().getFullYear().toString()} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vehicleColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Black, White, Silver" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detected Vehicle Size</FormLabel>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(vehicleSizes).map(([key, { label, price }]) => (
                      <div
                        key={key}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          field.value === key
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-muted bg-muted/30 text-muted-foreground'
                        }`}
                      >
                        <div className="font-medium text-sm">{label}</div>
                        <div className="text-xs">£{price}</div>
                      </div>
                    ))}
                  </div>
                  
                  {watchedVehicle && watchedYear && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800">
                          <strong>{watchedVehicle}</strong> detected as{' '}
                          <strong>{vehicleSizes[field.value].label}</strong> - £{vehicleSizes[field.value].price}
                        </span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        Price automatically updated. You can manually change the size if needed.
                      </p>
                      {(watchedVehicle.toLowerCase().includes('bmw') && (watchedYear.toLowerCase().includes('m') || watchedYear.toLowerCase().includes('x'))) ||
                       watchedVehicle.toLowerCase().includes('mercedes') && watchedYear.toLowerCase().includes('amg') ||
                       watchedVehicle.toLowerCase().includes('audi') && (watchedYear.toLowerCase().includes('s') || watchedYear.toLowerCase().includes('rs')) ||
                       ['porsche', 'ferrari', 'lamborghini', 'bentley', 'rolls royce', 'mclaren', 'aston martin', 'maserati', 'lotus'].some(brand => watchedVehicle.toLowerCase().includes(brand)) ? (
                        <p className="text-xs text-blue-600 mt-2 flex items-center">
                          <Sparkles className="h-3 w-3 mr-1" />
                          High-spec and performance vehicles are always handled with premium care — at no additional cost.
                        </p>
                      ) : null}
                    </div>
                  )}
                  
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select or confirm vehicle size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(vehicleSizes).map(([key, { label, description, price }]) => (
                        <SelectItem key={key} value={key}>
                          {label} (£{price}) - {description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Service Location</h3>
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Address *</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main Street, City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postcode *</FormLabel>
                <FormControl>
                  <Input placeholder="SW1A 1AA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Select Your Service</h2>
        <p className="text-muted-foreground">Choose your vehicle size for accurate pricing</p>
      </div>

      {/* Show vehicle details for returning users */}
      {!isFirstTime && userProfile && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Car className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">Your Vehicle</h3>
                <p className="text-sm text-blue-700 mt-1">
                  <strong>{userProfile.vehicle_make} {userProfile.vehicle_model}</strong>
                  {userProfile.vehicle_year && ` (${userProfile.vehicle_year})`}
                  {userProfile.vehicle_color && ` - ${userProfile.vehicle_color}`}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  💡 We've automatically detected your vehicle size category below. You can change it if needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Description */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">Car Detailing Service</h3>
              <Badge variant="secondary">Professional</Badge>
            </div>
            <p className="text-muted-foreground">Complete exterior and interior car detailing service</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center"><Clock className="h-4 w-4 mr-1" />45min - 1hr</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {serviceTypes[0].included.map((item, index) => (
                <div key={index} className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <FormField
        control={form.control}
        name="vehicleSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">Vehicle Size & Pricing</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(vehicleSizes).map(([key, { label, description, price }]) => (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    field.value === key 
                      ? 'ring-2 ring-primary border-primary bg-primary/5' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => field.onChange(key)}
                >
                  <CardContent className="p-4 text-center">
                    {key === 's' && <ServiceIcons.SmallCar className="h-8 w-8 mx-auto mb-2 text-primary" />}
                    {key === 'm' && <ServiceIcons.MediumCar className="h-8 w-8 mx-auto mb-2 text-primary" />}
                    {key === 'l' && <ServiceIcons.LargeCar className="h-8 w-8 mx-auto mb-2 text-primary" />}
                    {key === 'xl' && <ServiceIcons.ExtraLargeCar className="h-8 w-8 mx-auto mb-2 text-primary" />}
                    <h3 className="font-semibold">{label}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{description}</p>
                    <Badge variant={field.value === key ? "default" : "outline"}>£{price}</Badge>
                    {field.value === key && (
                      <div className="mt-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Show detection message for returning users */}
            {!isFirstTime && userProfile && field.value && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg mt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    <strong>{userProfile.vehicle_make} {userProfile.vehicle_model}</strong> detected as{' '}
                    <strong>{vehicleSizes[field.value].label}</strong> - £{vehicleSizes[field.value].price}
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  This was automatically selected based on your vehicle details. You can change it if needed.
                </p>
              </div>
            )}
            
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Hidden service type field */}
      <FormField
        control={form.control}
        name="serviceType"
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Date & Time</h2>
        <p className="text-muted-foreground">Choose your preferred date and time</p>
      </div>

      {/* Show vehicle summary for returning users */}
      {!isFirstTime && userProfile && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900">Vehicle & Location Confirmed</h3>
                <div className="text-sm text-green-700 mt-1 space-y-1">
                  <p><strong>Vehicle:</strong> {userProfile.vehicle_make} {userProfile.vehicle_model} {userProfile.vehicle_year && `(${userProfile.vehicle_year})`}</p>
                  <p><strong>Address:</strong> {userProfile.address}</p>
                  <p><strong>Postcode:</strong> {userProfile.postcode}</p>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  ✓ Using saved details from your profile
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show vehicle input fields only for first-time users */}
      {isFirstTime && (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="vehicle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle</FormLabel>
                  <FormControl>
                    <VehicleAutocomplete
                      value={field.value}
                      onChange={(value, vehicleData) => {
                        field.onChange(value)
                        setSelectedVehicleData(vehicleData || null)
                        
                        // Auto-update vehicle size if detected
                        if (vehicleData && 'size' in vehicleData) {
                          const size = vehicleData.size as VehicleSize
                          form.setValue('vehicleSize', size)
                          
                          // Show success notification
                          toast({
                            title: "Vehicle detected!",
                            description: `${vehicleData.make} ${vehicleData.model || ''} - ${vehicleSizes[size].label} vehicle`,
                          })
                        }
                      }}
                      placeholder="Enter reg plate (AB12 CDE) or search vehicle..."
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2020" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postcode</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SW1A 1AA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address, city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}

      {/* Hidden fields for returning users */}
      {!isFirstTime && (
        <>
          <FormField
            control={form.control}
            name="vehicle"
            render={({ field }) => <input type="hidden" {...field} />}
          />
          <FormField
            control={form.control}
            name="vehicleYear"
            render={({ field }) => <input type="hidden" {...field} />}
          />
          <FormField
            control={form.control}
            name="postcode"
            render={({ field }) => <input type="hidden" {...field} />}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => <input type="hidden" {...field} />}
          />
        </>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                  max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                  {...field}
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value)
                    // Check if selected date is a working day
                    if (isWorkingDay(selectedDate, workingDays)) {
                      field.onChange(e.target.value)
                    } else {
                      toast({
                        title: "Invalid Date",
                        description: "Please select a weekday (Monday-Friday)",
                        variant: "destructive"
                      })
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Available: Monday to Friday only
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedDate ? "Select time slot" : "Select a date first"} />
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
                              <Badge variant="alert" className="ml-2 text-xs">
                                Fully Booked
                              </Badge>
                            )}
                            {slot.isAvailable && slot.bookingCount && slot.bookingCount > 0 && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {slot.bookingCount} booked
                              </Badge>
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
              <FormDescription>
                {selectedDate && availableTimeSlots.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {availableTimeSlots.filter(s => s.isAvailable).length} slots available
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <AnimatePresence>
        {travelFee > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
                          className="p-4 bg-platinum-silver/10 border border-platinum-silver/30 rounded-lg"
          >
            <div className="flex items-center space-x-2">
                              <Info className="h-4 w-4 text-platinum-silver" />
                <p className="text-sm text-platinum-silver">
                Travel surcharge: £{travelFee} (Distance over 10 miles from SW9)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Customize Your Service</h2>
        <p className="text-muted-foreground">Add extras and special requests</p>
      </div>

      <div className="space-y-4">
        <FormLabel className="text-lg font-semibold">Additional Services</FormLabel>
        <div className="grid gap-4">
          {addOns.map(addon => (
            <FormField
              key={addon.id}
              control={form.control}
              name="addOns"
              render={({ field }) => (
                <Card 
                  className={`cursor-pointer hover:shadow-md transition-all ${
                    field.value?.includes(addon.id) 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <CardContent className="p-4">
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(addon.id)}
                          onCheckedChange={(checked) => {
                            const value = field.value || []
                            if (checked) {
                              field.onChange([...value, addon.id])
                            } else {
                              field.onChange(value.filter((v) => v !== addon.id))
                            }
                          }}
                        />
                      </FormControl>
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          const value = field.value || []
                          const isSelected = value.includes(addon.id)
                          if (isSelected) {
                            field.onChange(value.filter((v) => v !== addon.id))
                          } else {
                            field.onChange([...value, addon.id])
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{addon.label}</h3>
                          <Badge variant={field.value?.includes(addon.id) ? "default" : "outline"}>
                            +£{addon.price}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{addon.description}</p>
                      </div>
                    </FormItem>
                  </CardContent>
                </Card>
              )}
            />
          ))}
        </div>
      </div>

      <FormField
        control={form.control}
        name="specialRequests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Requests</FormLabel>
            <FormControl>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Any specific areas of focus, concerns, or special requirements..." 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Let us know about any specific needs or problem areas
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="accessInstructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Access Instructions</FormLabel>
            <FormControl>
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Parking details, gate codes, special instructions..." 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Help our team find and access your vehicle easily
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )

  const renderStep4 = () => {
    const values = form.getValues()
    
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Review & Confirm</h2>
          <p className="text-muted-foreground">Please review your booking details</p>
        </div>

        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-muted-foreground mb-2">Service Details</h4>
                <p><strong>Service:</strong> {serviceTypes.find(s => s.id === values.serviceType)?.name}</p>
                <p><strong>Vehicle:</strong> {values.vehicleYear} {values.vehicle.split(' ')[0]} {values.vehicle.split(' ')[1]}</p>
                <p><strong>Size:</strong> {vehicleSizes[values.vehicleSize]?.label}</p>
                <p><strong>Date:</strong> {values.date && format(new Date(values.date), 'EEEE, MMMM d, yyyy')}</p>
                <p><strong>Time:</strong> {values.timeSlot}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-muted-foreground mb-2">Location & Contact</h4>
                <p><strong>Postcode:</strong> {values.postcode}</p>
                <p><strong>Email:</strong> {user?.email}</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-muted-foreground mb-2">Total Price</h4>
              <p className="text-2xl font-bold">£{totalPrice.toFixed(2)}</p>
              {travelFee > 0 && (
                <p className="text-sm text-muted-foreground">
                  Includes travel fee: £{travelFee.toFixed(2)}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Creating Booking...</span>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedService = serviceTypes.find(s => s.id === selectedServiceType)
  const selectedVehicle = vehicleSize ? vehicleSizes[vehicleSize] : null

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      })
    }
  }, [error, toast])

  useEffect(() => {
    if (bookingError) {
      toast({
        title: 'Error',
        description: bookingError,
        variant: 'destructive'
      })
    }
  }, [bookingError, toast])

  const handleBookingError = (message: string) => {
    setBookingError(message)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {(isFirstTime ? [0, 1, 2, 3, 4] : [1, 2, 3, 4]).map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${currentStep >= step 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {index + 1}
              </div>
              {index < (isFirstTime ? 4 : 3) && (
                <div className={`
                  h-1 w-20 mx-4
                  ${currentStep > step ? 'bg-primary' : 'bg-muted'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          {isFirstTime ? (
            <>
              <span className={currentStep >= 0 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Vehicle Setup
              </span>
              <span className={currentStep >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Service Selection
              </span>
              <span className={currentStep >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Date & Time
              </span>
              <span className={currentStep >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Customize & Book
              </span>
              <span className={currentStep >= 4 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Review & Confirm
              </span>
            </>
          ) : (
            <>
              <span className={currentStep >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Service Selection
              </span>
              <span className={currentStep >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Date & Time
              </span>
              <span className={currentStep >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Customize & Book
              </span>
              <span className={currentStep >= 4 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                Review & Confirm
              </span>
            </>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              {currentStep === 0 && renderStep0()}
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </CardContent>
          </Card>

          {/* Price Summary */}
          {(selectedService && selectedVehicle) && (
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-primary" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>{selectedService?.name} ({selectedVehicle?.label})</span>
                  <span>£{selectedVehicle && selectedService ? Math.round(selectedVehicle.price * selectedService.multiplier) : 0}</span>
                </div>
                {selectedAddOns && selectedAddOns.length > 0 && (
                  <div className="space-y-1">
                    {selectedAddOns.map(addonId => {
                      const addon = addOns.find(a => a.id === addonId)
                      return addon ? (
                        <div key={addonId} className="flex justify-between text-sm">
                          <span>{addon.label}</span>
                          <span>+£{addon.price}</span>
                        </div>
                      ) : null
                    })}
                  </div>
                )}
                {travelFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Travel surcharge</span>
                    <span>+£{travelFee}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>£{totalPrice}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Earn {Math.floor(totalPrice * 0.1)} reward points with this booking!
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
                                  disabled={currentStep === (isFirstTime ? 0 : 1)}
            >
              Previous
            </Button>
            
            {currentStep < maxSteps ? (
              <Button type="button" onClick={nextStep}>
                Next Step
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                {isLoading ? "Processing..." : "Confirm & Pay"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
} 