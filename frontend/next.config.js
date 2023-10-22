/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.metafuse.me"],
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  publicRuntimeConfig: {
    manifestPath: "/manifest.json",
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };

    return config;
  },
};
const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  runtimeCaching,
  publicExcludes: ["**/manifest.json"],
  exclude: [
    // Exclude files from the service worker
    /sw\.js/,
    /sw\.js\.map/,
  ],
});

module.exports = withPWA(nextConfig);
