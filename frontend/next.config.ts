/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true, // 🚀 CRITICAL: This fires your register() function
  },
  serverExternalPackages: ['applicationinsights', 'diagnostic-channel-publishers'],
};

export default nextConfig;
