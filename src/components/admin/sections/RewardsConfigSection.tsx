'use client'

import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { REWARDS } from '@/lib/constants'

// Rewards configuration schema
const rewardsConfigSchema = z.object({
  pointsEarning: z.object({
    booking: z.number().min(0),
    review: z.number().min(0),
    referral: z.number().min(0),
    socialShare: z.number().min(0),
    firstBooking: z.number().min(0),
  }),
  tiers: z.record(z.object({
    name: z.string(),
    threshold: z.number().min(0),
    benefits: z.array(z.string()),
    discountPercentage: z.number().min(0).max(100),
  })),
  redemptions: z.record(z.object({
    points: z.number().min(0),
    value: z.number().min(0),
    type: z.enum(['discount', 'service']),
  })),
})

type RewardsConfigValues = z.infer<typeof rewardsConfigSchema>

interface RewardsConfigSectionProps {
  adminId: string
  adminRole: 'admin' | 'manager'
}

export const RewardsConfigSection: React.FC<RewardsConfigSectionProps> = ({
  adminId,
  adminRole,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  // Config form
  const configForm = useForm<RewardsConfigValues>({
    resolver: zodResolver(rewardsConfigSchema),
    defaultValues: {
      pointsEarning: REWARDS.pointsEarning as RewardsConfigValues['pointsEarning'],
      tiers: REWARDS.tiers as RewardsConfigValues['tiers'],
      redemptions: REWARDS.redemptions as RewardsConfigValues['redemptions'],
    },
  })

  // Handle config update
  const handleConfigUpdate: SubmitHandler<RewardsConfigValues> = async (data) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/rewards/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update rewards configuration')
      
      // Show success message
    } catch (error) {
      console.error('Error updating rewards config:', error)
      // Show error message
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Rewards Configuration</h2>
        <p className="text-muted-foreground">
          Configure loyalty program settings and tiers
        </p>
      </div>

      <form onSubmit={configForm.handleSubmit(handleConfigUpdate)}>
        <Tabs defaultValue="points" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="points">Points Earning</TabsTrigger>
            <TabsTrigger value="tiers">Loyalty Tiers</TabsTrigger>
            <TabsTrigger value="redemptions">Redemptions</TabsTrigger>
          </TabsList>

          <TabsContent value="points">
            <Card>
              <CardHeader>
                <CardTitle>Points Earning Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Booking Points</label>
                    <Input
                      type="number"
                      {...configForm.register('pointsEarning.booking', { valueAsNumber: true })}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Points earned per booking
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Review Points</label>
                    <Input
                      type="number"
                      {...configForm.register('pointsEarning.review', { valueAsNumber: true })}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Points earned for leaving a review
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Referral Points</label>
                    <Input
                      type="number"
                      {...configForm.register('pointsEarning.referral', { valueAsNumber: true })}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Points earned for referring a new customer
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Social Share Points</label>
                    <Input
                      type="number"
                      {...configForm.register('pointsEarning.socialShare', { valueAsNumber: true })}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Points earned for social media shares
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">First Booking Bonus</label>
                    <Input
                      type="number"
                      {...configForm.register('pointsEarning.firstBooking', { valueAsNumber: true })}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Bonus points for first-time customers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tiers">
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(configForm.watch('tiers')).map(([tierId, tier]) => (
                  <div key={tierId} className="space-y-4 p-4 border rounded-lg">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Tier Name</label>
                        <Input
                          {...configForm.register(`tiers.${tierId}.name`)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Point Threshold</label>
                        <Input
                          type="number"
                          {...configForm.register(`tiers.${tierId}.threshold`, { valueAsNumber: true })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Discount Percentage</label>
                        <Input
                          type="number"
                          {...configForm.register(`tiers.${tierId}.discountPercentage`, { valueAsNumber: true })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Benefits (comma-separated)</label>
                      <Input
                        {...configForm.register(`tiers.${tierId}.benefits`)}
                        className="mt-1"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        List of benefits for this tier
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="redemptions">
            <Card>
              <CardHeader>
                <CardTitle>Redemption Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(configForm.watch('redemptions')).map(([rewardId, reward]) => (
                  <div key={rewardId} className="space-y-4 p-4 border rounded-lg">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Points Required</label>
                        <Input
                          type="number"
                          {...configForm.register(`redemptions.${rewardId}.points`, { valueAsNumber: true })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Reward Value</label>
                        <Input
                          type="number"
                          {...configForm.register(`redemptions.${rewardId}.value`, { valueAsNumber: true })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Reward Type</label>
                        <select
                          {...configForm.register(`redemptions.${rewardId}.type`)}
                          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="discount">Discount</option>
                          <option value="service">Service</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
} 