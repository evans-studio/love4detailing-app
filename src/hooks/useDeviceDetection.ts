"use client"

import { useState, useEffect } from 'react'

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLowPowerDevice: boolean
  supportsWebGL: boolean
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLowPowerDevice: false,
    supportsWebGL: false,
  })

  useEffect(() => {
    const checkDevice = () => {
      // Basic mobile detection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768

      const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768 && window.innerWidth < 1024

      const isDesktop = !isMobile && !isTablet

      // Check for low power devices
      const isLowPowerDevice = 
        /iPhone [1-8]|iPad [1-4]|iPod|Android [1-4]/i.test(navigator.userAgent) ||
        navigator.hardwareConcurrency <= 2 ||
        (navigator as any).deviceMemory <= 2

      // WebGL support detection
      let supportsWebGL = false
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        supportsWebGL = !!gl
      } catch (e) {
        supportsWebGL = false
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isLowPowerDevice,
        supportsWebGL,
      })
    }

    checkDevice()

    // Recheck on resize
    const handleResize = () => {
      checkDevice()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return deviceInfo
} 