'use client'

import { useState } from 'react'
import { useBookingStore } from '@/lib/stores/booking'
import { format } from 'date-fns'
import { formatPrice } from '@/lib/utils/pricing'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'

export function ConfirmationStep() {
  const store = useBookingStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vehicle: store.vehicle,
          vehicleSize: store.vehicleSize,
          vehicleImages: store.vehicleImages,
          serviceType: store.serviceType,
          addOns: store.addOns,
          date: store.date,
          timeSlot: store.timeSlot,
          fullName: store.fullName,
          email: store.email,
          phone: store.phone,
          postcode: store.postcode,
          address: store.address,
          pricing: {
            basePrice: store.basePrice,
            addOnsPrice: store.addOnsPrice,
            travelFee: store.travelFee,
            totalPrice: store.totalPrice
          }
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create booking')
      }
      
      // Reset store after successful booking
      store.reset()
      
      // Redirect to success page
      window.location.href = '/booking/success'
      
    } catch (error) {
      console.error('Error creating booking:', error)
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="space-y-8">
      {/* Vehicle Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-muted-foreground">Registration</dt>
            <dd className="font-medium">{store.vehicle?.registration}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Make & Model</dt>
            <dd className="font-medium">
              {store.vehicle?.make} {store.vehicle?.model}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Year</dt>
            <dd className="font-medium">{store.vehicle?.year}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Size</dt>
            <dd className="font-medium">{store.vehicleSize}</dd>
          </div>
        </dl>
      </Card>
      
      {/* Service Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Service Details</h3>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-muted-foreground">Service Type</dt>
            <dd className="font-medium">{store.serviceType}</dd>
          </div>
          {store.addOns.length > 0 && (
            <div>
              <dt className="text-sm text-muted-foreground">Add-ons</dt>
              <dd>
                <ul className="mt-1 space-y-1">
                  {store.addOns.map((addOn) => (
                    <li key={addOn} className="font-medium">
                      {addOn}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </Card>
      
      {/* Date & Time */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Appointment</h3>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-muted-foreground">Date</dt>
            <dd className="font-medium">
              {format(new Date(store.date!), 'EEEE, MMMM d, yyyy')}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Time</dt>
            <dd className="font-medium">{store.timeSlot}</dd>
          </div>
        </dl>
      </Card>
      
      {/* Contact Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-muted-foreground">Name</dt>
            <dd className="font-medium">{store.fullName}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Email</dt>
            <dd className="font-medium">{store.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Phone</dt>
            <dd className="font-medium">{store.phone}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Postcode</dt>
            <dd className="font-medium">{store.postcode}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-sm text-muted-foreground">Address</dt>
            <dd className="font-medium">{store.address}</dd>
          </div>
        </dl>
      </Card>
      
      {/* Price Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Price Summary</h3>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Base Price</dt>
            <dd className="font-medium">{formatPrice(store.basePrice)}</dd>
          </div>
          {store.addOnsPrice > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Add-ons</dt>
              <dd className="font-medium">{formatPrice(store.addOnsPrice)}</dd>
            </div>
          )}
          {store.travelFee > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Travel Fee</dt>
              <dd className="font-medium">{formatPrice(store.travelFee)}</dd>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t text-lg">
            <dt className="font-semibold">Total</dt>
            <dd className="font-semibold">{formatPrice(store.totalPrice)}</dd>
          </div>
        </dl>
      </Card>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming Booking...
            </>
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </div>
    </div>
  )
} 