import type { NextConfig } from "next";

/**
 * Next.js configuration for NextShopKit starter template
 * Optimized for Shopify integration with image handling
 */
const nextConfig: NextConfig = {
  images: {
    // Allow Shopify CDN images for product/collection media
    domains: ["cdn.shopify.com"],
    // Enable SVG support for Shopify icons and graphics
    dangerouslyAllowSVG: true,
    // Cache images for 5 minutes to improve performance
    minimumCacheTTL: 300,
  },
};

export default nextConfig;
