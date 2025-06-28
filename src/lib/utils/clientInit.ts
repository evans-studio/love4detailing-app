import dynamic from 'next/dynamic';
import type { LoadScriptProps } from '@react-google-maps/api';

// GSAP and ScrollTrigger will be loaded dynamically
let gsap: any = null;
let ScrollTrigger: any = null;

// Initialize GSAP and ScrollTrigger
async function loadGSAP() {
  if (typeof window !== 'undefined') {
    try {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      gsap = gsapModule.default;
      ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
    } catch (error) {
      console.error('Error loading GSAP:', error);
    }
  }
}

// GSAP initialization
export const initGSAP = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    await loadGSAP();
    
    if (gsap && ScrollTrigger) {
      // Default GSAP configuration
      gsap.config({
        nullTargetWarn: false,
        autoSleep: 60,
        force3D: true,
      });

      // Clean up function
      return () => {
        try {
          ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
          gsap.killTweensOf('*');
        } catch (error) {
          console.error('Error cleaning up GSAP:', error);
        }
      };
    }
  } catch (error) {
    console.error('Error initializing GSAP:', error);
    return;
  }
};

// Google Maps configuration
export const mapsConfig: LoadScriptProps = {
  id: 'google-maps-script',
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  libraries: ['places'],
  language: 'en',
  region: 'GB',
  version: 'weekly',
  preventGoogleFontsLoading: true,
  onLoad: () => console.log('Google Maps script loaded'),
  onError: (error) => console.error('Error loading Google Maps script:', error),
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