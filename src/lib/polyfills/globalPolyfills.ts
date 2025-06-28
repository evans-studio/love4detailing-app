// Polyfill for global objects in both server and client environments
if (typeof window !== 'undefined') {
  // Browser environment
  if (!global.self) {
    (global as any).self = window;
  }
  if (!global.window) {
    (global as any).window = window;
  }
  if (!global.document) {
    (global as any).document = document;
  }
} else {
  // Server environment
  if (!global.self) {
    (global as any).self = {};
  }
  if (!global.window) {
    (global as any).window = {};
  }
  if (!global.document) {
    (global as any).document = {
      createElement: () => ({}),
      getElementsByTagName: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  }
} 