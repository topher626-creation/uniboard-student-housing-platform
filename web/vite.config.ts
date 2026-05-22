import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isTest = mode === 'test';

  return {
    plugins: [react()],
    define: isTest ? { 'process.env.NODE_ENV': JSON.stringify('test') } : undefined,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: 'jsdom',
    },
    build: {
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('bootstrap') || id.includes('lucide-react') || id.includes('framer-motion')) {
                return 'vendor-ui';
              }
              if (id.includes('axios') || id.includes('zod') || id.includes('zustand') || id.includes('@tanstack')) {
                return 'vendor-utils';
              }
              return 'vendor';
            }
          },
        },
      },
    },
  };
})
