'use client';

import React from 'react';
import { FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { useBookingForm, TimeSlot } from '@/hooks/useBookingForm';
import { ClientConfig } from '@/config/schema';
import { fullBookingSchema, FullBookingFormData } from '@/lib/schemas/booking';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils/formatters';
import { format, addDays } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface ConfigurableBookingFormProps {
  config: ClientConfig;
  defaultValues?: Partial<FullBookingFormData>;
}

// This is the new, primary booking form component.
// It uses the useBookingForm hook to manage all its state and logic.
export const ConfigurableBookingForm = ({ config, defaultValues }: ConfigurableBookingFormProps) => {
  const {
    form,
    currentStep,
    totalPrice,
    isLoading,
    actions,
    availableTimeSlots,
  } = useBookingForm({
    config,
    schema: fullBookingSchema,
    defaultValues,
  });

  const isLastStep = currentStep === 3; // Step 4 is the thank you message

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StepServiceSelection config={config} />;
      case 1:
        return <StepDateTime config={config} availableTimeSlots={availableTimeSlots} isLoading={isLoading} />;
      case 2:
        return <StepContactDetails />;
      case 3:
        return <StepAddonsAndReview config={config} />;
      default:
        return <div>Thank you for your booking!</div>;
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={actions.onSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Book Your Service</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
          <CardFooter>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-bold">Total: {formatCurrency(totalPrice)}</p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-end gap-4">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={actions.prevStep} disabled={isLoading}>
                  Back
                </Button>
              )}
              <Button type={isLastStep ? 'submit' : 'button'} onClick={!isLastStep ? actions.nextStep : undefined} disabled={isLoading}>
                {isLoading ? '...' : isLastStep ? 'Book Now & Pay Later' : 'Next'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
};

// =============================================
// Step Components
// =============================================

interface StepProps {
  config: ClientConfig;
}

interface StepDateTimeProps {
    config: ClientConfig;
    availableTimeSlots: TimeSlot[];
    isLoading: boolean;
}

const StepServiceSelection = ({ config }: StepProps) => {
  return (
    <div className="space-y-4">
      <FormField
        name="serviceId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Service</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {config.pricing.services.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="vehicleSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Vehicle Size</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your vehicle size" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {config.pricing.vehicleSizes.map(size => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.name} - ({size.description})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const StepContactDetails = () => {
  const { control } = useFormContext();
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter your email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="Enter your phone number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="postcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postcode</FormLabel>
            <FormControl>
              <Input placeholder="Enter your postcode" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Address</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="vehicleLookup"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vehicle Details</FormLabel>
            <FormControl>
              <Input placeholder="Enter your vehicle registration or details" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const StepAddonsAndReview = ({ config }: StepProps) => {
  const { control, getValues } = useFormContext<FullBookingFormData>();

  const values = getValues();
  const service = config.pricing.services.find(s => s.id === values.serviceId);
  const vehicleSize = config.pricing.vehicleSizes.find(vs => vs.id === values.vehicleSize);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Add-ons</h3>
        <div className="space-y-2">
          <FormField
            control={control}
            name="addOnIds"
            render={({ field }) => (
              <>
                {config.pricing.addons.map(addon => (
                  <FormItem key={addon.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(addon.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...(field.value || []), addon.id])
                            : field.onChange(field.value?.filter(value => value !== addon.id));
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{addon.name} - {formatCurrency(addon.price)}</FormLabel>
                      <p className="text-sm text-muted-foreground">{addon.description}</p>
                    </div>
                  </FormItem>
                ))}
              </>
            )}
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Booking Summary</h3>
        <div className="space-y-2 rounded-md border p-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Service:</span> <strong>{service?.name}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Vehicle Size:</span> <strong>{vehicleSize?.name}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date:</span> <strong>{values.date}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Time:</span> <strong>{values.timeSlot}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Name:</span> <strong>{values.fullName}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email:</span> <strong>{values.email}</strong></div>
        </div>
      </div>
    </div>
  );
};

const StepDateTime = ({ config, availableTimeSlots, isLoading }: StepDateTimeProps) => {
  const { control } = useFormContext();
  const date = useWatch({ control, name: 'date' });
  
  const workingDays = config.booking.operatingHours
    .map((d, i) => d.isOpen ? (i + 1) % 7 : -1) // Convert day name to number, Sunday as 0
    .filter(d => d !== -1);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Date</FormLabel>
            <FormControl>
               <Input
                  type="date"
                  min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                  max={format(addDays(new Date(), config.booking.maxBookingDaysInAdvance), 'yyyy-MM-dd')}
                  {...field}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const selectedDate = new Date(e.target.value);
                    const dayOfWeek = selectedDate.getUTCDay();
                    if (workingDays.includes(dayOfWeek)) {
                      field.onChange(e.target.value);
                    } else {
                      // Handle invalid date selection (e.g., show a toast)
                      alert("Please select a valid working day.");
                      field.onChange(''); // Reset value
                    }
                  }}
                />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {date && (
        <FormField
          control={control}
          name="timeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Time Slot</FormLabel>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a time slot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map(slot => (
                        <SelectItem key={slot.time} value={slot.time} disabled={!slot.isAvailable}>
                          {slot.label} {!slot.isAvailable && '(Booked)'}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-slots" disabled>
                        No available slots for this day.
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}; 