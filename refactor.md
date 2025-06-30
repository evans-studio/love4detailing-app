_Author: Evans Studio • June 2025_

---

🎯 Objective

Refactor the **Love4Detailing** frontend into a modular, scalable, and production-grade architecture — built for longevity, performance, and ease of iteration.

This refactor aims to:

- Separate **public** (unauthenticated) flows from **dashboard** (authenticated) areas cleanly
- Improve **responsiveness** and mobile-first design consistency
- Ensure **system resilience** by planning for real-world edge cases and failures
- Eliminate unused packages and unify the frontend under a single component/UI system
- Simplify **developer handoff and onboarding** by documenting flows, logic, and standards
- Align tightly with the existing **Supabase backend** (auth, RLS, user profiles, bookings)
- Prepare for future features: multi-user admin tools, payment integration, notifications, and loyalty system

This documentation will serve as the blueprint for building, scaling, and maintaining the app with confidence.
---

## 🧭 Core Structure

### 🔓 Public Site (Unauthenticated)
- `/` → Landing page (GSAP orb animation)
- `/book` → Multi-step booking form
- `/confirmation` → Booking success screen

### 🔐 Dashboard (Authenticated)
- `/dashboard` → Main user area
- `/dashboard/book` → Repeat bookings
- `/dashboard/profile` → Saved vehicle + contact info
- `/dashboard/rewards` → Loyalty system (placeholder)

---

## 🛠️ Tech Stack Alignment

| Purpose             | Tech                        | Notes                                 |
|---------------------|-----------------------------|----------------------------------------|
| UI Components       | **ShadCN** + **Radix UI**   | Remove Mantine & unify styling         |
| Styling             | **TailwindCSS**             | Use utility-first, mobile-first        |
| Animations          | **GSAP**                    | Only on landing — scoped per route     |
| Forms               | **react-hook-form + zod**   | Consistent validation + UX patterns    |
| Backend             | **Supabase**                | Auth, DB, RLS, media storage           |

---

## 🔁 Booking User Flow

```mermaid
flowchart TD
  A[Landing Page] --> B[Click "Book Service"]
  B --> C[Enter Reg → DVLA lookup]
  C --> D[Auto-select vehicle size]
  D --> E[Enter user info + upload photos]
  E --> F[Pick date/time]
  F --> G[Submit Booking]
  G --> H[Confirm screen + invoice]
  H --> I[User account auto-created]
  I --> J[Prompt: Set your password]
  J --> K[Dashboard: View/cancel/edit bookings]
```

---

## 📦 Component Architecture

### Core Components
- `FormSection`: Consistent section wrapper with title, description, and error handling
  ```tsx
  interface FormSectionProps {
    title: string
    description?: string
    variant?: 'default' | 'bordered'
    required?: boolean
    error?: string
    children: React.ReactNode
  }
  ```

- `Input`: Base input component with validation, labels, and error states
  ```tsx
  interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    helperText?: string
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
  }
  ```

- `Calendar`: Date picker with availability checking and time slot selection
  ```tsx
  interface CalendarProps {
    selectedDate?: Date
    minDate?: Date
    maxDate?: Date
    onSelect: (date: Date) => void
    disabledDates?: Date[]
    availableTimeSlots?: Record<string, string[]>
  }
  ```

- `ImageUpload`: Vehicle photo upload with preview and validation
  ```tsx
  interface ImageUploadProps {
    maxFiles?: number
    maxSize?: number // in bytes
    acceptedTypes?: string[]
    onUpload: (files: File[]) => Promise<string[]>
    onRemove: (url: string) => void
  }
  ```

### Booking Flow Architecture

#### Step Management
```tsx
interface StepConfig {
  key: BookingStep
  title: string
  description: string
  component: React.ComponentType<any>
  validation: (data: BookingStore) => boolean
}

const bookingSteps: StepConfig[] = [
  {
    key: 'vehicle',
    title: content.steps.vehicle.title,
    description: content.steps.vehicle.description,
    component: VehicleDetailsStep,
    validation: (data) => !!data.vehicle && !!data.vehicleSize
  },
  // ... other steps
]
```

#### Step Navigation
```tsx
const BookingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const store = useBookingStore()
  
  const handleNext = () => {
    const step = bookingSteps[currentStep]
    if (step.validation(store)) {
      setCurrentStep(prev => prev + 1)
    }
  }
  
  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }
}
```

---

## 🗄️ State Management

### Zustand Store Implementation
```typescript
interface BookingState extends BookingStore {
  // Actions
  setVehicle: (vehicle: Vehicle | null) => void
  setVehicleSize: (size: VehicleSize) => void
  setServiceType: (type: ServiceType | null) => void
  setAddOns: (addOns: string[]) => void
  setDateTime: (date: string | null, timeSlot: string | null) => void
  setContactDetails: (details: Partial<ContactDetails>) => void
  calculatePricing: () => void
  reset: () => void
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      // Initial state
      vehicle: null,
      vehicleSize: VehicleSize.MEDIUM,
      vehicleImages: [],
      // ... other initial values

      // Actions
      setVehicle: (vehicle) => set({ vehicle }),
      setVehicleSize: (size) => {
        set({ vehicleSize: size })
        get().calculatePricing()
      },
      // ... other actions

      calculatePricing: () => {
        const { vehicleSize, serviceType, addOns } = get()
        const basePrice = calculateBasePrice(serviceType, vehicleSize)
        const addOnsPrice = calculateAddOnsPrice(addOns, vehicleSize)
        set({
          basePrice,
          addOnsPrice,
          totalPrice: basePrice + addOnsPrice
        })
      }
    }),
    {
      name: 'booking-store',
      skipHydration: true
    }
  )
)
```

### Content Management Implementation
```typescript
// content.ts
export const content = {
  pages: {
    booking: {
      steps: {
        vehicle: {
          title: 'Vehicle Details',
          description: 'Tell us about your vehicle',
          fields: {
            registration: {
              label: 'Registration Number',
              placeholder: 'e.g. AB12 CDE',
              error: 'Please enter a valid registration'
            }
          }
        }
        // ... other steps
      }
    }
  }
} as const

// Type-safe content access
type Content = typeof content
```

---

## 🔒 Form Validation & Security

### Form Implementation with Zod
```typescript
// schemas/booking.ts
export const vehicleSchema = z.object({
  registration: z.string()
    .min(1, "Registration is required")
    .regex(/^[A-Z0-9 ]{4,8}$/, "Invalid registration format"),
  size: z.nativeEnum(VehicleSize),
  images: z.array(z.string().url()).max(3)
})

// components/VehicleDetailsStep.tsx
const VehicleDetailsStep: React.FC = () => {
  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registration: '',
      size: VehicleSize.MEDIUM,
      images: []
    }
  })

  const onSubmit = async (data: z.infer<typeof vehicleSchema>) => {
    try {
      // Server-side validation
      const response = await fetch('/api/vehicle/validate', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Validation failed')
      }

      // Update store and proceed
      store.setVehicle(data)
      onNext()
    } catch (error) {
      form.setError('root', { message: 'Please check your details' })
    }
  }
}
```

### Security Implementation
```typescript
// middleware.ts
export const config = {
  matcher: ['/api/vehicle/:path*', '/api/booking/:path*']
}

export function middleware(request: NextRequest) {
  // Rate limiting
  const ip = request.ip ?? 'anonymous'
  const limit = Ratelimit.sliding(ip, {
    window: '1m',
    limit: 10
  })

  // CORS headers
  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN)
  
  // API authentication
  const token = request.headers.get('Authorization')?.split(' ')[1]
  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  return response
}
```

---

## 🚀 Deployment & Performance

### Build Configuration
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['storage.supabase.co'],
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true
  },
  webpack: (config, { dev, isServer }) => {
    // GSAP optimization
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.gsap = {
        test: /[\\/]node_modules[\\/]gsap[\\/]/,
        name: 'gsap',
        priority: 10,
        reuseExistingChunk: true
      }
    }
    return config
  }
}
```

### Error Boundary Implementation
```tsx
// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service
    Sentry.captureException(error, { extra: errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### Monitoring Setup
```typescript
// lib/monitoring.ts
export const initializeMonitoring = () => {
  // Sentry setup
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    integrations: [
      new BrowserTracing(),
      new Replay({
        maskAllText: true,
        blockAllMedia: true
      })
    ]
  })

  // PostHog setup
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false
    })
  }
}

// Usage in _app.tsx
export default function App({ Component, pageProps }) {
  useEffect(() => {
    initializeMonitoring()
  }, [])

  return <Component {...pageProps} />
}
```

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// __tests__/components/VehicleDetailsStep.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { VehicleDetailsStep } from '@/components/booking/steps/VehicleDetailsStep'

describe('VehicleDetailsStep', () => {
  it('validates registration number format', async () => {
    render(<VehicleDetailsStep />)
    
    const input = screen.getByLabelText(/registration/i)
    fireEvent.change(input, { target: { value: 'AB12CDE' } })
    
    const submitButton = screen.getByRole('button', { name: /next/i })
    fireEvent.click(submitButton)
    
    expect(await screen.findByText(/valid registration/i)).toBeInTheDocument()
  })

  it('handles DVLA lookup failure gracefully', async () => {
    // Mock failed API call
    global.fetch = jest.fn(() => 
      Promise.reject(new Error('DVLA API error'))
    )

    render(<VehicleDetailsStep />)
    
    const input = screen.getByLabelText(/registration/i)
    fireEvent.change(input, { target: { value: 'AB12CDE' } })
    
    const lookupButton = screen.getByRole('button', { name: /lookup/i })
    fireEvent.click(lookupButton)
    
    expect(await screen.findByText(/couldn't find vehicle/i)).toBeInTheDocument()
  })
})
```

### Integration Tests
```typescript
// cypress/e2e/booking.cy.ts
describe('Booking Flow', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/vehicle/lookup', {
      fixture: 'vehicleLookup.json'
    })
    cy.visit('/book')
  })

  it('completes full booking journey', () => {
    // Vehicle Details
    cy.findByLabelText(/registration/i).type('AB12CDE')
    cy.findByRole('button', { name: /lookup/i }).click()
    cy.findByText(/BMW 3 Series/i).should('exist')
    cy.findByRole('button', { name: /next/i }).click()

    // Service Selection
    cy.findByText(/Premium Detail/i).click()
    cy.findByText(/Paint Protection/i).click()
    cy.findByRole('button', { name: /next/i }).click()

    // Date & Time
    cy.findByLabelText(/select date/i).click()
    cy.findByText(/Available Times/i).should('exist')
    cy.findByText('10:00 AM').click()
    cy.findByRole('button', { name: /next/i }).click()

    // Confirmation
    cy.findByText(/Total Price/i).should('exist')
    cy.findByText('£299').should('exist')
  })
})
```

### API Tests
```typescript
// __tests__/api/booking.test.ts
import { createMocks } from 'node-mocks-http'
import { createBooking } from '@/app/api/booking/route'
import { supabase } from '@/lib/supabase'

jest.mock('@/lib/supabase')

describe('Booking API', () => {
  it('creates a new booking', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        vehicle: { registration: 'AB12CDE' },
        service: 'premium-detail',
        date: '2025-07-01',
        time: '10:00'
      }
    })

    await createBooking(req, res)

    expect(res._getStatusCode()).toBe(201)
    expect(JSON.parse(res._getData())).toHaveProperty('id')
  })

  it('validates required fields', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { vehicle: { registration: 'AB12CDE' } }
    })

    await createBooking(req, res)

    expect(res._getStatusCode()).toBe(400)
    expect(JSON.parse(res._getData())).toHaveProperty('error')
  })
})
```

---

## 🔌 API Implementation

### Route Handlers
```typescript
// app/api/booking/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { bookingSchema } from '@/lib/schemas/booking'
import { calculatePricing } from '@/lib/utils/pricing'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = bookingSchema.parse(body)
    
    // Calculate pricing
    const pricing = calculatePricing({
      serviceType: data.serviceType,
      vehicleSize: data.vehicleSize,
      addOns: data.addOns
    })

    // Create booking in Supabase
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        ...data,
        total_price: pricing.total,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    // Send confirmation email
    await sendBookingConfirmation({
      email: data.email,
      bookingRef: booking.id,
      details: data
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
```

### API Utilities
```typescript
// lib/api/booking.ts
export async function checkTimeSlotAvailability(
  date: string,
  serviceType: ServiceType
): Promise<string[]> {
  const { data: existingBookings } = await supabase
    .from('bookings')
    .select('time_slot')
    .eq('date', date)
    .neq('status', 'cancelled')

  const bookedSlots = new Set(existingBookings?.map(b => b.time_slot))
  const allSlots = generateTimeSlots(serviceType)
  
  return allSlots.filter(slot => !bookedSlots.has(slot))
}

export async function lockTimeSlot(
  date: string,
  timeSlot: string,
  duration: number
): Promise<boolean> {
  const { error } = await supabase.rpc('lock_time_slot', {
    p_date: date,
    p_time_slot: timeSlot,
    p_duration: duration
  })

  return !error
}
```

---

## 🔐 Authentication Flow

### Supabase Auth Setup
```typescript
// lib/auth.ts
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-side auth helper
export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

// Client-side auth hook
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function getActiveSession() {
      const session = await getSession()
      if (mounted) {
        setSession(session)
        setLoading(false)
      }
    }

    getActiveSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) setSession(session)
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  return { session, loading }
}
```

### Protected Routes
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // Protected routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Check user role for admin routes
    if (
      req.nextUrl.pathname.startsWith('/dashboard/admin') &&
      session.user.role !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}
```

### Auth Components
```typescript
// components/auth/SignInForm.tsx
export function SignInForm() {
  const form = useForm<SignInCredentials>({
    resolver: zodResolver(signInSchema)
  })
  
  const onSubmit = async (data: SignInCredentials) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) throw error

      // Redirect to dashboard or previous page
      router.push(returnUrl || '/dashboard')
    } catch (error) {
      form.setError('root', {
        message: 'Invalid email or password'
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="email"
          label="Email"
          type="email"
          placeholder="your@email.com"
        />
        <FormField
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
        />
        <Button type="submit" loading={form.formState.isSubmitting}>
          Sign In
        </Button>
      </form>
    </Form>
  )
}
```

---

## 📊 Dashboard Features

### User Dashboard
```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: rewards } = await supabase
    .from('rewards')
    .select('points, tier')
    .single()

  return (
    <DashboardLayout>
      <section className="grid gap-6 md:grid-cols-2">
        {/* Quick Stats */}
        <StatsCard
          title="Loyalty Points"
          value={rewards?.points || 0}
          description={`${rewards?.tier} Member`}
        />
        
        {/* Recent Bookings */}
        <BookingsList bookings={bookings} />
        
        {/* Quick Actions */}
        <QuickActions />
      </section>
    </DashboardLayout>
  )
}
```

### Admin Dashboard
```typescript
// app/dashboard/admin/page.tsx
export default async function AdminDashboardPage() {
  const { data: stats } = await supabase
    .rpc('get_booking_stats')
    .single()

  return (
    <AdminLayout>
      {/* Overview Stats */}
      <StatsGrid>
        <StatCard
          title="Total Bookings"
          value={stats.total_bookings}
          trend={stats.booking_trend}
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(stats.total_revenue)}
          trend={stats.revenue_trend}
        />
        <StatCard
          title="Active Users"
          value={stats.active_users}
          trend={stats.user_growth}
        />
      </StatsGrid>

      {/* Booking Management */}
      <BookingManagement />

      {/* User Management */}
      <UserManagement />
    </AdminLayout>
  )
}
```

### Dashboard Components
```typescript
// components/dashboard/BookingsList.tsx
export function BookingsList({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <h3 className="text-lg font-semibold">Recent Bookings</h3>
        <div className="mt-4 space-y-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              actions={
                <BookingActions
                  booking={booking}
                  onCancel={() => cancelBooking(booking.id)}
                  onReschedule={(date) => rescheduleBooking(booking.id, date)}
                />
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// components/dashboard/QuickActions.tsx
export function QuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ActionCard
        title="Book Service"
        description="Schedule your next detailing service"
        icon={<CalendarIcon />}
        href="/dashboard/book"
      />
      <ActionCard
        title="View History"
        description="See your past bookings and invoices"
        icon={<HistoryIcon />}
        href="/dashboard/history"
      />
      <ActionCard
        title="Manage Vehicles"
        description="Update your saved vehicles"
        icon={<CarIcon />}
        href="/dashboard/vehicles"
      />
      <ActionCard
        title="Rewards"
        description="Check your points and benefits"
        icon={<GiftIcon />}
        href="/dashboard/rewards"
      />
    </div>
  )
}
```

---

## 🔄 Frontend-Backend Integration

### Real-time Booking Updates
```typescript
// hooks/useBookingUpdates.ts
export function useBookingUpdates(bookingId: string) {
  const [status, setStatus] = useState<BookingStatus>('pending')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    // Initial fetch
    const fetchBooking = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('status')
        .eq('id', bookingId)
        .single()
        
      if (mounted && data) {
        setStatus(data.status)
        setLoading(false)
      }
    }

    fetchBooking()

    // Subscribe to changes
    const subscription = supabase
      .channel(`booking-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${bookingId}`
        },
        (payload) => {
          if (mounted) {
            setStatus(payload.new.status)
          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [bookingId])

  return { status, loading }
}

// Usage in component
function BookingStatus({ bookingId }: { bookingId: string }) {
  const { status, loading } = useBookingUpdates(bookingId)
  
  if (loading) return <Spinner />
  
  return (
    <Badge variant={getStatusVariant(status)}>
      {formatStatus(status)}
    </Badge>
  )
}
```

### Data Synchronization
```typescript
// lib/sync/bookingSync.ts
interface SyncOptions {
  retryAttempts?: number
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export class BookingSync {
  private queue: Map<string, BookingOperation>
  private processing: boolean

  constructor() {
    this.queue = new Map()
    this.processing = false
  }

  async enqueue(operation: BookingOperation, options?: SyncOptions) {
    this.queue.set(operation.id, operation)
    
    if (!this.processing) {
      await this.processQueue(options)
    }
  }

  private async processQueue(options: SyncOptions = {}) {
    if (this.processing) return
    
    this.processing = true
    
    try {
      for (const [id, operation] of this.queue) {
        await this.processOperation(operation, options)
        this.queue.delete(id)
      }
    } finally {
      this.processing = false
    }
  }

  private async processOperation(
    operation: BookingOperation,
    options: SyncOptions
  ) {
    let attempts = 0
    
    while (attempts < (options.retryAttempts || 3)) {
      try {
        await this.executeOperation(operation)
        options.onSuccess?.()
        return
      } catch (error) {
        attempts++
        if (attempts === (options.retryAttempts || 3)) {
          options.onError?.(error as Error)
          throw error
        }
        await delay(Math.pow(2, attempts) * 1000) // Exponential backoff
      }
    }
  }
}

// Usage example
const bookingSync = new BookingSync()

async function updateBooking(id: string, data: Partial<Booking>) {
  await bookingSync.enqueue(
    {
      id,
      type: 'update',
      data
    },
    {
      retryAttempts: 3,
      onSuccess: () => toast.success('Booking updated'),
      onError: () => toast.error('Failed to update booking')
    }
  )
}
```

### Optimistic Updates
```typescript
// hooks/useOptimisticBooking.ts
export function useOptimisticBooking(bookingId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (updates: Partial<Booking>) => {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId)
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onMutate: async (updates) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['booking', bookingId])
      
      // Snapshot previous value
      const previousBooking = queryClient.getQueryData(['booking', bookingId])
      
      // Optimistically update
      queryClient.setQueryData(['booking', bookingId], (old: Booking) => ({
        ...old,
        ...updates
      }))
      
      return { previousBooking }
    },
    onError: (err, updates, context) => {
      // Revert on error
      queryClient.setQueryData(
        ['booking', bookingId],
        context?.previousBooking
      )
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['booking', bookingId])
    }
  })
}

// Usage in component
function BookingActions({ booking }: { booking: Booking }) {
  const optimisticUpdate = useOptimisticBooking(booking.id)
  
  const handleCancel = async () => {
    await optimisticUpdate.mutateAsync({
      status: 'cancelled',
      cancelled_at: new Date().toISOString()
    })
  }
  
  return (
    <Button
      onClick={handleCancel}
      loading={optimisticUpdate.isLoading}
      disabled={booking.status === 'cancelled'}
    >
      Cancel Booking
    </Button>
  )
}
```

### Error Boundaries & Recovery
```typescript
// components/ErrorBoundary/BookingErrorBoundary.tsx
interface FallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

function BookingErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const isNetworkError = error instanceof NetworkError
  const isValidationError = error instanceof ValidationError
  
  return (
    <div className="rounded-lg border bg-destructive/10 p-6">
      <h3 className="text-lg font-semibold text-destructive">
        {isNetworkError
          ? 'Connection Error'
          : isValidationError
          ? 'Invalid Booking Data'
          : 'Something went wrong'}
      </h3>
      
      <p className="mt-2 text-muted-foreground">
        {isNetworkError
          ? 'Please check your connection and try again'
          : isValidationError
          ? 'Please check your booking details'
          : 'An unexpected error occurred'}
      </p>
      
      <div className="mt-4 flex gap-4">
        <Button onClick={resetErrorBoundary}>
          Try Again
        </Button>
        
        {isNetworkError && (
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        )}
      </div>
    </div>
  )
}

export function BookingErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={BookingErrorFallback}
      onReset={() => {
        // Reset local state
        queryClient.resetQueries(['booking'])
      }}
      resetKeys={['booking']}
    >
      {children}
    </ErrorBoundary>
  )
}
```

### Form State Persistence
```typescript
// hooks/usePersistedForm.ts
export function usePersistedForm<T extends object>(
  key: string,
  defaultValues: T
) {
  // Load persisted data
  const [initialValues] = useState(() => {
    if (typeof window === 'undefined') return defaultValues
    
    const persisted = localStorage.getItem(key)
    if (!persisted) return defaultValues
    
    try {
      return JSON.parse(persisted)
    } catch {
      return defaultValues
    }
  })
  
  const form = useForm<T>({
    defaultValues: initialValues
  })
  
  // Save form state changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      localStorage.setItem(key, JSON.stringify(values))
    })
    
    return () => subscription.unsubscribe()
  }, [form, key])
  
  // Clear persisted data on submit
  const handleSubmit = async (onSubmit: SubmitHandler<T>) => {
    return form.handleSubmit(async (data) => {
      await onSubmit(data)
      localStorage.removeItem(key)
    })()
  }
  
  return { form, handleSubmit }
}

// Usage in booking form
function BookingForm() {
  const { form, handleSubmit } = usePersistedForm('booking-form', {
    vehicle: null,
    service: null,
    date: null,
    time: null
  })
  
  const onSubmit = async (data: BookingFormData) => {
    await createBooking(data)
    router.push('/confirmation')
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

### API Request Caching
```typescript
// lib/api/cache.ts
interface CacheConfig {
  ttl: number
  staleWhileRevalidate?: boolean
}

export class APICache {
  private cache: Map<string, {
    data: any
    timestamp: number
  }>
  
  constructor(private config: CacheConfig) {
    this.cache = new Map()
  }
  
  async get<T>(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const cached = this.cache.get(key)
    const now = Date.now()
    
    // Return cached data if fresh
    if (cached && (now - cached.timestamp) < this.config.ttl) {
      return cached.data
    }
    
    // Return stale data and revalidate in background
    if (
      this.config.staleWhileRevalidate &&
      cached &&
      (now - cached.timestamp) < this.config.ttl * 2
    ) {
      this.revalidate(key, fetcher)
      return cached.data
    }
    
    // Fetch fresh data
    const data = await fetcher()
    this.cache.set(key, {
      data,
      timestamp: now
    })
    
    return data
  }
  
  private async revalidate<T>(
    key: string,
    fetcher: () => Promise<T>
  ) {
    try {
      const data = await fetcher()
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      })
    } catch (error) {
      console.error('Revalidation failed:', error)
    }
  }
}

// Usage example
const apiCache = new APICache({
  ttl: 5 * 60 * 1000, // 5 minutes
  staleWhileRevalidate: true
})

async function getAvailableTimeSlots(date: string) {
  return apiCache.get(
    `time-slots-${date}`,
    () => supabase
      .from('time_slots')
      .select('*')
      .eq('date', date)
  )
}
```

## 🔌 WebSocket Integration

### Real-time Service Availability
```typescript
// hooks/useServiceAvailability.ts
export function useServiceAvailability() {
  const [availability, setAvailability] = useState<ServiceAvailability>({})
  
  useEffect(() => {
    const channel = supabase
      .channel('service-availability')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'time_slots'
        },
        (payload) => {
          setAvailability(current => ({
            ...current,
            [payload.new.date]: payload.new.available_slots
          }))
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return availability
}

// Usage in calendar
function BookingCalendar() {
  const availability = useServiceAvailability()
  
  return (
    <Calendar
      disabledDates={Object.entries(availability)
        .filter(([_, slots]) => slots.length === 0)
        .map(([date]) => new Date(date))
      }
    />
  )
}
```

### Live Price Updates
```typescript
// hooks/useLivePricing.ts
export function useLivePricing(serviceType: ServiceType) {
  const [pricing, setPricing] = useState<ServicePricing | null>(null)
  
  useEffect(() => {
    const channel = supabase
      .channel('pricing-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'service_pricing',
          filter: `service_type=eq.${serviceType}`
        },
        (payload) => {
          setPricing(payload.new)
        }
      )
      .subscribe()

    // Initial fetch
    supabase
      .from('service_pricing')
      .select('*')
      .eq('service_type', serviceType)
      .single()
      .then(({ data }) => {
        if (data) setPricing(data)
      })

    return () => {
      channel.unsubscribe()
    }
  }, [serviceType])

  return pricing
}
```

### Admin Notifications
```typescript
// hooks/useAdminNotifications.ts
export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  
  useEffect(() => {
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'broadcast',
        { event: 'notification' },
        ({ payload }) => {
          setNotifications(current => [payload, ...current])
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return notifications
}

// Usage in admin dashboard
function AdminDashboard() {
  const notifications = useAdminNotifications()
  
  return (
    <div>
      <NotificationList
        notifications={notifications}
        onDismiss={(id) => {
          // Mark as read in Supabase
        }}
      />
    </div>
  )
}
```

## 📦 Enhanced Caching Strategies

### Hierarchical Cache
```typescript
// lib/cache/hierarchicalCache.ts
type CacheLevel = 'memory' | 'localStorage' | 'indexedDB'

export class HierarchicalCache {
  private memoryCache: Map<string, any>
  private levelConfigs: Record<CacheLevel, { ttl: number }>
  
  constructor(configs: Partial<Record<CacheLevel, { ttl: number }>>) {
    this.memoryCache = new Map()
    this.levelConfigs = {
      memory: { ttl: 5 * 60 * 1000 }, // 5 minutes
      localStorage: { ttl: 60 * 60 * 1000 }, // 1 hour
      indexedDB: { ttl: 24 * 60 * 60 * 1000 }, // 1 day
      ...configs
    }
  }
  
  async get<T>(key: string): Promise<T | null> {
    // Try memory first
    const memoryData = this.memoryCache.get(key)
    if (this.isValid(memoryData, 'memory')) {
      return memoryData.value
    }
    
    // Try localStorage
    const localData = localStorage.getItem(key)
    if (localData) {
      const parsed = JSON.parse(localData)
      if (this.isValid(parsed, 'localStorage')) {
        // Promote to memory
        this.memoryCache.set(key, {
          value: parsed.value,
          timestamp: Date.now()
        })
        return parsed.value
      }
    }
    
    // Try IndexedDB
    const dbData = await this.getFromIndexedDB(key)
    if (dbData && this.isValid(dbData, 'indexedDB')) {
      // Promote to memory and localStorage
      this.memoryCache.set(key, {
        value: dbData.value,
        timestamp: Date.now()
      })
      localStorage.setItem(key, JSON.stringify({
        value: dbData.value,
        timestamp: Date.now()
      }))
      return dbData.value
    }
    
    return null
  }
  
  async set(key: string, value: any): Promise<void> {
    const timestamp = Date.now()
    
    // Set in all levels
    this.memoryCache.set(key, { value, timestamp })
    localStorage.setItem(key, JSON.stringify({ value, timestamp }))
    await this.setInIndexedDB(key, { value, timestamp })
  }
  
  private isValid(
    data: { value: any, timestamp: number } | null,
    level: CacheLevel
  ): boolean {
    if (!data) return false
    
    const ttl = this.levelConfigs[level].ttl
    return (Date.now() - data.timestamp) < ttl
  }
  
  private async getFromIndexedDB(key: string) {
    // IndexedDB implementation
  }
  
  private async setInIndexedDB(
    key: string,
    data: { value: any, timestamp: number }
  ) {
    // IndexedDB implementation
  }
}

// Usage example
const cache = new HierarchicalCache({
  memory: { ttl: 1 * 60 * 1000 }, // 1 minute
  localStorage: { ttl: 30 * 60 * 1000 }, // 30 minutes
  indexedDB: { ttl: 7 * 24 * 60 * 60 * 1000 } // 1 week
})

async function getServiceDetails(id: string) {
  const cached = await cache.get(`service-${id}`)
  if (cached) return cached
  
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()
    
  if (data) {
    await cache.set(`service-${id}`, data)
  }
  
  return data
}
```

### Prefetching Strategy
```typescript
// lib/prefetch/servicePrefetcher.ts
export class ServicePrefetcher {
  private prefetchQueue: Set<string>
  private processing: boolean
  
  constructor() {
    this.prefetchQueue = new Set()
    this.processing = false
  }
  
  enqueue(serviceId: string) {
    this.prefetchQueue.add(serviceId)
    
    if (!this.processing) {
      this.processQueue()
    }
  }
  
  private async processQueue() {
    if (this.processing) return
    this.processing = true
    
    try {
      const promises = Array.from(this.prefetchQueue).map(id =>
        this.prefetchService(id)
      )
      
      await Promise.all(promises)
      this.prefetchQueue.clear()
    } finally {
      this.processing = false
    }
  }
  
  private async prefetchService(id: string) {
    const cached = await cache.get(`service-${id}`)
    if (cached) return
    
    try {
      const { data } = await supabase
        .from('services')
        .select(`
          *,
          pricing (*),
          availability (*),
          reviews (
            rating,
            comment
          )
        `)
        .eq('id', id)
        .single()
        
      if (data) {
        await cache.set(`service-${id}`, data)
      }
    } catch (error) {
      console.error('Prefetch failed:', error)
    }
  }
}

// Usage in service list
function ServiceList() {
  const prefetcher = useMemo(() => new ServicePrefetcher(), [])
  
  return (
    <div>
      {services.map(service => (
        <ServiceCard
          key={service.id}
          service={service}
          onMouseEnter={() => prefetcher.enqueue(service.id)}
        />
      ))}
    </div>
  )
}
```

### Background Sync
```typescript
// lib/sync/backgroundSync.ts
interface SyncTask {
  id: string
  type: 'create' | 'update' | 'delete'
  table: string
  data: any
  retryCount: number
}

export class BackgroundSync {
  private syncQueue: SyncTask[]
  private maxRetries: number
  
  constructor(maxRetries = 3) {
    this.syncQueue = []
    this.maxRetries = maxRetries
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sync-worker.js')
    }
  }
  
  async enqueue(task: Omit<SyncTask, 'retryCount'>) {
    this.syncQueue.push({ ...task, retryCount: 0 })
    
    // Try immediate sync
    await this.sync()
    
    // Register background sync
    if ('serviceWorker' in navigator && 'sync' in registration) {
      await registration.sync.register('sync-bookings')
    }
  }
  
  async sync() {
    const tasks = [...this.syncQueue]
    this.syncQueue = []
    
    for (const task of tasks) {
      try {
        await this.processTask(task)
      } catch (error) {
        if (task.retryCount < this.maxRetries) {
          this.syncQueue.push({
            ...task,
            retryCount: task.retryCount + 1
          })
        } else {
          // Log failed task
          console.error('Sync failed:', task, error)
        }
      }
    }
  }
  
  private async processTask(task: SyncTask) {
    switch (task.type) {
      case 'create':
        await supabase
          .from(task.table)
          .insert(task.data)
        break
      
      case 'update':
        await supabase
          .from(task.table)
          .update(task.data)
          .eq('id', task.id)
        break
      
      case 'delete':
        await supabase
          .from(task.table)
          .delete()
          .eq('id', task.id)
        break
    }
  }
}

// Service worker implementation
// public/sync-worker.js
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bookings') {
    event.waitUntil(backgroundSync.sync())
  }
})

// Usage example
const backgroundSync = new BackgroundSync()

async function updateBooking(id: string, data: Partial<Booking>) {
  // Update optimistically
  queryClient.setQueryData(['booking', id], (old: Booking) => ({
    ...old,
    ...data
  }))
  
  // Enqueue for sync
  await backgroundSync.enqueue({
    id,
    type: 'update',
    table: 'bookings',
    data
  })
}
```

## 📱 Offline Support

### IndexedDB Implementation
```typescript
// lib/db/indexedDB.ts
interface DBConfig {
  name: string
  version: number
  stores: {
    name: string
    keyPath: string
    indexes?: { name: string, keyPath: string }[]
  }[]
}

export class IndexedDBManager {
  private db: IDBDatabase | null = null
  private config: DBConfig
  
  constructor(config: DBConfig) {
    this.config = config
  }
  
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.name, this.config.version)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        this.config.stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, {
              keyPath: store.keyPath
            })
            
            store.indexes?.forEach(index => {
              objectStore.createIndex(index.name, index.keyPath)
            })
          }
        })
      }
    })
  }
  
  async get<T>(storeName: string, key: string): Promise<T | null> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }
  
  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }
  
  async put(storeName: string, value: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(value)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
  
  async delete(storeName: string, key: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

// Initialize database
const db = new IndexedDBManager({
  name: 'love4detailing',
  version: 1,
  stores: [
    {
      name: 'bookings',
      keyPath: 'id',
      indexes: [
        { name: 'status', keyPath: 'status' },
        { name: 'date', keyPath: 'date' }
      ]
    },
    {
      name: 'services',
      keyPath: 'id'
    },
    {
      name: 'user_data',
      keyPath: 'id'
    }
  ]
})

// Usage in app
await db.initialize()
```

### Offline Data Sync
```typescript
// lib/sync/offlineSync.ts
interface SyncState {
  lastSync: number
  pendingChanges: number
}

export class OfflineSync {
  private db: IndexedDBManager
  private syncState: SyncState = {
    lastSync: 0,
    pendingChanges: 0
  }
  
  constructor(db: IndexedDBManager) {
    this.db = db
  }
  
  async initialize() {
    // Load sync state
    const state = await this.db.get<SyncState>('user_data', 'sync_state')
    if (state) {
      this.syncState = state
    }
    
    // Listen for online/offline events
    window.addEventListener('online', () => this.onOnline())
    window.addEventListener('offline', () => this.onOffline())
  }
  
  private async onOnline() {
    await this.syncPendingChanges()
  }
  
  private async onOffline() {
    // Update UI to show offline mode
    toast.warning('You are offline. Changes will sync when connection returns.')
  }
  
  async syncPendingChanges() {
    const bookings = await this.db.getAll<Booking>('bookings')
    const pendingBookings = bookings.filter(b => b.pendingSync)
    
    for (const booking of pendingBookings) {
      try {
        await this.syncBooking(booking)
        await this.db.put('bookings', {
          ...booking,
          pendingSync: false
        })
        
        this.syncState.pendingChanges--
      } catch (error) {
        console.error('Failed to sync booking:', error)
      }
    }
    
    // Update sync state
    await this.db.put('user_data', {
      id: 'sync_state',
      ...this.syncState,
      lastSync: Date.now()
    })
  }
  
  private async syncBooking(booking: Booking) {
    const { data, error } = await supabase
      .from('bookings')
      .upsert(booking)
      .select()
      .single()
      
    if (error) throw error
    return data
  }
}
```

### Service Worker Implementation
```typescript
// public/service-worker.ts
/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { BackgroundSyncPlugin } from 'workbox-background-sync'

declare const self: ServiceWorkerGlobalScope

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST)

// Cache static assets
registerRoute(
  ({ request }) => request.destination === 'style' ||
                   request.destination === 'script' ||
                   request.destination === 'font',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
)

// Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
)

// API routes with network-first strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60 // 24 hours
      })
    ]
  })
)

// Background sync for bookings
const bgSyncPlugin = new BackgroundSyncPlugin('bookings-sync-queue', {
  maxRetentionTime: 24 * 60 // 24 hours in minutes
})

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/bookings'),
  new NetworkFirst({
    cacheName: 'bookings-cache',
    plugins: [bgSyncPlugin]
  }),
  'POST'
)

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json()
  
  const options = {
    body: data.body,
    icon: '/icons/notification-icon.png',
    badge: '/icons/badge-icon.png',
    data: {
      url: data.url
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.notification.data?.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    )
  }
})
```

### Offline-First Components
```typescript
// hooks/useOfflineAware.ts
export function useOfflineAware() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  return isOnline
}

// components/OfflineIndicator.tsx
export function OfflineIndicator() {
  const isOnline = useOfflineAware()
  
  if (isOnline) return null
  
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
      <div className="flex items-center gap-2">
        <WifiOffIcon className="w-4 h-4" />
        <span>You are offline. Changes will sync when connection returns.</span>
      </div>
    </div>
  )
}

// components/OfflineAwareButton.tsx
interface OfflineAwareButtonProps extends ButtonProps {
  requiresOnline?: boolean
  offlineDisabledMessage?: string
}

export function OfflineAwareButton({
  requiresOnline = true,
  offlineDisabledMessage = 'This action requires an internet connection',
  ...props
}: OfflineAwareButtonProps) {
  const isOnline = useOfflineAware()
  
  if (!isOnline && requiresOnline) {
    return (
      <Tooltip content={offlineDisabledMessage}>
        <span>
          <Button
            {...props}
            disabled
            className={cn(props.className, 'cursor-not-allowed')}
          />
        </span>
      </Tooltip>
    )
  }
  
  return <Button {...props} />
}
```

This implementation provides:
1. Complete offline support with:
   - IndexedDB for data persistence
   - Offline data synchronization
   - Background sync via Service Worker
2. Enhanced Service Worker with:
   - Static asset caching
   - API route caching
   - Push notifications
   - Offline-first components

Would you like me to:
1. Add more about push notifications?
2. Expand the offline UI components?
3. Add more about data synchronization strategies?
4. Include performance monitoring?
5. Add more about error handling in offline mode?

Let me know what aspect you'd like to explore next.

## 📊 Performance Monitoring

### Core Web Vitals Tracking
```typescript
// lib/monitoring/webVitals.ts
import { onCLS, onFID, onLCP, onTTFB } from 'web-vitals'

export function reportWebVitals(metric: any) {
  const body = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType
  }
  
  // Send to analytics
  if (process.env.NEXT_PUBLIC_ANALYTICS_ID) {
    window.gtag('event', metric.name, body)
  }
  
  // Send to custom endpoint
  fetch('/api/vitals', {
    method: 'POST',
    body: JSON.stringify(body)
  })
}

export function initWebVitals() {
  onCLS(reportWebVitals)
  onFID(reportWebVitals)
  onLCP(reportWebVitals)
  onTTFB(reportWebVitals)
}
```

### Performance Monitoring Hook
```typescript
// hooks/usePerformanceMonitor.ts
interface PerformanceMetrics {
  timeToFirstByte: number
  firstContentfulPaint: number
  domInteractive: number
  loadComplete: number
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      const navigationEntry = entries.find(
        entry => entry.entryType === 'navigation'
      ) as PerformanceNavigationTiming
      
      if (navigationEntry) {
        setMetrics({
          timeToFirstByte: navigationEntry.responseStart - navigationEntry.requestStart,
          firstContentfulPaint: navigationEntry.domContentLoadedEventEnd - navigationEntry.requestStart,
          domInteractive: navigationEntry.domInteractive - navigationEntry.requestStart,
          loadComplete: navigationEntry.loadEventEnd - navigationEntry.requestStart
        })
      }
    })
    
    observer.observe({ entryTypes: ['navigation'] })
    
    return () => observer.disconnect()
  }, [])
  
  return metrics
}

// Usage in layout
function RootLayout({ children }: { children: React.ReactNode }) {
  const metrics = usePerformanceMonitor()
  
  useEffect(() => {
    if (metrics && metrics.loadComplete > 3000) {
      // Alert if page load is slow
      console.warn('Slow page load detected:', metrics)
    }
  }, [metrics])
  
  return children
}
```

### Resource Timing
```typescript
// lib/monitoring/resourceTiming.ts
interface ResourceMetrics {
  url: string
  duration: number
  initiatorType: string
  transferSize: number
}

export function monitorResourceTiming() {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries() as PerformanceResourceTiming[]
    
    const metrics: ResourceMetrics[] = entries.map(entry => ({
      url: entry.name,
      duration: entry.duration,
      initiatorType: entry.initiatorType,
      transferSize: entry.transferSize
    }))
    
    // Filter slow resources
    const slowResources = metrics.filter(m => m.duration > 1000)
    
    if (slowResources.length > 0) {
      console.warn('Slow resources detected:', slowResources)
    }
    
    // Report to analytics
    metrics.forEach(metric => {
      window.gtag('event', 'resource_timing', metric)
    })
  })
  
  observer.observe({ entryTypes: ['resource'] })
}
```

## 🚨 Error Handling in Offline Mode

### Offline Error Boundary
```typitten
// components/ErrorBoundary/OfflineErrorBoundary.tsx
interface OfflineErrorState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class OfflineErrorBoundary extends React.Component<
  { children: React.ReactNode },
  OfflineErrorState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })
    
    // Store error for offline sync
    if (navigator.onLine) {
      // Send to error reporting service
      reportError(error, errorInfo)
    } else {
      // Store for later
      storeErrorForSync({
        error: error.toString(),
        errorInfo: errorInfo.componentStack,
        timestamp: Date.now()
      })
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-lg bg-destructive/10">
          <h3 className="text-lg font-semibold text-destructive">
            Something went wrong
          </h3>
          <p className="mt-2 text-muted-foreground">
            {navigator.onLine
              ? "We've logged this error and will fix it soon"
              : "You're offline. We'll report this error when you're back online"}
          </p>
          <div className="mt-4">
            <Button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

### Offline Error Queue
```typescript
// lib/error/offlineErrorQueue.ts
interface StoredError {
  error: string
  errorInfo: string
  timestamp: number
}

export class OfflineErrorQueue {
  private db: IndexedDBManager
  private queue: StoredError[] = []
  
  constructor(db: IndexedDBManager) {
    this.db = db
  }
  
  async initialize() {
    // Load stored errors
    const errors = await this.db.getAll<StoredError>('errors')
    this.queue = errors
    
    // Listen for online status
    window.addEventListener('online', () => this.processQueue())
  }
  
  async storeError(error: StoredError) {
    this.queue.push(error)
    await this.db.put('errors', error)
  }
  
  private async processQueue() {
    if (!navigator.onLine) return
    
    const errors = [...this.queue]
    this.queue = []
    
    for (const error of errors) {
      try {
        await reportError(error)
        await this.db.delete('errors', error.timestamp.toString())
      } catch (e) {
        console.error('Failed to report error:', e)
        // Re-queue for next attempt
        this.queue.push(error)
      }
    }
  }
}

// Initialize queue
const errorQueue = new OfflineErrorQueue(db)
await errorQueue.initialize()

// Usage
export function storeErrorForSync(error: StoredError) {
  return errorQueue.storeError(error)
}
```

### Offline Error UI Components
```typescript
// components/OfflineError/ErrorCard.tsx
interface ErrorCardProps {
  error: StoredError
  onRetry: () => void
  onDismiss: () => void
}

export function ErrorCard({ error, onRetry, onDismiss }: ErrorCardProps) {
  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold">Error occurred while offline</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(error.timestamp).toLocaleString()}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          <XIcon className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="mt-4">
        <p className="text-sm font-mono bg-muted p-2 rounded">
          {error.error}
        </p>
      </div>
      
      <div className="mt-4 flex gap-2">
        <Button size="sm" onClick={onRetry}>
          Retry
        </Button>
        <Button variant="outline" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  )
}

// components/OfflineError/ErrorList.tsx
export function ErrorList() {
  const [errors, setErrors] = useState<StoredError[]>([])
  
  useEffect(() => {
    // Load errors from IndexedDB
    db.getAll<StoredError>('errors').then(setErrors)
  }, [])
  
  const handleRetry = async (error: StoredError) => {
    try {
      await reportError(error)
      await db.delete('errors', error.timestamp.toString())
      setErrors(current => current.filter(e => e.timestamp !== error.timestamp))
    } catch (e) {
      toast.error('Failed to report error. Will try again later.')
    }
  }
  
  const handleDismiss = async (error: StoredError) => {
    await db.delete('errors', error.timestamp.toString())
    setErrors(current => current.filter(e => e.timestamp !== error.timestamp))
  }
  
  if (errors.length === 0) return null
  
  return (
    <div className="space-y-4">
      {errors.map(error => (
        <ErrorCard
          key={error.timestamp}
          error={error}
          onRetry={() => handleRetry(error)}
          onDismiss={() => handleDismiss(error)}
        />
      ))}
    </div>
  )
}
```

This implementation provides:
1. Comprehensive performance monitoring:
   - Core Web Vitals tracking
   - Custom performance metrics
   - Resource timing analysis
2. Robust offline error handling:
   - Offline-aware error boundary
   - Error queueing and sync
   - User-friendly error UI

Would you like me to:
1. Add more about performance optimization techniques?
2. Expand the analytics integration?
3. Add more about error recovery strategies?
4. Include A/B testing implementation?
5. Add more about monitoring dashboards?

Let me know what aspect you'd like to explore next.
