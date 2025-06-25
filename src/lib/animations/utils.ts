import { gsap } from 'gsap'

export const cleanupGSAP = () => {
  // Kill all GSAP animations and timelines
  gsap.killTweensOf("*")
  gsap.globalTimeline.clear()
}

export const createPerformantTween = (target: any, vars: any) => {
  return gsap.to(target, {
    ...vars,
    force3D: true,
    transformOrigin: "50% 50%",
    willChange: "transform, opacity"
  })
}

export const createStaggerAnimation = (
  targets: string | Element | Element[],
  vars: any,
  stagger: number = 0.1
) => {
  return gsap.to(targets, {
    ...vars,
    stagger,
    force3D: true,
    transformOrigin: "50% 50%"
  })
}

export const easePresets = {
  smooth: "power2.inOut",
  bounce: "back.out(1.7)",
  elastic: "elastic.out(1, 0.3)",
  premium: "power3.out"
} 