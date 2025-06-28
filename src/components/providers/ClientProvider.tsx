'use client';

import { useEffect, useState } from 'react';
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    // Initialize GSAP only in browser environment
    if (typeof window !== 'undefined' && isClient) {
      // Ensure global objects are available
      if (!window.self) {
        window.self = window;
      }

      // Initialize GSAP
      const init = async () => {
        try {
          cleanup = await initGSAP();
        } catch (error) {
          console.error('Failed to initialize GSAP:', error);
        }
      };

      init();
    }

    return () => {
      cleanup?.();
    };
  }, [isClient]);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Only render LoadScript on client side */}
      {isClient && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          loadingElement={null}
          id="google-maps-script"
          libraries={['places']}
          language="en"
          region="GB"
          version="weekly"
          preventGoogleFontsLoading
        />
      )}
      {children}
    </>
  );
} 