import { imageHosts } from './image-hosts.config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,

  // Optimize for faster dev startup
  reactStrictMode: true,
  compress: true,

  images: {
    remotePatterns: imageHosts,
    minimumCacheTTL: 86400,
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: false,
      },
    ];
  },

  // Disable telemetry
  serverExternalPackages: [],

  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react', 'recharts'],
  },
};

export default nextConfig;
