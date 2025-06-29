// GSAP and ScrollTrigger types
type GSAPInstance = any;
type ScrollTriggerInstance = any;

// GSAP and ScrollTrigger will be loaded dynamically
let gsap: GSAPInstance = null;
let ScrollTrigger: ScrollTriggerInstance = null;

// Initialize GSAP and ScrollTrigger
async function loadGSAP() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const gsapModule = await import('gsap');
    const scrollTriggerModule = await import('gsap/ScrollTrigger');
    
    gsap = gsapModule.default;
    ScrollTrigger = scrollTriggerModule.ScrollTrigger;
    
    if (!gsap || !ScrollTrigger) {
      throw new Error('Failed to load GSAP or ScrollTrigger');
    }

    gsap.registerPlugin(ScrollTrigger);

    // Default GSAP configuration
    gsap.config({
      nullTargetWarn: false,
      autoSleep: 60,
      force3D: true,
    });

    return true;
  } catch (error) {
    console.error('Error loading GSAP:', error);
    return false;
  }
}

// GSAP initialization
export const initGSAP = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const success = await loadGSAP();
    if (!success) {
      return;
    }

    // Return cleanup function
    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger: ScrollTriggerInstance) => trigger.kill());
        ScrollTrigger.clearMatchMedia();
      }
      if (gsap) {
        gsap.killTweensOf('*');
      }
    };
  } catch (error) {
    console.error('Error initializing GSAP:', error);
  }
};

// Google Maps configuration
export const mapsConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  libraries: ['places'],
  language: 'en',
  region: 'GB',
  version: 'weekly'
};

// Utility to check if code is running in browser
export const isBrowser = typeof window !== 'undefined';

// Utility to safely access window object
export const getWindow = () => {
  if (isBrowser) {
    return window;
  }
  return undefined;
};

// Utility to safely access document object
export const getDocument = () => {
  if (isBrowser) {
    return document;
  }
  return undefined;
};

// Utility to check if an element exists in the DOM
export const elementExists = (selector: string): boolean => {
  if (!isBrowser) return false;
  return document.querySelector(selector) !== null;
};

// Export GSAP instance for use in other files
export const getGSAP = () => gsap;
export const getScrollTrigger = () => ScrollTrigger; 