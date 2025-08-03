// next.config.js

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = withPWA({
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
        pathname: "**",
      },
    ],
  },
});

module.exports = nextConfig;
