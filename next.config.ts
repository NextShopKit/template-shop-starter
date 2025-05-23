import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.shopify.com"],
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 300,
  },
};

export default nextConfig;
