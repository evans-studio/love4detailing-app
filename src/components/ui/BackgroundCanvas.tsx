/**
 * WebGL Animated Background Canvas
 * 
 * Modern fluid gradient background using Three.js with brand-compliant colors.
 * Features:
 * - Smooth organic wave animations using custom shaders
 * - Performance optimizations for mobile and low-power devices
 * - CSS gradient fallback for non-WebGL browsers
 * - Brand colors: #141414 (base), #8A2B85 (primary), #A94C9D (secondary)
 * 
 * Props:
 * - intensity: 'low' | 'medium' | 'high' - Animation intensity
 * - speed: number - Animation speed multiplier
 * - opacity: number - Overall opacity (0-1)
 */
"use client"

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import * as THREE from 'three'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'

interface BackgroundCanvasProps {
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  speed?: number
  opacity?: number
}

// Custom shader material for fluid gradient waves
const GradientWaveShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uIntensity;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      // Subtle wave displacement
      vec3 newPosition = position;
      newPosition.z += sin(position.x * 2.0 + uTime * 0.5) * 0.02 * uIntensity;
      newPosition.z += cos(position.y * 1.5 + uTime * 0.3) * 0.015 * uIntensity;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uIntensity;
    uniform float uOpacity;
    
    // Brand colors - Love4Detailing palette
    vec3 color1 = vec3(0.082, 0.082, 0.082); // #141414 - Base dark
    vec3 color2 = vec3(0.541, 0.169, 0.522); // #8A2B85 - Primary purple
    vec3 color3 = vec3(0.663, 0.298, 0.616); // #A94C9D - Secondary purple
    vec3 color4 = vec3(0.125, 0.125, 0.125); // Slightly lighter dark
    
    void main() {
      vec2 uv = vUv;
      
      // Create flowing wave patterns
      float wave1 = sin(uv.x * 3.0 + uTime * 0.4) * 0.5 + 0.5;
      float wave2 = cos(uv.y * 2.5 + uTime * 0.3) * 0.5 + 0.5;
      float wave3 = sin((uv.x + uv.y) * 2.0 + uTime * 0.2) * 0.5 + 0.5;
      
      // Combine waves for organic movement
      float pattern = (wave1 + wave2 + wave3) / 3.0;
      pattern = smoothstep(0.0, 1.0, pattern);
      
      // Create radial gradient from center
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(uv, center);
      float radial = 1.0 - smoothstep(0.0, 0.8, dist);
      
      // Time-based color shifting
      float timeShift = sin(uTime * 0.1) * 0.5 + 0.5;
      
      // Mix colors based on pattern and radial gradient
      vec3 finalColor = mix(color1, color2, pattern * 0.3);
      finalColor = mix(finalColor, color3, radial * pattern * 0.2);
      finalColor = mix(finalColor, color4, timeShift * 0.1);
      
      // Subtle brightness variation
      finalColor += (pattern - 0.5) * 0.02 * uIntensity;
      
      gl_FragColor = vec4(finalColor, uOpacity);
    }
  `
}

function GradientWave({ intensity = 1.0, speed = 1.0, opacity = 0.8, segments = 64 }: {
  intensity?: number
  speed?: number
  opacity?: number
  segments?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uIntensity: { value: intensity },
    uOpacity: { value: opacity }
  }), [intensity, opacity])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: GradientWaveShader.vertexShader,
      fragmentShader: GradientWaveShader.fragmentShader,
      uniforms: uniforms,
      transparent: true,
      side: THREE.DoubleSide,
    })
  }, [uniforms])

  useFrame((state) => {
    if (uniforms.uTime) {
      uniforms.uTime.value = state.clock.elapsedTime * speed
    }
  })

  return (
    <Plane ref={meshRef} args={[20, 20, segments, segments]} material={material} />
  )
}

function SecondaryGradientLayer({ intensity = 0.5, speed = 0.7, opacity = 0.4, segments = 32 }: {
  intensity?: number
  speed?: number
  opacity?: number
  segments?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uIntensity: { value: intensity },
    uOpacity: { value: opacity }
  }), [intensity, opacity])

  const secondaryShader = useMemo(() => ({
    vertexShader: GradientWaveShader.vertexShader,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float uTime;
      uniform float uIntensity;
      uniform float uOpacity;
      
      // Shifted brand colors for layering
      vec3 color1 = vec3(0.663, 0.298, 0.616); // #A94C9D - Secondary purple
      vec3 color2 = vec3(0.541, 0.169, 0.522); // #8A2B85 - Primary purple
      vec3 color3 = vec3(0.082, 0.082, 0.082); // #141414 - Base dark
      
      void main() {
        vec2 uv = vUv;
        
        // Different wave patterns for layering effect
        float wave1 = sin(uv.x * 4.0 - uTime * 0.3) * 0.5 + 0.5;
        float wave2 = cos(uv.y * 3.0 + uTime * 0.5) * 0.5 + 0.5;
        float wave3 = sin((uv.x - uv.y) * 2.5 + uTime * 0.4) * 0.5 + 0.5;
        
        float pattern = (wave1 * wave2 + wave3) / 2.0;
        pattern = smoothstep(0.2, 0.8, pattern);
        
        // Diagonal flow pattern
        float diagonal = sin((uv.x + uv.y) * 1.5 + uTime * 0.2) * 0.5 + 0.5;
        
        vec3 finalColor = mix(color3, color1, pattern * 0.4);
        finalColor = mix(finalColor, color2, diagonal * 0.3);
        
        gl_FragColor = vec4(finalColor, uOpacity * pattern);
      }
    `
  }), [])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: secondaryShader.vertexShader,
      fragmentShader: secondaryShader.fragmentShader,
      uniforms: uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
  }, [uniforms, secondaryShader])

  useFrame((state) => {
    if (uniforms.uTime) {
      uniforms.uTime.value = state.clock.elapsedTime * speed
    }
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  return (
    <Plane ref={meshRef} args={[25, 25, segments, segments]} material={material} position={[0, 0, -0.5]} />
  )
}

// Fallback CSS gradient for non-WebGL devices
function CSSGradientFallback({ className }: { className?: string }) {
  return (
    <div 
      className={`fixed inset-0 -z-10 ${className}`}
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(138, 43, 133, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(169, 76, 157, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #141414 0%, #1a1a1a 100%)
        `,
        animation: 'gradientShift 20s ease-in-out infinite'
      }}
    />
  )
}

export default function BackgroundCanvas({ 
  className = '',
  intensity = 'medium',
  speed = 1,
  opacity = 0.8
}: BackgroundCanvasProps) {
  const { isMobile, isLowPowerDevice, supportsWebGL } = useDeviceDetection()
  
  // Performance-based adjustments
  const intensityValue = isLowPowerDevice 
    ? (intensity === 'high' ? 0.8 : 0.5)
    : (intensity === 'low' ? 0.5 : intensity === 'high' ? 1.5 : 1.0)
  
  const opacityValue = isLowPowerDevice 
    ? 0.5 
    : (intensity === 'low' ? 0.6 : intensity === 'high' ? 0.9 : opacity)

  const dpr: [number, number] = isLowPowerDevice ? [1, 1] : isMobile ? [1, 1.5] : [1, 2]
  const segmentCount = isLowPowerDevice ? 16 : isMobile ? 32 : 64

  // Fallback for devices without WebGL support
  if (!supportsWebGL) {
    return <CSSGradientFallback className={className} />
  }

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Suspense fallback={<CSSGradientFallback className={className} />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={dpr}
          performance={{ min: isLowPowerDevice ? 0.3 : 0.5 }}
          style={{ 
            background: '#141414',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1
          }}
        >
          {/* Ambient lighting */}
          <ambientLight intensity={0.2} />
          
          {/* Main gradient wave layer */}
          <GradientWave 
            intensity={intensityValue} 
            speed={speed * 0.8} 
            opacity={opacityValue}
            segments={segmentCount}
          />
          
          {/* Secondary layer for depth - skip on low power devices */}
          {!isLowPowerDevice && (
            <SecondaryGradientLayer 
              intensity={intensityValue * 0.7} 
              speed={speed * 0.6} 
              opacity={opacityValue * 0.5}
              segments={Math.max(16, segmentCount / 2)}
            />
          )}
          
          {/* Optional third subtle layer - desktop only */}
          {!isMobile && !isLowPowerDevice && (
            <GradientWave 
              intensity={intensityValue * 0.3} 
              speed={speed * 0.4} 
              opacity={opacityValue * 0.3}
              segments={Math.max(16, segmentCount / 4)}
            />
          )}
        </Canvas>
      </Suspense>
    </div>
  )
} 