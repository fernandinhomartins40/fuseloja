import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Polyfills para compatibilidade com browsers antigos
if (!window.Promise) {
  // @ts-ignore
  window.Promise = Promise;
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement) {
    return this.indexOf(searchElement) !== -1;
  };
}

// Performance optimization: preload critical resources
const preloadCriticalResources = () => {
  // Preload API base URL to improve first request
  const hostname = window.location.hostname;
  if (hostname.includes('fuseloja.com.br')) {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = '//82.25.69.57';
    document.head.appendChild(link);
  }
};

// Initialize app
const container = document.getElementById("root");
if (container) {
  preloadCriticalResources();
  
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Root element not found');
}
