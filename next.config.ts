import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Catalogue images imported from dcat.shop live in this Shopify store's CDN folder.
      // Query strings vary per file (?v=…&width=…), so `search` is left open but the path is pinned.
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/s/files/1/1229/2370/**" },
    ],
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
