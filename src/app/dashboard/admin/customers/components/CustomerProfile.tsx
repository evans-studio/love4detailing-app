'use client'

import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Users, Mail, Phone, Calendar, Car, MapPin, Award, CreditCard } from 'lucide-react'
import { CustomerProfile as CustomerProfileType } from '../types'

interface CustomerProfileProps {
  customer: CustomerProfileType
}

export function CustomerProfile({ customer }: CustomerProfileProps) {
  const getCustomerStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-500' : 'bg-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-sm">{customer.full_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-sm flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>{customer.email}</span>
              </p>
            </div>
            {customer.phone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-sm flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phone}</span>
                </p>
              </div>
            )}
            {customer.postcode && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Postcode</label>
                <p className="text-sm flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{customer.postcode}</span>
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="flex items-center space-x-2">
                <Badge className={getCustomerStatusColor(customer.status)}>
                  {customer.status}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <p className="text-sm flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(customer.created_at), 'PPP')}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5" />
              <span>Vehicle Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.vehicle_make ? (
              <>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Make</label>
                  <p className="text-sm">{customer.vehicle_make}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Model</label>
                  <p className="text-sm">{customer.vehicle_model}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Color</label>
                  <p className="text-sm">{customer.vehicle_color}</p>
                </div>
                {customer.vehicle_reg && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Registration</label>
                    <p className="text-sm">{customer.vehicle_reg}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No vehicle information available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{customer.total_bookings}</div>
                <p className="text-xs text-muted-foreground">Total Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">£{customer.total_spent.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{customer.loyalty_points}</div>
                <p className="text-xs text-muted-foreground">Loyalty Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {customer.bookings.length > 0 ? (
            <div className="space-y-3">
              {customer.bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{booking.service}</span>
                      <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(booking.booking_date), 'PPP')} at {booking.booking_time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">£{booking.total_price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No bookings found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 