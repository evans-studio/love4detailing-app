// Browser polyfills
if (typeof window === 'undefined') {
  interface GlobalShim {
    self: typeof globalThis;
    window: typeof globalThis;
    document: {
      createElement: () => Record<string, unknown>;
      getElementsByTagName: () => never[];
      addEventListener: () => void;
      removeEventListener: () => void;
      documentElement: Record<string, unknown>;
      body: Record<string, unknown>;
      readyState: string;
    };
    navigator: {
      userAgent: string;
      platform: string;
      language: string;
    };
    location: {
      href: string;
      origin: string;
      protocol: string;
      host: string;
      hostname: string;
      port: string;
      pathname: string;
      search: string;
      hash: string;
    };
    addEventListener: () => void;
    removeEventListener: () => void;
    setTimeout: typeof global.setTimeout;
    clearTimeout: typeof global.clearTimeout;
    setInterval: typeof global.setInterval;
    clearInterval: typeof global.clearInterval;
    requestAnimationFrame: (callback: FrameRequestCallback) => number;
    cancelAnimationFrame: typeof global.clearTimeout;
    getComputedStyle: () => {
      getPropertyValue: () => string;
    };
    matchMedia: () => {
      matches: boolean;
      addListener: () => void;
      removeListener: () => void;
    };
  }

  const createGlobalShim = (): GlobalShim => ({
    self: globalThis,
    window: globalThis,
    document: {
      createElement: () => ({}),
      getElementsByTagName: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
      documentElement: {},
      body: {},
      readyState: 'complete',
    },
    navigator: {
      userAgent: '',
      platform: '',
      language: '',
    },
    location: {
      href: '',
      origin: '',
      protocol: '',
      host: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    setTimeout: global.setTimeout,
    clearTimeout: global.clearTimeout,
    setInterval: global.setInterval,
    clearInterval: global.clearInterval,
    requestAnimationFrame: (callback: FrameRequestCallback) => global.setTimeout(callback, 0),
    cancelAnimationFrame: global.clearTimeout,
    getComputedStyle: () => ({
      getPropertyValue: () => '',
    }),
    matchMedia: () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
    }),
  });

  const globalShim = createGlobalShim();

  // Safely assign to global
  Object.keys(globalShim).forEach((key) => {
    if (!(key in global)) {
      Object.defineProperty(global, key, {
        value: globalShim[key as keyof GlobalShim],
        writable: true,
        configurable: true,
      });
    }
  });
} 