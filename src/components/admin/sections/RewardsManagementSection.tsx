'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { REWARDS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils/formatters'

// Rewards configuration schema
const rewardsConfigSchema = z.object({
  pointsEarning: z.object({
    booking: z.number().min(0),
    review: z.number().min(0),
    referral: z.number().min(0),
    socialShare: z.number().min(0),
    firstBooking: z.number().min(0),
  }),
  redemptions: z.object({
    discount10: z.object({
      points: z.number().min(0),
      value: z.number().min(0),
      type: z.string(),
    }),
    discount20: z.object({
      points: z.number().min(0),
      value: z.number().min(0),
      type: z.string(),
    }),
    freeAddOn: z.object({
      points: z.number().min(0),
      value: z.number().min(0),
      type: z.string(),
    }),
    freeDetail: z.object({
      points: z.number().min(0),
      value: z.number().min(0),
      type: z.string(),
    }),
  }),
})

type RewardsConfigValues = z.infer<typeof rewardsConfigSchema>

// Tier configuration schema
const tierConfigSchema = z.object({
  id: z.string().min(1, "Tier ID is required"),
  name: z.string().min(1, "Tier name is required"),
  threshold: z.number().min(0, "Threshold must be positive"),
  benefits: z.array(z.string()).min(1, "At least one benefit is required"),
  discountPercentage: z.number().min(0).max(100, "Discount must be between 0 and 100"),
})

type TierConfigValues = z.infer<typeof tierConfigSchema>

interface RewardsManagementSectionProps {
  adminId: string
  adminRole: 'admin' | 'staff' | 'manager'
}

export const RewardsManagementSection: React.FC<RewardsManagementSectionProps> = ({
  adminId,
  adminRole,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  // Rewards config form setup
  const rewardsForm = useForm<RewardsConfigValues>({
    resolver: zodResolver(rewardsConfigSchema),
    defaultValues: {
      pointsEarning: REWARDS.pointsEarning,
      redemptions: REWARDS.redemptions,
    },
  })

  // Tier config form setup
  const tierForm = useForm<TierConfigValues>({
    resolver: zodResolver(tierConfigSchema),
  })

  // Handle rewards config update
  const handleRewardsUpdate = async (data: RewardsConfigValues) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/rewards/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update rewards configuration')
    } catch (error) {
      console.error('Error updating rewards configuration:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle tier update
  const handleTierUpdate = async (data: TierConfigValues) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/rewards/tiers/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update tier')

      // Reset form and selection
      tierForm.reset()
      setSelectedTier(null)
    } catch (error) {
      console.error('Error updating tier:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Rewards Program</h2>
        <p className="text-muted-foreground">
          Configure loyalty program settings and tiers
        </p>
      </div>

      {/* Rewards Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Points Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={rewardsForm.handleSubmit(handleRewardsUpdate)} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Points Earning</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-[var(--color-text)]">Booking Points</label>
                  <Input
                    type="number"
                    step="1"
                    {...rewardsForm.register('pointsEarning.booking', { valueAsNumber: true })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--color-text)]">Review Points</label>
                  <Input
                    type="number"
                    step="1"
                    {...rewardsForm.register('pointsEarning.review', { valueAsNumber: true })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--color-text)]">Referral Points</label>
                  <Input
                    type="number"
                    step="1"
                    {...rewardsForm.register('pointsEarning.referral', { valueAsNumber: true })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--color-text)]">Social Share Points</label>
                  <Input
                    type="number"
                    step="1"
                    {...rewardsForm.register('pointsEarning.socialShare', { valueAsNumber: true })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--color-text)]">First Booking Bonus</label>
                  <Input
                    type="number"
                    step="1"
                    {...rewardsForm.register('pointsEarning.firstBooking', { valueAsNumber: true })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Points Redemption</h3>
              <div className="space-y-4">
                {/* 10% Discount */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">10% Discount</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Required Points</label>
                      <Input
                        type="number"
                        step="1"
                        {...rewardsForm.register('redemptions.discount10.points', { valueAsNumber: true })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Discount Value (%)</label>
                      <Input
                        type="number"
                        step="1"
                        {...rewardsForm.register('redemptions.discount10.value', { valueAsNumber: true })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* 20% Discount */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">20% Discount</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Required Points</label>
                      <Input
                        type="number"
                        step="1"
                        {...rewardsForm.register('redemptions.discount20.points', { valueAsNumber: true })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Discount Value (%)</label>
                      <Input
                        type="number"
                        step="1"
                        {...rewardsForm.register('redemptions.discount20.value', { valueAsNumber: true })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Free Add-on */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Free Add-on Service</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Required Points</label>
                      <Input
                        type="number"
                        step="1"
                        {...rewardsForm.register('redemptions.freeAddOn.points', { valueAsNumber: true })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Value (£)</label>
                      <Input
                        type="number"
                        step="1"
                        {...rewardsForm.register('redemptions.freeAddOn.value', { valueAsNumber: true })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Free Detail */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Free Detail Service</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Required Points</label>
                      <Input
                        type="number"
                        step="1"
                        {...rewardsForm.register('redemptions.freeDetail.points', { valueAsNumber: true })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[var(--color-text)]">Value (£)</label>
                      <Input
                        type="number"
                        step="1"
                        {...rewardsForm.register('redemptions.freeDetail.value', { valueAsNumber: true })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                Save Configuration
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loyalty Tiers */}
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(REWARDS.tiers).map(([id, tier]) => (
              <div 
                key={id}
                className="p-4 border rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)]">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Threshold: {tier.threshold} points • {tier.discountPercentage}% Discount
                    </p>
                    
                    <div className="mt-2">
                      <p className="text-sm font-medium text-[var(--color-text)]">Benefits:</p>
                      <ul className="mt-1 space-y-1">
                        {tier.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedTier(id)
                          tierForm.reset({
                            id,
                            name: tier.name,
                            threshold: tier.threshold,
                            benefits: [...tier.benefits],
                            discountPercentage: tier.discountPercentage,
                          })
                        }}
                      >
                        Edit Tier
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Edit Loyalty Tier</SheetTitle>
                      </SheetHeader>
                      <form onSubmit={tierForm.handleSubmit(handleTierUpdate)} className="space-y-6 mt-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-[var(--color-text)]">Tier Name</label>
                            <Input {...tierForm.register('name')} className="mt-1" />
                            {tierForm.formState.errors.name && (
                              <p className="text-xs text-[var(--color-error)] mt-1">
                                {tierForm.formState.errors.name.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="text-sm font-medium text-[var(--color-text)]">Points Threshold</label>
                            <Input
                              type="number"
                              step="1"
                              {...tierForm.register('threshold', { valueAsNumber: true })}
                              className="mt-1"
                            />
                            {tierForm.formState.errors.threshold && (
                              <p className="text-xs text-[var(--color-error)] mt-1">
                                {tierForm.formState.errors.threshold.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="text-sm font-medium text-[var(--color-text)]">Discount Percentage</label>
                            <Input
                              type="number"
                              step="1"
                              min="0"
                              max="100"
                              {...tierForm.register('discountPercentage', { valueAsNumber: true })}
                              className="mt-1"
                            />
                            {tierForm.formState.errors.discountPercentage && (
                              <p className="text-xs text-[var(--color-error)] mt-1">
                                {tierForm.formState.errors.discountPercentage.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="text-sm font-medium text-[var(--color-text)]">Benefits</label>
                            {tierForm.watch('benefits')?.map((_, index) => (
                              <div key={index} className="flex gap-2 mt-2">
                                <Input
                                  {...tierForm.register(`benefits.${index}`)}
                                  placeholder={`Benefit ${index + 1}`}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    const benefits = tierForm.getValues('benefits')
                                    benefits.splice(index, 1)
                                    tierForm.setValue('benefits', [...benefits])
                                  }}
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                const benefits = tierForm.getValues('benefits') || []
                                tierForm.setValue('benefits', [...benefits, ''])
                              }}
                            >
                              Add Benefit
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              tierForm.reset()
                              setSelectedTier(null)
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 