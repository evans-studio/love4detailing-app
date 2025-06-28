'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Users, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'

interface StatsGridProps {
  totalCustomers: number
  activeCustomers: number
  totalRevenue: number
  averageSpent: number
  loyalCustomers: number
  recentBookings: number
}

export function StatsGrid({
  totalCustomers,
  activeCustomers,
  totalRevenue,
  averageSpent,
  loyalCustomers,
  recentBookings
}: StatsGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid gap-4 grid-cols-2 lg:grid-cols-4"
    >
      <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500 rounded-full">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg sm:text-2xl font-bold text-blue-700 dark:text-blue-300">
                {totalCustomers}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">Total Customers</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-500 rounded-full">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg sm:text-2xl font-bold text-green-700 dark:text-green-300">
                {activeCustomers}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-500 rounded-full">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg sm:text-2xl font-bold text-purple-700 dark:text-purple-300 truncate">
                {formatCurrency(totalRevenue)}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400">Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-orange-500 rounded-full">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg sm:text-2xl font-bold text-orange-700 dark:text-orange-300 truncate">
                {formatCurrency(averageSpent)}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400">Avg Value</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-500 rounded-full">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg sm:text-2xl font-bold text-red-700 dark:text-red-300">
                {loyalCustomers}
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">Loyal Customers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-500 rounded-full">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg sm:text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                {recentBookings}
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">Recent Bookings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 