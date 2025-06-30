'use client'

import { useBookingStore } from '@/lib/stores/booking'
import { ServiceType } from '@/lib/enums'
import { calculateBasePrice, calculateAddOnsPrice, formatPrice } from '@/lib/utils/pricing'
import { Card } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const SERVICE_PACKAGES = [
  {
    type: ServiceType.BASIC_WASH,
    title: 'Basic Wash',
    description: 'Essential car cleaning service',
    features: [
      'Exterior wash & dry',
      'Interior vacuum',
      'Dashboard clean',
      'Window clean',
      'Tire shine'
    ]
  },
  {
    type: ServiceType.FULL_VALET,
    title: 'Full Valet',
    description: 'Comprehensive cleaning inside and out',
    features: [
      'All Basic Wash features',
      'Interior deep clean',
      'Leather/upholstery clean',
      'Paint decontamination',
      'Wheel deep clean',
      'Wax protection'
    ]
  },
  {
    type: ServiceType.PREMIUM_DETAIL,
    title: 'Premium Detail',
    description: 'Professional detailing service',
    features: [
      'All Full Valet features',
      'Paint correction',
      'Ceramic coating',
      'Engine bay clean',
      'Glass polish',
      'Paint sealant'
    ]
  }
]

const ADD_ONS = [
  {
    id: 'paint-protection',
    title: 'Paint Protection',
    description: 'Long-lasting paint protection coating',
    price: 50
  },
  {
    id: 'interior-protection',
    title: 'Interior Protection',
    description: 'Fabric and leather protection treatment',
    price: 40
  },
  {
    id: 'wheel-protection',
    title: 'Wheel Protection',
    description: 'Ceramic wheel coating for lasting shine',
    price: 30
  }
] as const

type AddOn = typeof ADD_ONS[number]['id']

export function ServiceSelectionStep() {
  const store = useBookingStore()
  
  const handleServiceSelect = (type: ServiceType) => {
    store.setServiceType(type)
  }
  
  const handleAddOnToggle = (addOnId: AddOn) => {
    const currentAddOns = store.addOns as AddOn[]
    const isSelected = currentAddOns.includes(addOnId)
    
    if (isSelected) {
      store.setAddOns(currentAddOns.filter(id => id !== addOnId))
    } else {
      store.setAddOns([...currentAddOns, addOnId])
    }
  }
  
  const basePrice = store.serviceType
    ? calculateBasePrice(store.serviceType, store.vehicleSize)
    : 0
    
  const addOnsPrice = calculateAddOnsPrice(store.addOns as AddOn[], store.vehicleSize)
  const totalPrice = basePrice + addOnsPrice
  
  return (
    <div className="space-y-8">
      {/* Service Packages */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Service Package</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {SERVICE_PACKAGES.map((service) => (
            <Card
              key={service.type}
              className={`
                p-4 cursor-pointer transition-all duration-200
                ${store.serviceType === service.type
                  ? 'ring-2 ring-primary'
                  : 'hover:border-primary/50'
                }
              `}
              onClick={() => handleServiceSelect(service.type)}
            >
              <div className="space-y-2">
                <h4 className="font-medium">{service.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
                <div className="pt-2">
                  <p className="text-lg font-semibold">
                    {formatPrice(calculateBasePrice(service.type, store.vehicleSize))}
                  </p>
                </div>
                <ul className="pt-2 space-y-1">
                  {service.features.map((feature, index) => (
                    <li key={index} className="text-sm flex items-center">
                      <span className="text-primary mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Add-ons */}
      {store.serviceType && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Optional Add-ons</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {ADD_ONS.map((addOn) => {
              const isSelected = (store.addOns as AddOn[]).includes(addOn.id)
              
              return (
                <Card
                  key={addOn.id}
                  className={`
                    p-4 cursor-pointer transition-all duration-200
                    ${isSelected
                      ? 'ring-2 ring-primary'
                      : 'hover:border-primary/50'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={addOn.id}
                      checked={isSelected}
                      onCheckedChange={() => handleAddOnToggle(addOn.id)}
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor={addOn.id}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {addOn.title}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {addOn.description}
                      </p>
                      <p className="text-sm font-medium">
                        + {formatPrice(addOn.price)}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
      
      {/* Price Summary */}
      {store.serviceType && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Base Price:</span>
              <span>{formatPrice(basePrice)}</span>
            </div>
            {addOnsPrice > 0 && (
              <div className="flex justify-between text-sm">
                <span>Add-ons:</span>
                <span>{formatPrice(addOnsPrice)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
} 