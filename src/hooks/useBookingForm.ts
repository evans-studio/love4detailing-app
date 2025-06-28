import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ClientConfig } from '@/config/schema';
import { FullBookingFormData } from '@/lib/schemas/booking';
import { supabase } from '@/lib/supabase/client';

export interface TimeSlot {
  time: string;
  label: string;
  isAvailable: boolean;
}

interface UseBookingFormProps {
  config: ClientConfig;
  schema: z.ZodType<FullBookingFormData, any, any>;
  defaultValues?: Partial<FullBookingFormData>;
}

export const useBookingForm = ({ config, schema, defaultValues }: UseBookingFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  // ... other states like travelFee, availableTimeSlots, etc.

  const form = useForm<FullBookingFormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched',
  });

  const { watch, getValues, handleSubmit } = form;

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  const goToStep = (step: number) => setCurrentStep(step);

  // Watch for changes in form fields that affect pricing
  const serviceId = watch('serviceId');
  const vehicleSize = watch('vehicleSize');
  const addOnIds = watch('addOnIds');
  const date = watch('date');
  
  // Fetch available time slots when a date is selected
  useEffect(() => {
    if (!date) {
      setAvailableTimeSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setIsLoading(true);
      try {
        const selectedDate = new Date(date);
        const dayOfWeek = selectedDate.getDay(); // Sunday = 0, Monday = 1, etc.
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
        
        const operatingDay = config.booking.operatingHours.find(d => d.day === dayName);

        if (!operatingDay || !operatingDay.isOpen) {
          setAvailableTimeSlots([]);
          return;
        }
        
        // This logic should be expanded to generate slots based on open/close times and slot duration
        const defaultSlots = [
          { time: '10:00', label: '10:00 AM' },
          { time: '11:30', label: '11:30 AM' },
          { time: '13:00', label: '1:00 PM' },
          { time: '14:30', label: '2:30 PM' },
          { time: '16:00', label: '4:00 PM' },
        ];
        
        const dateString = date.split('T')[0];
        const { data: bookings } = await supabase
            .from('bookings')
            .select('service_time')
            .eq('service_date', dateString)
            .eq('status', 'confirmed');

        const bookedTimes = bookings?.map((b: any) => b.service_time) || [];

        const slotsWithAvailability = defaultSlots.map(slot => ({
          ...slot,
          isAvailable: !bookedTimes.includes(slot.time),
        }));
        
        setAvailableTimeSlots(slotsWithAvailability);

      } catch (error) {
        console.error("Error fetching time slots:", error);
        setAvailableTimeSlots([]); // Reset on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, [date, config.booking.operatingHours]);

  // Memoized calculation of the total price
  const calculateTotalPrice = useCallback(() => {
    const values = getValues();
    const { serviceId, vehicleSize, addOnIds } = values;

    if (!serviceId || !vehicleSize) return 0;

    const service = config.pricing.services.find(s => s.id === serviceId);
    if (!service) return 0;
    
    const basePrice = service.prices[vehicleSize] || 0;

    const addonsPrice = addOnIds?.reduce((total: number, id: string) => {
      const addon = config.pricing.addons.find(a => a.id === id);
      return total + (addon?.price || 0);
    }, 0) || 0;
    
    // In a future step, we'll add travel fee here.
    return basePrice + addonsPrice;
  }, [config, getValues]);

  useEffect(() => {
    const newTotal = calculateTotalPrice();
    setTotalPrice(newTotal);
  }, [serviceId, vehicleSize, addOnIds, calculateTotalPrice]);

  const onSubmit = async (data: FullBookingFormData) => {
    setIsLoading(true);
    try {
      const finalPrice = calculateTotalPrice();
      // Map form data to your Supabase table structure
      const bookingData = {
        service_id: data.serviceId,
        vehicle_size: data.vehicleSize,
        add_on_ids: data.addOnIds,
        service_date: data.date,
        service_time: data.timeSlot,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        postcode: data.postcode,
        address: data.address,
        total_price: finalPrice,
        status: 'pending', // or 'confirmed' depending on your flow
      };

      const { error } = await supabase.from('bookings').insert(bookingData);

      if (error) {
        throw error;
      }
      
      // On successful submission, go to the final step
      nextStep();

    } catch (error) {
      console.error('Booking submission failed:', error);
      // Optionally, display an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    currentStep,
    setCurrentStep,
    totalPrice,
    isLoading,
    availableTimeSlots,
    actions: {
      nextStep,
      prevStep,
      goToStep,
      onSubmit: handleSubmit(onSubmit),
    },
  };
}; 