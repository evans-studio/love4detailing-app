/**
 * Animated Background Canvas
 * 
 * Modern fluid gradient background with brand-compliant colors.
 * Features:
 * - Smooth CSS gradient animations with brand colors
 * - Optional WebGL enhancement when available
 * - Performance optimizations for mobile and low-power devices
 * - Brand colors: #141414 (base), #8A2B85 (primary), #A94C9D (secondary)
 * 
 * Props:
 * - intensity: 'low' | 'medium' | 'high' - Animation intensity
 * - speed: number - Animation speed multiplier
 * - opacity: number - Overall opacity (0-1)
 */
"use client"

import { useEffect, useState, useRef, useMemo } from 'react'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'

interface BackgroundCanvasProps {
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  speed?: number
  opacity?: number
}

// Enhanced CSS gradient background with multiple animated layers
function AnimatedGradientBackground({ 
  intensity = 'medium', 
  speed = 1, 
  opacity = 0.8,
  className = ''
}: BackgroundCanvasProps) {
  const { isMobile, isLowPowerDevice } = useDeviceDetection()
  
  // Performance-based adjustments
  const animationDuration = useMemo(() => {
    const baseSpeed = isLowPowerDevice ? 30 : isMobile ? 25 : 20
    return `${baseSpeed / speed}s`
  }, [isMobile, isLowPowerDevice, speed])

  const intensityValue = useMemo(() => {
    if (isLowPowerDevice) return intensity === 'high' ? 0.6 : 0.4
    return intensity === 'low' ? 0.4 : intensity === 'high' ? 0.8 : 0.6
  }, [intensity, isLowPowerDevice])

  const opacityValue = useMemo(() => {
    if (isLowPowerDevice) return opacity * 0.7
    return opacity
  }, [opacity, isLowPowerDevice])

  const gradientStyle = useMemo(() => ({
    background: `
      radial-gradient(circle at 20% 30%, rgba(138, 43, 133, ${intensityValue * 0.3}) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(169, 76, 157, ${intensityValue * 0.25}) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(138, 43, 133, ${intensityValue * 0.2}) 0%, transparent 50%),
      radial-gradient(circle at 90% 20%, rgba(169, 76, 157, ${intensityValue * 0.15}) 0%, transparent 50%),
      linear-gradient(135deg, #141414 0%, #1a1a1a 50%, #141414 100%)
    `,
    backgroundSize: '400% 400%, 300% 300%, 500% 500%, 350% 350%, 100% 100%',
    opacity: opacityValue,
    animation: `
      gradientFlow ${animationDuration} ease-in-out infinite,
      gradientPulse ${parseFloat(animationDuration) * 1.5}s ease-in-out infinite alternate
    `,
    willChange: 'background-position, opacity'
  }), [animationDuration, intensityValue, opacityValue])

  return (
    <div 
      className={`fixed inset-0 -z-10 ${className}`}
      style={gradientStyle}
    />
  )
}

// Optional WebGL enhancement (only loads if compatible)
function WebGLEnhancement({ 
  intensity = 'medium', 
  speed = 1, 
  opacity = 0.3 
}: BackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [webglSupported, setWebglSupported] = useState(false)
  const { isLowPowerDevice } = useDeviceDetection()

  useEffect(() => {
    if (isLowPowerDevice) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Check WebGL support
    try {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) return
      setWebglSupported(true)
    } catch (e) {
      return
    }

    // Simple WebGL particle system
    const gl = canvas.getContext('webgl')!
    const particles: Array<{x: number, y: number, vx: number, vy: number, life: number}> = []
    
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute float a_life;
      uniform vec2 u_resolution;
      varying float v_life;
      
      void main() {
        vec2 zeroToOne = a_position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        gl_PointSize = 2.0 + a_life * 3.0;
        v_life = a_life;
      }
    `

    const fragmentShaderSource = `
      precision mediump float;
      varying float v_life;
      
      void main() {
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center);
        if (dist > 0.5) discard;
        
        float alpha = (1.0 - dist * 2.0) * v_life * 0.3;
        gl_FragColor = vec4(0.541, 0.169, 0.522, alpha);
      }
    `

    // Create shader program
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return shader
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    
    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
    const lifeAttributeLocation = gl.getAttribLocation(program, 'a_life')
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')

    const positionBuffer = gl.createBuffer()
    const lifeBuffer = gl.createBuffer()

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5 * speed,
        vy: (Math.random() - 0.5) * 0.5 * speed,
        life: Math.random()
      })
    }

    let animationId: number
    const animate = () => {
      // Update particles
      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= 0.005

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Reset particle if life is depleted
        if (particle.life <= 0) {
          particle.life = 1
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
        }
      })

      // Render
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)

      // Set uniforms
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height)

      // Set attributes
      const positions = new Float32Array(particles.flatMap(p => [p.x, p.y]))
      const lives = new Float32Array(particles.map(p => p.life))

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(positionAttributeLocation)
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, lifeBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, lives, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(lifeAttributeLocation)
      gl.vertexAttribPointer(lifeAttributeLocation, 1, gl.FLOAT, false, 0, 0)

      // Enable blending
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      gl.drawArrays(gl.POINTS, 0, particles.length)

      animationId = requestAnimationFrame(animate)
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isLowPowerDevice, speed])

  if (isLowPowerDevice || !webglSupported) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity }}
    />
  )
}

export default function BackgroundCanvas(props: BackgroundCanvasProps) {
  const { isLowPowerDevice } = useDeviceDetection()

  return (
    <>
      <AnimatedGradientBackground {...props} />
      {!isLowPowerDevice && (
        <WebGLEnhancement 
          {...props} 
          opacity={(props.opacity || 0.8) * 0.4}
        />
      )}
    </>
  )
} 