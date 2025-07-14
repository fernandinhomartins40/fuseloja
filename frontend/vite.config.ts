import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps for production
    minify: 'esbuild',
    target: 'es2018', // Better browser compatibility
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          // Router and query
          'routing': ['react-router-dom', '@tanstack/react-query'],
          // UI library chunks
          'ui-core': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu', 
            '@radix-ui/react-tabs',
            '@radix-ui/react-select',
            '@radix-ui/react-popover'
          ],
          'ui-extended': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-switch'
          ],
          // Charts separated
          'charts': ['recharts'],
          // Forms handling
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Utilities
          'utils': ['axios', 'date-fns', 'clsx', 'tailwind-merge', 'uuid']
        },
        // Better file naming for caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 500, // Warn for chunks larger than 500kb
    cssCodeSplit: true,
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline small assets
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios'
    ],
    exclude: ['lovable-tagger']
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Enable modern browser features while maintaining compatibility
  esbuild: {
    target: 'es2018',
    supported: {
      'top-level-await': false // Disable for better compatibility
    }
  }
}));
