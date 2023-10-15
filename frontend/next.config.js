/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    manifestPath: "/manifest.json",
  },
  experimental: {
    serverActions: true,
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
