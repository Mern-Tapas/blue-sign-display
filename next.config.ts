import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  // Docs IA (decision D-040): foundations split into dedicated pages; catch-all commerce
  // and filters pages merged into the journey pages.
  async redirects() {
    return [
      { source: "/design-system/tokens", destination: "/design-system/color", permanent: true },
      { source: "/design-system/commerce", destination: "/design-system/listing", permanent: true },
      { source: "/design-system/filters", destination: "/design-system/listing", permanent: true },
    ];
  },
};

export default nextConfig;
