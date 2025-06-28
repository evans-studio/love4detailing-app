'use client'

import { useState } from 'react'
import PremiumLoadingScreen, { usePremiumLoading } from '@/components/ui/PremiumLoadingScreen'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { motion } from 'framer-motion'

export function LoadingDemoClient() {
  const [showDemo, setShowDemo] = useState(false)
  const { isLoading, setIsLoading } = usePremiumLoading(3000)

  const triggerDemo = () => {
    setShowDemo(true)
    setTimeout(() => setShowDemo(false), 3500)
  }

  const triggerHookDemo = () => {
    setIsLoading(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Premium Loading Screen Demo
          </h1>
          <p className="text-slate-300 text-lg">
            Experience the luxury first impression for Love4Detailing
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 bg-slate-800/50 border-slate-700">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Manual Demo
            </h2>
            <p className="text-slate-300 mb-6">
              Trigger the 3-second loading screen manually to see all animations and transitions.
            </p>
            <Button 
              onClick={triggerDemo}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Show Loading Screen (3s)
            </Button>
          </Card>

          <Card className="p-8 bg-slate-800/50 border-slate-700">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Hook Demo
            </h2>
            <p className="text-slate-300 mb-6">
              Use the built-in hook that automatically handles app readiness detection.
            </p>
            <Button 
              onClick={triggerHookDemo}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Use Hook Demo (3s)
            </Button>
          </Card>
        </div>

        <Card className="p-8 bg-slate-800/50 border-slate-700">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Features & Implementation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-3">
                🎨 Design Features
              </h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• Animated car silhouette with path drawing</li>
                <li>• Shimmer effects across car and wordmark</li>
                <li>• Pulsing transformation orb with progress ring</li>
                <li>• Floating particles for luxury atmosphere</li>
                <li>• Premium gradient backgrounds</li>
                <li>• Mobile-first responsive design</li>
                <li>• <strong>Helvetica Bold</strong> typography for brand name</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-pink-300 mb-3">
                ⚡ Technical Features
              </h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• Framer Motion animations</li>
                <li>• No SSR issues (client-side only)</li>
                <li>• <strong>App completely hidden</strong> during loading</li>
                <li>• <strong>3-second duration</strong> for premium feel</li>
                <li>• App readiness detection</li>
                <li>• Smooth phase transitions</li>
                <li>• TypeScript support</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-900/50 rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-2">Usage Example:</h4>
            <pre className="text-xs text-slate-300 overflow-x-auto">
{`// In your layout or app
import PremiumLoadingProvider from '@/components/providers/PremiumLoadingProvider'

<PremiumLoadingProvider initialDelay={100} duration={3000}>
  <YourApp />
</PremiumLoadingProvider>

// Or use the hook directly
const { isLoading, setIsLoading } = usePremiumLoading(3000)`}
            </pre>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            This 3-second loading screen creates a premium first impression when users scan QR codes<br />
            from business cards, flyers, or van decals to access the Love4Detailing app.
          </p>
        </div>
      </div>

      {/* Demo loading screens */}
      <PremiumLoadingScreen
        isVisible={showDemo}
        onComplete={() => setShowDemo(false)}
        duration={3000}
      />

      <PremiumLoadingScreen
        isVisible={isLoading}
        onComplete={() => setIsLoading(false)}
        duration={3000}
      />
    </div>
  )
} 