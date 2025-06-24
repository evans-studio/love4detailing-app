'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PremiumLoadingScreenProps {
  isVisible: boolean
  onComplete?: () => void
  duration?: number
}

export default function PremiumLoadingScreen({ 
  isVisible, 
  onComplete, 
  duration = 3000 
}: PremiumLoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState<'entry' | 'main' | 'exit'>('entry')

  useEffect(() => {
    if (!isVisible) return

    // Phase timing - smoother transitions
    const entryDuration = 1000 // Slower, smoother entry
    const mainDuration = duration - entryDuration - 1000 // Account for longer exit
    const exitDuration = 1000 // Longer, smoother exit

    // Entry phase
    setCurrentPhase('entry')
    
    const entryTimer = setTimeout(() => {
      setCurrentPhase('main')
      
      // Smoother progress animation during main phase
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const increment = 100 / (mainDuration / 30) // Smoother 30ms intervals
          const newProgress = prev + increment
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return newProgress
        })
      }, 30) // Smoother animation interval

      // Exit phase
      const exitTimer = setTimeout(() => {
        setCurrentPhase('exit')
        setTimeout(() => {
          onComplete?.()
        }, exitDuration)
      }, mainDuration)

      return () => {
        clearInterval(progressInterval)
        clearTimeout(exitTimer)
      }
    }, entryDuration)

    return () => clearTimeout(entryTimer)
  }, [isVisible, duration, onComplete])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ 
          opacity: currentPhase === 'exit' ? 0 : 1,
          scale: currentPhase === 'exit' ? 0.95 : 1
        }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ 
          duration: currentPhase === 'exit' ? 1 : 0.8, 
          ease: [0.25, 0.1, 0.25, 1] // Smoother cubic-bezier easing
        }}
        className="fixed inset-0 z-[99999] overflow-hidden bg-deep-black"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          backgroundColor: '#141414'
        }}
      >
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-dark">
          {/* Subtle animated mesh background */}
          <div className="absolute inset-0 opacity-30">
            <motion.div
              animate={{
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(138, 43, 133, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(186, 12, 47, 0.05) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 50%, rgba(138, 43, 133, 0.1) 0%, transparent 50%)'
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            />
          </div>
        </div>

        {/* Main content container */}
        <div className="relative flex items-center justify-center min-h-screen p-8">
          <div className="text-center space-y-12">
            
            {/* Car silhouette animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ 
                scale: currentPhase === 'exit' ? 1.1 : 1,
                opacity: currentPhase === 'exit' ? 0 : 1,
                y: currentPhase === 'exit' ? -10 : 0
              }}
              transition={{ 
                duration: currentPhase === 'entry' ? 1.2 : currentPhase === 'exit' ? 1 : 0.8,
                ease: [0.25, 0.1, 0.25, 1] // Smoother easing
              }}
              className="relative mx-auto w-32 h-20"
            >
              {/* Car silhouette - placeholder for future SVG */}
              <div className="relative w-full h-full">
                {/* Main car body */}
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                  className="absolute inset-0"
                >
                  <svg
                    viewBox="0 0 128 80"
                    className="w-full h-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Car outline path */}
                    <motion.path
                      d="M20 50 L30 35 L45 30 L85 30 L100 35 L108 50 L108 60 L100 65 L28 65 L20 60 Z"
                      stroke="url(#carGradient)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
                    />
                    {/* Car windows */}
                    <motion.path
                      d="M35 35 L42 32 L80 32 L88 35 L88 45 L35 45 Z"
                      stroke="url(#carGradient)"
                      strokeWidth="1.5"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1], delay: 1.2 }}
                    />
                    {/* Wheels */}
                    <motion.circle
                      cx="35"
                      cy="60"
                      r="8"
                      stroke="url(#carGradient)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1], delay: 2 }}
                    />
                    <motion.circle
                      cx="93"
                      cy="60"
                      r="8"
                      stroke="url(#carGradient)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1], delay: 2.2 }}
                    />
                    
                    {/* Gradient definition - Toronto Raptors-Inspired Love4Detailing colors */}
                    <defs>
                      <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8A2B85" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#BA0C2F" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#8A2B85" stopOpacity="0.9" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>

                {/* Shimmer effect across car */}
                <motion.div
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: 2.5
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-soft-silver/30 to-transparent w-12 h-full"
                  style={{ transform: 'skew(-20deg)' }}
                />
              </div>
            </motion.div>

            {/* Brand wordmark with shimmer - Helvetica Bold */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: currentPhase === 'exit' ? 0 : 1 
              }}
              transition={{ 
                duration: 1.2, 
                ease: [0.25, 0.1, 0.25, 1],
                delay: currentPhase === 'entry' ? 0.6 : 0
              }}
              className="relative"
            >
              <h1 
                className="text-4xl md:text-5xl tracking-wide text-white relative overflow-hidden"
                style={{ 
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 'bold'
                }}
              >
                <span className="relative z-10">Love4Detailing</span>
                
                {/* Shimmer wave effect */}
                <motion.div
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-purple/30 to-transparent w-20"
                  style={{ transform: 'skew(-20deg)' }}
                />
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="text-gray-300 text-sm md:text-base font-light mt-3 tracking-wider"
              >
                Premium Car Care Services
              </motion.p>
            </motion.div>

            {/* Pulsing transformation orb */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: currentPhase === 'exit' ? 0 : 1,
                opacity: currentPhase === 'exit' ? 0 : 1
              }}
              transition={{ 
                duration: 0.6, 
                ease: [0.4, 0, 0.2, 1],
                delay: 0.8
              }}
              className="relative mx-auto w-16 h-16"
            >
              {/* Outer pulsing ring */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(138, 43, 133, 0.3) 0%, rgba(186, 12, 47, 0.2) 100%)'
                }}
              />
              
              {/* Inner core */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-2 rounded-full shadow-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #8A2B85 0%, #BA0C2F 100%)',
                  boxShadow: '0 4px 20px rgba(138, 43, 133, 0.25)'
                }}
              />
              
              {/* Progress ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="rgba(138, 141, 143, 0.1)"
                  strokeWidth="2"
                  fill="none"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="url(#progressGradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ pathLength: progress / 100 }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8A2B85" />
                    <stop offset="100%" stopColor="#BA0C2F" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Subtle status text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: currentPhase === 'main' ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="text-gray-400 text-xs tracking-widest uppercase"
            >
              Preparing your premium experience
            </motion.div>

          </div>
        </div>

        {/* Floating particles for luxury feel */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${Math.random() * 100}%`,
                y: '100%',
                opacity: 0,
                scale: 0.5
              }}
              animate={{
                y: '-10%',
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
                x: `${Math.random() * 100}%`
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "linear"
              }}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(138, 43, 133, 0.5) 0%, rgba(186, 12, 47, 0.3) 100%)'
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Usage hook for easy integration
export function usePremiumLoading(duration = 3000) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate app hydration check
    const checkAppReady = () => {
      // In real implementation, check if:
      // - Critical resources are loaded
      // - API connections established
      // - User authentication resolved
      return document.readyState === 'complete'
    }

    if (checkAppReady()) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, Math.min(duration, 3000)) // Allow up to 3 seconds for UX

      return () => clearTimeout(timer)
    } else {
      const readyListener = () => {
        setTimeout(() => setIsLoading(false), 1000)
      }
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', readyListener)
        return () => document.removeEventListener('DOMContentLoaded', readyListener)
      } else {
        readyListener()
      }
    }
  }, [duration])

  return { isLoading, setIsLoading }
} 