'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'

interface Customer {
  id: string
  full_name: string
  email: string
  postcode: string
  vehicle_images?: string[]
  profile_image_url?: string
  created_at: string
  total_bookings: number
  total_spent: number
  rewards_points: number
  last_booking_date?: string
  bookings?: {
    id: string
    booking_date: string
    booking_time: string
    service: string
    total_price: number
    status: string
    vehicle_images?: string[]
  }[]
}

export function CustomersClient() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const { data: customersData, error } = await supabase
          .from('users')
          .select(`
            *,
            bookings:bookings(
              id,
              booking_date,
              booking_time,
              total_price,
              status,
              vehicle_images
            ),
            rewards:rewards(points)
          `)
          .order('created_at', { ascending: false })

        if (error) throw error

        if (customersData) {
          const processedCustomers = customersData.map(customer => ({
            ...customer,
            total_bookings: customer.bookings?.length || 0,
            total_spent: customer.bookings?.reduce((sum: number, booking: { total_price: number }) => 
              sum + (booking.total_price || 0), 0) || 0,
            rewards_points: customer.rewards?.[0]?.points || 0,
            last_booking_date: customer.bookings?.[0]?.booking_date || null
          }))
          setCustomers(processedCustomers)
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
      }
    }

    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(customer =>
    customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.postcode?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline">Export Data</Button>
      </div>

      <div className="grid gap-6">
        {filteredCustomers.map((customer) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSelectedCustomer(customer)}
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <Image
                      src={customer.profile_image_url || '/assets/default-avatar.png'}
                      alt={`${customer.full_name}'s profile`}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{customer.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">£{customer.total_spent.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{customer.total_bookings} bookings</p>
                  </div>
                  <Badge variant={customer.rewards_points > 500 ? "default" : "secondary"}>
                    {customer.rewards_points} points
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View detailed information about this customer's bookings, rewards, and vehicle images.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <ScrollArea className="max-h-[80vh]">
              <div className="space-y-6">
                {/* Customer Overview */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <Image
                      src={selectedCustomer.profile_image_url || '/assets/default-avatar.png'}
                      alt={`${selectedCustomer.full_name}'s profile`}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{selectedCustomer.full_name}</h2>
                    <p className="text-muted-foreground">{selectedCustomer.email}</p>
                    <p className="text-muted-foreground">{selectedCustomer.postcode}</p>
                  </div>
                </div>

                {/* Customer Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-2xl font-bold">£{selectedCustomer.total_spent.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-2xl font-bold">{selectedCustomer.total_bookings}</p>
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-2xl font-bold">{selectedCustomer.rewards_points}</p>
                      <p className="text-sm text-muted-foreground">Reward Points</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Booking History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Booking History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedCustomer.bookings?.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between border-b border-border py-4 last:border-0"
                        >
                          <div>
                            <p className="font-medium">{booking.service}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                              {booking.status}
                            </Badge>
                            <p className="font-medium">£{booking.total_price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Vehicle Images */}
                {selectedCustomer.vehicle_images && selectedCustomer.vehicle_images.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Vehicle Images</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedCustomer.vehicle_images.map((image, index) => (
                        <div key={index} className="relative aspect-video">
                          <Image
                            src={image}
                            alt={`Vehicle image ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 