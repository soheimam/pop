/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  publicRuntimeConfig: {
    manifestPath: "/manifest.json",
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };

    return config;
  },
};

const withPWA = require("next-pwa")({
  dest: "public",
  publicExcludes: ["**/manifest.json"],
  exclude: [
    // Exclude files from the service worker
    /sw\.js/,
    /sw\.js\.map/,
  ],
});

module.exports = withPWA(nextConfig);
