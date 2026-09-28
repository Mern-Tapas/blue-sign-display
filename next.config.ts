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
      // The IQ World page was replaced by DisplayNode; old links go straight to its site.
      { source: "/iq-world", destination: "https://displaynode.cloud/", permanent: false },
      // The CAN prefix was dropped from every series name, so the slugs changed with it.
      // Longest-first: /products/candesk-touch must not be caught by /products/candesk.
      ...Object.entries({
        "candesk-touch": "desk-touch",
        "candesk-tab": "desk-tab",
        "candesk-wid": "desk-wid",
        candesk: "desk",
        canlit: "lit",
        canwalk: "walk",
        canmount: "mount",
        canvue: "vue",
        cannx: "nx",
        can: "easel",
      }).map(([from, to]) => ({
        source: `/products/${from}`,
        destination: `/products/${to}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
