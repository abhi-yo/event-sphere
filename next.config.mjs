/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  poweredByHeader: false,
  distDir: '.next',
  // Fix chunk loading errors
  experimental: {
    serverComponentsExternalPackages: ['leaflet'],
  },
  webpack: (config) => {
    // Add source maps for better debugging
    config.devtool = 'source-map';
    return config;
  },
  // Ensure app can find all resources
  basePath: '',
  // For loading undefined chunks
  assetPrefix: '',
  // Increase static generation timeout
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
