/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    manifestPath: "/manifest.json",
  },
};

const withPWA = require("next-pwa")({
  dest: "public",
  publicExcludes: ["**/manifest.json"],
});

module.exports = withPWA(nextConfig);
