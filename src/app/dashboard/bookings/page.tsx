"use client"

import { useEffect, useState } from 'react'
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

export default function CustomerBookingsPage() {
  const { user, isLoading: authLoading } = useProtectedRoute()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  async function fetchBookings() {
    try {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user?.id)
        .order('booking_date', { ascending: false })

      if (data) {
        setBookings(data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
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

  const now = new Date()
  const upcomingBookings = bookings.filter(b => new Date(b.booking_date) >= now)
  const pastBookings = bookings.filter(b => new Date(b.booking_date) < now)

  const totalSpent = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
  const completedBookings = bookings.filter(b => b.status === 'completed').length

  if (authLoading || isLoading) {
    return <LoadingSkeleton />
  }

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium capitalize">{booking.service}</h3>
              <Badge className={getStatusColor(booking.status)}>
                {getStatusIcon(booking.status)}
                <span className="ml-1">{booking.status}</span>
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(booking.booking_date), 'PPP')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{booking.booking_time}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{booking.postcode}</span>
              </div>
            </div>
            {booking.notes && (
              <p className="text-sm text-muted-foreground italic">
                Notes: {booking.notes}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Booked on {format(new Date(booking.created_at), 'PP')}
            </p>
          </div>
          <div className="text-right space-y-2">
            <p className="text-lg font-bold">£{booking.total_price.toFixed(2)}</p>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View Details
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
                  <img
                    src={image}
                    alt={`Vehicle ${index + 1}`}
                    className="w-16 h-16 object-cover rounded"
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your car service bookings</p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/book-service">
            <Plus className="mr-2 h-4 w-4" />
            Book New Service
          </Link>
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{bookings.length}</div>
                <p className="text-xs text-muted-foreground">Total Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{completedBookings}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{upcomingBookings.length}</div>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Car className="h-4 w-4 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">£{totalSpent.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
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