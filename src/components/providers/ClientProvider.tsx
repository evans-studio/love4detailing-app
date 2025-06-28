'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { initGSAP } from '@/lib/utils/clientInit';
import type { ClientProviderProps } from '@/types';
import { mapsConfig } from '@/lib/utils/clientInit';

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
    
    // Initialize GSAP
    initGSAP();
  }, []);

  if (!isClient) {
    return null;
  }

  return children;
} 