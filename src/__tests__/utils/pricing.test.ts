import { calculateBasePrice, calculateAddOnsPrice, calculateTravelFee } from '@/lib/utils/pricing'
import { ServiceType, VehicleSize } from '@/lib/enums'
import { SERVICES, ADD_ONS, TRAVEL_ZONES } from '@/lib/constants/services'

describe('Pricing Utilities', () => {
  describe('calculateBasePrice', () => {
    it('should calculate correct base price for basic wash', () => {
      const price = calculateBasePrice(ServiceType.BASIC_WASH, VehicleSize.SMALL)
      expect(price).toBe(SERVICES[0].basePrice[VehicleSize.SMALL])
    })

    it('should calculate correct base price for full valet', () => {
      const price = calculateBasePrice(ServiceType.FULL_VALET, VehicleSize.MEDIUM)
      expect(price).toBe(SERVICES[1].basePrice[VehicleSize.MEDIUM])
    })

    it('should calculate correct base price for premium detail', () => {
      const price = calculateBasePrice(ServiceType.PREMIUM_DETAIL, VehicleSize.LARGE)
      expect(price).toBe(SERVICES[2].basePrice[VehicleSize.LARGE])
    })

    it('should return 0 for invalid service type', () => {
      const price = calculateBasePrice('invalid' as ServiceType, VehicleSize.SMALL)
      expect(price).toBe(0)
    })
  })

  describe('calculateAddOnsPrice', () => {
    it('should calculate correct price for single add-on', () => {
      const addOnIds = ['ceramic-boost']
      const price = calculateAddOnsPrice(addOnIds, VehicleSize.SMALL)
      expect(price).toBe(ADD_ONS[0].price[VehicleSize.SMALL])
    })

    it('should calculate correct price for multiple add-ons', () => {
      const addOnIds = ['ceramic-boost', 'interior-sanitize']
      const price = calculateAddOnsPrice(addOnIds, VehicleSize.MEDIUM)
      const expectedPrice = ADD_ONS[0].price[VehicleSize.MEDIUM] + ADD_ONS[1].price[VehicleSize.MEDIUM]
      expect(price).toBe(expectedPrice)
    })

    it('should return 0 for empty add-ons array', () => {
      const price = calculateAddOnsPrice([], VehicleSize.SMALL)
      expect(price).toBe(0)
    })

    it('should ignore invalid add-on IDs', () => {
      const addOnIds = ['invalid-addon', 'ceramic-boost']
      const price = calculateAddOnsPrice(addOnIds, VehicleSize.SMALL)
      expect(price).toBe(ADD_ONS[0].price[VehicleSize.SMALL])
    })
  })

  describe('calculateTravelFee', () => {
    it('should return 0 for Zone 1 postcodes', () => {
      const fee = calculateTravelFee('BN1 1AA')
      expect(fee).toBe(0)
    })

    it('should return correct fee for Zone 2 postcodes', () => {
      const fee = calculateTravelFee('BN41 1AA')
      expect(fee).toBe(TRAVEL_ZONES[1].fee)
    })

    it('should return correct fee for Zone 3 postcodes', () => {
      const fee = calculateTravelFee('BN5 1AA')
      expect(fee).toBe(TRAVEL_ZONES[2].fee)
    })

    it('should handle postcode with lowercase letters', () => {
      const fee = calculateTravelFee('bn1 1aa')
      expect(fee).toBe(0)
    })

    it('should handle postcode without space', () => {
      const fee = calculateTravelFee('BN11AA')
      expect(fee).toBe(0)
    })

    it('should return maximum fee for unknown postcode', () => {
      const fee = calculateTravelFee('XX1 1AA')
      const maxFee = Math.max(...TRAVEL_ZONES.map(zone => zone.fee))
      expect(fee).toBe(maxFee)
    })
  })
}) 