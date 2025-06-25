'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'

interface ApiUsage {
  dvlaLookups: number
  cacheHits: number
  localMatches: number
  totalCost: number
  lastReset: string
}

export default function ApiUsageTracker() {
  const [usage, setUsage] = useState<ApiUsage>({
    dvlaLookups: 0,
    cacheHits: 0,
    localMatches: 0,
    totalCost: 0,
    lastReset: new Date().toISOString()
  })

  useEffect(() => {
    // Load usage from localStorage
    const saved = localStorage.getItem('api-usage-tracker')
    if (saved) {
      setUsage(JSON.parse(saved))
    }
  }, [])

  const resetUsage = () => {
    const newUsage = {
      dvlaLookups: 0,
      cacheHits: 0,
      localMatches: 0,
      totalCost: 0,
      lastReset: new Date().toISOString()
    }
    setUsage(newUsage)
    localStorage.setItem('api-usage-tracker', JSON.stringify(newUsage))
  }

  const efficiency = usage.dvlaLookups > 0 
    ? Math.round(((usage.cacheHits + usage.localMatches) / (usage.dvlaLookups + usage.cacheHits + usage.localMatches)) * 100)
    : 100

  const freeRemaining = Math.max(0, 100 - usage.dvlaLookups)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">API Usage Tracker</h3>
        <button 
          onClick={resetUsage}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Reset
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{usage.dvlaLookups}</div>
          <div className="text-sm text-gray-600">DVLA API Calls</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{usage.cacheHits}</div>
          <div className="text-sm text-gray-600">Cache Hits</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{usage.localMatches}</div>
          <div className="text-sm text-gray-600">Local Matches</div>
        </div>
        
        <div className="text-center">
                      <div className="text-2xl font-bold text-rich-crimson">£{usage.totalCost.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Cost</div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Badge variant={freeRemaining > 20 ? "default" : freeRemaining > 0 ? "secondary" : "alert"}>
          {freeRemaining} free calls remaining this month
        </Badge>
        
        <Badge variant={efficiency > 80 ? "default" : efficiency > 60 ? "secondary" : "alert"}>
          {efficiency}% efficiency (cache + local)
        </Badge>
      </div>

      <div className="text-xs text-gray-500">
        <p>• DVLA Free Tier: 100 calls/month</p>
        <p>• After free tier: £0.10 per lookup</p>
        <p>• Cache hits and local matches are FREE</p>
        <p>• Last reset: {new Date(usage.lastReset).toLocaleDateString()}</p>
      </div>
    </Card>
  )
} 