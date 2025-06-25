"use client"

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format, addDays } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import { calculateTravelFee } from '@/lib/utils/calculateTravelFee'
import { calculateTimeSlots, getWorkingDays, isWorkingDay, TimeSlot } from '@/lib/utils/calculateTimeSlots'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { ImageUpload } from '@/components/booking/ImageUpload'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { detectVehicle, getFallbackSize, VehicleSearchResult, LicensePlateResult } from '@/lib/utils/vehicleDatabase'
import { VehicleAutocomplete } from '@/components/ui/VehicleAutocomplete'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  Camera, 
  Plus, 
  Minus,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Sparkles,
  CreditCard
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import PaymentButton from '@/components/payments/PaymentButton'

// Vehicle size categories - purely size-based classification
const vehicleSizes = {
  s: { label: 'Small', description: 'Fiesta, Polo, Mini', price: 55 },
  m: { label: 'Medium', description: 'Focus, Golf, Civic', price: 60 },
  l: { label: 'Large', description: 'BMW 5 Series, SUV, Estate', price: 65 },
  xl: { label: 'Extra Large', description: 'Van, Range Rover, 7-Seater', price: 70 },
} as const

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

// Time slots are now calculated dynamically from admin settings

const formSchema = z.object({
  serviceType: z.enum(['basic']),
  vehicleSize: z.enum(['s', 'm', 'l', 'xl']),
  vehicle: z.string().min(1, 'Please select your vehicle'),
  vehicleYear: z.string().min(4, 'Vehicle year is required'),
  vehicleColor: z.string().optional(),
  postcode: z.string().regex(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i, 'Invalid UK postcode'),
  address: z.string().min(5, 'Full address is required'),
  date: z.string().min(1, 'Please select a date'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  addOns: z.array(z.string()),
  specialRequests: z.string().optional(),
  vehicleImages: z.array(z.string()).max(5, 'Maximum 5 images allowed').optional(),
  accessInstructions: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

// Comprehensive vehicle database for automatic size categorization - purely by dimensions
const vehicleDatabase = {
  // Small vehicles (£55)
  small: [
    // BMW
    'bmw mini', 'mini cooper', 'mini one', 'mini countryman',
    // Ford
    'ford fiesta', 'ford ka', 'ford puma',
    // Volkswagen
    'volkswagen polo', 'vw polo', 'volkswagen up', 'vw up',
    // Vauxhall
    'vauxhall corsa', 'vauxhall adam', 'vauxhall viva',
    // Peugeot
    'peugeot 108', 'peugeot 208', 'peugeot 2008',
    // Renault
    'renault clio', 'renault twingo', 'renault captur',
    // Citroen
    'citroen c1', 'citroen c3', 'citroen c3 aircross',
    // Toyota
    'toyota aygo', 'toyota yaris', 'toyota yaris cross',
    // Nissan
    'nissan micra', 'nissan juke',
    // Hyundai
    'hyundai i10', 'hyundai i20',
    // Kia
    'kia picanto', 'kia rio', 'kia stonic',
    // Seat
    'seat ibiza', 'seat arona',
    // Skoda
    'skoda fabia', 'skoda kamiq',
    // Fiat
    'fiat 500', 'fiat panda', 'fiat tipo',
    // Dacia
    'dacia sandero', 'dacia logan',
    // Suzuki
    'suzuki swift', 'suzuki ignis', 'suzuki baleno',
    // MG
    'mg 3'
  ],
  
  // Medium vehicles (£60)
  medium: [
    // Audi
    'audi a3', 'audi a3 sportback', 'audi a3 saloon', 'audi a3 tfsi', 'audi a3 tdi', 'audi s3', 'audi rs3',
    'audi q2', 'audi tt', 'audi tt coupe', 'audi tt roadster', 'audi tt rs',
    // BMW
    'bmw 1 series', 'bmw 2 series', 'bmw x1',
    'bmw 116i', 'bmw 118i', 'bmw 118d', 'bmw 120i', 'bmw 125i', 'bmw m135i', 'bmw m140i',
    'bmw 216i', 'bmw 218i', 'bmw 218d', 'bmw 220i', 'bmw 225i', 'bmw m240i', 'bmw m235i',
    // Citroen
    'citroen c4', 'citroen c4 cactus', 'citroen c3 aircross', 'citroen c5 aircross',
    // Dacia
    'dacia duster', 'dacia jogger',
    // DS
    'ds 3', 'ds 4',
    // Fiat
    'fiat tipo', 'fiat 500x',
    // Ford
    'ford focus', 'ford escort', 'ford kuga', 'ford c-max', 'ford puma', 'ford ecosport',
    // Honda
    'honda civic', 'honda cr-v', 'honda crv', 'honda hr-v', 'honda hrv',
    // Hyundai
    'hyundai i30', 'hyundai tucson', 'hyundai kona',
    // Kia
    'kia ceed', 'kia xceed', 'kia sportage', 'kia niro',
    // Mazda
    'mazda 3', 'mazda 6', 'mazda cx-3', 'mazda cx3', 'mazda mx-5',
    // Mercedes
    'mercedes a-class', 'mercedes a class', 'mercedes b-class', 'mercedes b class', 'mercedes cla',
    'mercedes a35 amg', 'mercedes a45 amg',
    // MG
    'mg zs', 'mg 4',
    // Mini
    'mini hatch', 'mini clubman', 'mini countryman',
    // Nissan
    'nissan qashqai', 'nissan sentra', 'nissan leaf', 'nissan juke',
    // Peugeot
    'peugeot 308', 'peugeot 3008', 'peugeot 408', 'peugeot 2008',
    // Renault
    'renault megane', 'renault kadjar', 'renault scenic', 'renault captur',
    // Seat
    'seat leon', 'seat ateca', 'seat arona',
    // Skoda
    'skoda octavia', 'skoda karoq', 'skoda scala',
    // Suzuki
    'suzuki vitara', 'suzuki sx4 s-cross',
    // Tesla
    'tesla model 3',
    // Toyota
    'toyota corolla', 'toyota auris', 'toyota c-hr', 'toyota chr', 'toyota yaris cross',
    // Vauxhall
    'vauxhall astra', 'vauxhall mokka', 'vauxhall crossland', 'vauxhall grandland',
    // Volkswagen
    'volkswagen golf', 'vw golf', 'volkswagen jetta', 'vw jetta', 'volkswagen tiguan', 'vw tiguan',
    'volkswagen t-roc', 'vw t-roc',
    // Volvo
    'volvo v40', 'volvo xc40'
  ],
  
  // Large vehicles (£65) - includes performance cars of this size
  large: [
    // BMW
    'bmw 3 series', 'bmw 4 series', 'bmw 5 series', 'bmw x3', 'bmw x4',
    'bmw 320i', 'bmw 320d', 'bmw 330i', 'bmw 330d', 'bmw 335i',
    'bmw 420i', 'bmw 420d', 'bmw 430i', 'bmw 440i',
    'bmw 520i', 'bmw 520d', 'bmw 530i', 'bmw 530d', 'bmw 535i', 'bmw 540i',
    'bmw m2', 'bmw m3', 'bmw m4', 'bmw x3m', 'bmw x4m', 'bmw z4', 'bmw i4', 'bmw i4 m50',
    // Audi
    'audi a4', 'audi a5', 'audi a6', 'audi q3', 'audi q5',
    'audi a4 avant', 'audi a4 allroad', 'audi a5 sportback', 'audi a5 coupe',
    'audi a6 avant', 'audi s4', 'audi s5', 'audi s6', 'audi rs4', 'audi rs5', 'audi rs6',
    'audi sq5', 'audi rsq3', 'audi r8', 'audi e-tron gt',
    // Mercedes
    'mercedes c-class', 'mercedes c class', 'mercedes e-class', 'mercedes e class', 
    'mercedes glc', 'mercedes gla', 'mercedes gle',
    'mercedes c200', 'mercedes c220', 'mercedes c250', 'mercedes c300',
    'mercedes e200', 'mercedes e220', 'mercedes e250', 'mercedes e300',
    'mercedes c43 amg', 'mercedes c63 amg', 'mercedes e43 amg', 'mercedes e63 amg',
    'mercedes amg gt', 'mercedes amg gtr', 'mercedes slc', 'mercedes sl',
    // Porsche (most models are large by dimensions)
    'porsche 911', 'porsche 718', 'porsche boxster', 'porsche cayman', 'porsche macan',
    'porsche 911 turbo', 'porsche 911 gt3', 'porsche 911 gt2', 'porsche carrera', 'porsche targa',
    // Volkswagen
    'volkswagen passat', 'vw passat', 'volkswagen arteon', 'vw arteon', 
    'volkswagen touran', 'vw touran', 'volkswagen atlas', 'vw atlas',
    // Ford
    'ford mondeo', 'ford galaxy', 'ford s-max', 'ford edge', 'ford explorer',
    // Vauxhall
    'vauxhall insignia', 'vauxhall grandland',
    // Peugeot
    'peugeot 508', 'peugeot 5008',
    // Renault
    'renault talisman', 'renault koleos', 'renault espace',
    // Toyota
    'toyota camry', 'toyota rav4', 'toyota highlander', 'toyota prius', 'toyota avensis',
    // Nissan
    'nissan x-trail', 'nissan xtrail', 'nissan murano', 'nissan maxima',
    // Honda
    'honda accord', 'honda pilot', 'honda passport',
    // Hyundai
    'hyundai i40', 'hyundai santa fe', 'hyundai ioniq',
    // Kia
    'kia optima', 'kia sorento', 'kia ev6',
    // Mazda
    'mazda 6', 'mazda cx-5', 'mazda cx5', 'mazda cx-60', 'mazda cx-9',
    // Volvo
    'volvo s60', 'volvo v60', 'volvo xc60', 'volvo s90',
    // Jaguar
    'jaguar xe', 'jaguar xf', 'jaguar f-pace', 'jaguar e-pace', 'jaguar f-type', 'jaguar xkr', 'jaguar xfr',
    // Land Rover
    'land rover discovery sport', 'land rover evoque',
    // Lexus
    'lexus is', 'lexus nx', 'lexus rx', 'lexus es', 'lexus lc', 'lexus rcf', 'lexus gsf', 'lexus isf',
    // Tesla
    'tesla model y', 'tesla model s', 'tesla model s plaid',
    // Genesis
    'genesis g70', 'genesis gv70',
    // Infiniti
    'infiniti q50', 'infiniti qx50', 'infiniti q60',
    // Maserati (smaller models)
    'maserati ghibli', 'maserati quattroporte',
    // Lotus
    'lotus evora', 'lotus elise', 'lotus exige', 'lotus emira',
    // Alpine
    'alpine a110'
  ],
  
  // Extra Large vehicles (£70) - includes large performance cars and luxury SUVs
  extraLarge: [
    // BMW
    'bmw 6 series', 'bmw 7 series', 'bmw x5', 'bmw x6', 'bmw x7',
    'bmw m5', 'bmw m6', 'bmw m8', 'bmw x5m', 'bmw x6m', 'bmw i8', 'bmw ix', 'bmw ix m60',
    // Audi
    'audi a7', 'audi a8', 'audi q7', 'audi q8', 'audi e-tron',
    'audi s7', 'audi s8', 'audi rs7', 'audi sq7', 'audi sq8', 'audi rsq8',
    // Mercedes
    'mercedes s-class', 'mercedes s class', 'mercedes gle', 'mercedes gls', 'mercedes g-class', 'mercedes g class', 
    'mercedes v-class', 'mercedes v class', 'mercedes s63 amg', 'mercedes s65 amg', 'mercedes g63 amg', 
    'mercedes g65 amg', 'mercedes gle63 amg', 'mercedes gls63 amg', 'mercedes maybach',
    // Range Rover & Land Rover
    'range rover', 'range rover sport', 'range rover velar', 'range rover vogue', 'range rover svr',
    'land rover discovery', 'land rover defender',
    // Porsche (larger models)
    'porsche cayenne', 'porsche panamera', 'porsche taycan',
    // Luxury Brands
    'bentley continental', 'bentley bentayga', 'bentley mulsanne', 'bentley flying spur',
    'rolls royce ghost', 'rolls royce phantom', 'rolls royce cullinan', 'rolls royce wraith', 'rolls royce dawn',
    'ferrari 488', 'ferrari f8', 'ferrari portofino', 'ferrari roma', 'ferrari sf90', 'ferrari 296',
    'lamborghini huracan', 'lamborghini aventador', 'lamborghini urus',
    'mclaren 570s', 'mclaren 720s', 'mclaren gt', 'mclaren artura',
    'aston martin vantage', 'aston martin db11', 'aston martin dbx',
    'maserati levante', 'maserati mc20',
    // Volkswagen
    'volkswagen touareg', 'vw touareg', 'volkswagen sharan', 'vw sharan', 'volkswagen caravelle', 'vw caravelle',
    // Ford
    'ford transit', 'ford ranger', 'ford expedition',
    // Toyota
    'toyota land cruiser', 'toyota prado', 'toyota sienna', 'toyota sequoia',
    // Nissan
    'nissan patrol', 'nissan armada', 'nissan titan',
    // Volvo
    'volvo xc90', 'volvo v90',
    // Jaguar
    'jaguar xj', 'jaguar i-pace',
    // Lexus
    'lexus lx', 'lexus gx', 'lexus ls',
    // Cadillac
    'cadillac escalade', 'cadillac cts-v', 'cadillac ats-v',
    // Lincoln
    'lincoln navigator',
    // Chevrolet
    'chevrolet tahoe', 'chevrolet suburban',
    // Tesla
    'tesla model x', 'tesla model x plaid', 'tesla roadster',
    // Genesis
    'genesis g90', 'genesis gv80',
    // Infiniti
    'infiniti qx80',
    // Chrysler
    'chrysler 300c srt',
    // Vans and Commercial
    'mercedes sprinter', 'ford transit custom', 'volkswagen crafter', 'vw crafter', 'iveco daily'
  ]
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
  const [selectedVehicleData, setSelectedVehicleData] = useState<VehicleSearchResult | LicensePlateResult | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: 'basic',
      vehicleSize: 'm',
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
    },
  })

  const { watch } = form
  const selectedDate = watch('date')
  const selectedVehicleSize = watch('vehicleSize')
  const selectedServiceType = watch('serviceType')
  const selectedAddOns = watch('addOns')
  const selectedPostcode = watch('postcode')
  const watchedVehicle = watch('vehicle')
  const watchedYear = watch('vehicleYear')

  // Auto-update vehicle size when make/model changes
  useEffect(() => {
    if (watchedVehicle && watchedYear) {
      const detectedSize = determineVehicleSize(watchedVehicle, watchedYear)
      const currentSize = form.getValues('vehicleSize')
      
      // Only update if it's different to avoid infinite loops
      if (detectedSize !== currentSize) {
        form.setValue('vehicleSize', detectedSize)
        
        // Show a helpful toast
        const sizeLabels = { s: 'Small', m: 'Medium', l: 'Large', xl: 'Extra Large' }
        toast({
          title: "Vehicle Size Detected",
          description: `${watchedVehicle} ${watchedYear} has been categorized as ${sizeLabels[detectedSize]} (£${vehicleSizes[detectedSize].price})`,
        })
      }
    }
  }, [watchedVehicle, watchedYear, form, toast])

  // Fetch working days on component mount
  useEffect(() => {
    const fetchWorkingDays = async () => {
      const days = await getWorkingDays()
      setWorkingDays(days)
    }
    fetchWorkingDays()
  }, [])

  // Fetch user profile and vehicle details on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setUserProfile(profile)
        
        // Check if user has vehicle details (first time user check)
        const hasVehicleDetails = profile.vehicle_make && profile.vehicle_model
        setIsFirstTime(!hasVehicleDetails)
        
        // Set steps based on user type
        if (!hasVehicleDetails) {
          setCurrentStep(0) // Start with vehicle setup for first-time users
          setMaxSteps(5) // Add extra steps: Vehicle Setup + Service + Date/Time + Customize + Review
        } else {
          setCurrentStep(1) // Start with service selection for returning users
          setMaxSteps(4) // Standard steps: Service + Date/Time + Customize + Review
        }
        
        // Pre-fill form with existing vehicle details if available
        if (hasVehicleDetails) {
          form.setValue('vehicle', profile.vehicle_make + ' ' + profile.vehicle_model)
          form.setValue('vehicleYear', profile.vehicle_year?.toString() || '')
          
          // Determine vehicle size based on make/model
          const vehicleSize = determineVehicleSize(profile.vehicle_make, profile.vehicle_model)
          form.setValue('vehicleSize', vehicleSize)
        }
        
        // Pre-fill address if available
        if (profile.address) {
          form.setValue('address', profile.address)
        }
        if (profile.postcode) {
          form.setValue('postcode', profile.postcode)
        }
        
      } catch (error) {
        console.error('Error fetching user profile:', error)
        toast({
          title: "Error",
          description: "Failed to load your profile details.",
          variant: "destructive",
        })
      }
    }

    fetchUserProfile()
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

  // Enhanced function to determine vehicle size using comprehensive database
  const determineVehicleSize = (make: string, model: string): 's' | 'm' | 'l' | 'xl' => {
    // First try the comprehensive vehicle database
    const vehicleMatch = detectVehicle(make, model)
    
    if (vehicleMatch) {
      return vehicleMatch.size
    }
    
    // Fallback to pattern-based detection for unknown vehicles
    return getFallbackSize(make, model)
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
      if (!selectedVehicleSize || !selectedServiceType) return

      const basePrice = vehicleSizes[selectedVehicleSize].price
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
  }, [selectedVehicleSize, selectedServiceType, selectedAddOns, travelFee])

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
      const { data: bookings } = await supabase
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
      const { error: profileError } = await supabase
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

  const createBookingRecord = async (data: FormData) => {
    console.log('Creating booking with data:', data)
    console.log('User:', user)
    console.log('Total price:', totalPrice)
    
    try {
      // Validate required fields
      if (!data.date || !data.timeSlot || !data.vehicleSize || !user?.id) {
        const missingFields = []
        if (!data.date) missingFields.push('date')
        if (!data.timeSlot) missingFields.push('timeSlot')
        if (!data.vehicleSize) missingFields.push('vehicleSize')
        if (!user?.id) missingFields.push('user')
        
        const errorMsg = `Missing required fields: ${missingFields.join(', ')}`
        console.error(errorMsg)
        toast({
          title: "Validation Error",
          description: errorMsg,
          variant: "destructive",
        })
        throw new Error(errorMsg)
      }

      // Check if time slot is still available (max 5 bookings per day)
      console.log('Checking time slot availability...')
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('booking_date', data.date)
        .eq('booking_time', data.timeSlot)
        .eq('status', 'confirmed')

      if (checkError) {
        console.error('Error checking availability:', checkError)
        throw checkError
      }

      if (existingBookings && existingBookings.length >= 5) {
        toast({
          title: "Booking Failed",
          description: "This time slot is no longer available",
          variant: "destructive",
        })
        throw new Error('Time slot not available')
      }

      const serviceType = serviceTypes.find(s => s.id === data.serviceType)
      const vehicleInfo = `${data.vehicleYear} ${data.vehicle.split(' ')[0]} ${data.vehicle.split(' ')[1]}`
      
      const bookingData = {
        service_id: data.vehicleSize, // Use vehicle size as service identifier
        booking_date: data.date,
        booking_time: data.timeSlot,
        postcode: data.postcode,
        address: data.address,
        customer_name: user?.email?.split('@')[0] || 'Customer',
        email: user?.email,
        vehicle_make: data.vehicle.split(' ')[0],
        vehicle_model: data.vehicle.split(' ')[1],
        vehicle_year: parseInt(data.vehicleYear),
        vehicle_size: data.vehicleSize,
        vehicle_color: data.vehicleColor || null,
        add_ons: data.addOns || [],
        special_requests: data.specialRequests || null,
        access_instructions: data.accessInstructions || null,
        notes: `Service: ${serviceType?.name}\nVehicle: ${vehicleInfo}\nSize: ${vehicleSizes[data.vehicleSize].label}\nAdd-ons: ${data.addOns.join(', ')}\nSpecial Requests: ${data.specialRequests || 'None'}\nAccess Instructions: ${data.accessInstructions || 'None'}`,
        total_price: totalPrice,
        user_id: user?.id,
        status: 'pending',
        payment_status: 'pending',
        booking_reference: `L4D-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
      }
      
      console.log('Inserting booking with data:', bookingData)
      
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single()

      if (bookingError) {
        console.error('Booking insertion error:', bookingError)
        toast({
          title: "Database Error",
          description: `Failed to create booking: ${bookingError.message}`,
          variant: "destructive",
        })
        throw bookingError
      }

      console.log('Booking created successfully:', booking)
      setCreatedBookingId(booking.id)
      
      toast({
        title: "Booking Created Successfully!",
        description: `Your booking has been created. Please complete payment to confirm your appointment.`,
        variant: "default",
      })

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

  const handlePaymentSuccess = async (paymentResult: any) => {
    try {
      if (createdBookingId) {
        // Update booking status to confirmed
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            payment_id: paymentResult.paymentId
          })
          .eq('id', createdBookingId)

        if (updateError) {
          console.error('Update error:', updateError)
          throw updateError
        }

        // Add rewards points
        if (user?.id) {
          const pointsToAdd = Math.floor(totalPrice * 0.1)
          
          const { error: rewardsError } = await supabase.rpc('add_rewards_points', {
            user_id: user.id,
            points_to_add: pointsToAdd,
            booking_id: createdBookingId
          })

          if (rewardsError) console.error('Rewards error:', rewardsError)
        }

        toast({
          title: "Payment Successful!",
          description: `Your booking has been confirmed. Booking reference: L4D-${createdBookingId}. You'll receive a confirmation email shortly.`,
        })

        // Redirect to bookings page after a short delay
        setTimeout(() => {
          router.push('/dashboard/bookings')
        }, 2000)
      }
    } catch (error) {
      console.error('Payment success handling error:', error)
      toast({
        title: "Payment Processed",
        description: "Your payment was successful, but there was an issue updating your booking. We'll contact you to confirm.",
        variant: "default",
      })
    }
  }

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error)
    toast({
      title: "Payment Failed",
      description: "There was an issue processing your payment. Please try again or contact us for assistance.",
      variant: "destructive",
    })
  }

  const onSubmit = async (data: FormData) => {
    // This function is no longer used for booking creation
    // The booking is created when moving to the final step
    console.log('Form submitted with data:', data)
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
                        form.setValue('vehicleSize', vehicleData.size)
                        
                        // Show success toast
                        const trimText = 'trim' in vehicleData ? ` ${vehicleData.trim}` : ''
                        toast({
                          title: "Vehicle Detected",
                          description: `${vehicleData.make} ${vehicleData.model || ''}${trimText} categorized as ${vehicleSizes[vehicleData.size].label} (£${vehicleSizes[vehicleData.size].price})`,
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
                    <Car className="h-8 w-8 mx-auto mb-2 text-primary" />
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
                          form.setValue('vehicleSize', vehicleData.size)
                          
                          // Show success notification
                          toast({
                            title: "Vehicle detected!",
                            description: `${vehicleData.make} ${vehicleData.model || ''} - ${vehicleSizes[vehicleData.size].label} vehicle`,
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
                            {slot.isAvailable && slot.bookingCount > 0 && (
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
          <CreditCard className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Review & Pay</h2>
          <p className="text-muted-foreground">Please review your booking details and complete payment</p>
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
                <div className="flex justify-between">
                  <span>Service Price</span>
                  <span>£{vehicleSizes[values.vehicleSize]?.price || 0}</span>
                </div>
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

        {/* Payment Section */}
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent>
            {createdBookingId ? (
              <div className="space-y-4">
                <PaymentButton
                  bookingData={{
                    id: createdBookingId,
                    amount: totalPrice,
                    customerEmail: user?.email || '',
                    customerName: user?.email?.split('@')[0] || '',
                    service: `Car Valeting Service - ${vehicleSizes[values.vehicleSize]?.label || 'Service'}`,
                    vehicleSize: values.vehicleSize
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground text-center">
                  Secure payment powered by PayPal
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Creating booking...</span>
                <p className="text-xs text-muted-foreground text-center max-w-md">
                  Please wait while we create your booking record. This should only take a moment.
                </p>
                {isLoading && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      console.log('Debug: Current form values:', form.getValues())
                      console.log('Debug: createdBookingId:', createdBookingId)
                      console.log('Debug: isLoading:', isLoading)
                    }}
                  >
                    Debug Info
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedService = serviceTypes.find(s => s.id === selectedServiceType)
  const selectedVehicle = selectedVehicleSize ? vehicleSizes[selectedVehicleSize] : null

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