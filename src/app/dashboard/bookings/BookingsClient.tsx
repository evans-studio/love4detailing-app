'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProtectedRoute } from '@/lib/auth'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Plus
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

interface Booking {
  id: string
  booking_date: string
  booking_time: string
  service: string
  total_price: number
  status: string
  vehicle_images: string[]
  postcode: string
  notes?: string
  created_at: string
  vehicle_make: string
  vehicle_model: string
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded animate-pulse w-32" />
              <div className="h-4 bg-muted rounded animate-pulse w-48" />
            </div>
            <div className="h-8 bg-muted rounded animate-pulse w-24" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

const BookingCard = ({ booking }: { booking: Booking }) => {
  const { toast } = useToast()
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500'
      case 'pending': return 'bg-platinum-silver'
      case 'completed': return 'bg-blue-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <Card className="border-l-4 border-l-primary hover:bg-muted/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium capitalize text-sm sm:text-base truncate">{booking.service}</h3>
              <Badge variant="outline" className={getStatusColor(booking.status)}>
                {getStatusIcon(booking.status)}
                <span className="ml-1">{booking.status}</span>
              </Badge>
            </div>
            
            <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{format(new Date(booking.booking_date), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{booking.booking_time}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{booking.postcode}</span>
              </div>
            </div>
            
            {booking.notes && (
              <p className="text-xs sm:text-sm text-muted-foreground italic">
                Notes: {booking.notes}
              </p>
            )}
            
            <p className="text-xs text-muted-foreground">
              Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy')}
            </p>
          </div>
          
          <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right space-x-2 sm:space-x-0 sm:space-y-2">
            <p className="text-lg font-bold">£{booking.total_price.toFixed(2)}</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: `Booking Details - ${booking.service}`,
                  description: `${format(new Date(booking.booking_date), 'PPP')} at ${booking.booking_time} • £${booking.total_price.toFixed(2)}`,
                })
              }}
              className="touch-target"
            >
              <Eye className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">View Details</span>
            </Button>
          </div>
        </div>
        
        {/* Vehicle Images */}
        {booking.vehicle_images && booking.vehicle_images.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Vehicle Photos:</p>
            <div className="flex space-x-2 overflow-x-auto">
              {booking.vehicle_images.slice(0, 3).map((image, index) => (
                <div key={index} className="flex-shrink-0">
                  <Image
                    src={image}
                    alt={`Vehicle ${index + 1}`}
                    width={120}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </div>
              ))}
              {booking.vehicle_images.length > 3 && (
                <div className="flex-shrink-0 w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                  +{booking.vehicle_images.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function BookingsClient() {
  const { user, isLoading: authLoading } = useProtectedRoute()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchBookings = useCallback(async () => {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: false })

      if (error) throw error
      setBookings(bookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  if (authLoading || isLoading) {
    return <LoadingSkeleton />
  }

  const now = new Date()
  const upcomingBookings = bookings.filter(b => new Date(b.booking_date) >= now)
  const pastBookings = bookings.filter(b => new Date(b.booking_date) < now)
  const totalSpent = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
  const completedBookings = bookings.filter(b => b.status === 'completed').length

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-sm text-muted-foreground">View and manage your car service bookings</p>
        </div>
        
        <div className="flex justify-end">
          <Button asChild size="sm" className="w-full sm:w-auto touch-target">
            <Link href="/dashboard/book-service">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Book New </span>Service
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500 rounded-full">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {bookings.length}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Total Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-500 rounded-full">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold text-green-700 dark:text-green-300">
                  {completedBookings}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-500 rounded-full">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {upcomingBookings.length}
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-500 rounded-full">
                <Car className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg sm:text-2xl font-bold text-purple-700 dark:text-purple-300 truncate">
                  £{totalSpent.toFixed(0)}
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bookings Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastBookings.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All Bookings ({bookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No upcoming bookings</h3>
                  <p className="text-muted-foreground mb-4">
                    Book your next car service to keep your vehicle in perfect condition
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/book-service">Book Your Next Service</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No past bookings</h3>
                  <p className="text-muted-foreground">
                    Your completed services will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by booking your first car service
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/book-service">Book Your First Service</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
} 