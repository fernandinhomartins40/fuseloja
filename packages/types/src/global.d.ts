// Global types for window extensions
declare global {
  interface Window {
    clearAppCache?: () => void;
  }
}

export {};