'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { initGSAP } from '@/lib/utils/clientInit';
import type { ClientProviderProps } from '@/types';

// Import polyfills
import '@/lib/polyfills/browser-polyfills';

// Dynamically import the Google Maps LoadScript component
const LoadScript = dynamic(
  () => import('@react-google-maps/api').then((mod) => mod.LoadScript),
  { ssr: false }
);

export function ClientProvider({ children }: ClientProviderProps) {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    // Initialize GSAP only in browser environment
    if (typeof window !== 'undefined') {
      // Ensure global objects are available
      if (!window.self) {
        window.self = window;
      }

      // Initialize GSAP
      const init = async () => {
        cleanup = await initGSAP();
      };

      init().catch(console.error);
    }

    return () => {
      cleanup?.();
    };
  }, []);

  // Only render LoadScript in browser environment
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      libraries={['places']}
      language="en"
      region="GB"
      version="weekly"
      id="google-maps-script"
      preventGoogleFontsLoading
    >
      {children}
    </LoadScript>
  );
} 