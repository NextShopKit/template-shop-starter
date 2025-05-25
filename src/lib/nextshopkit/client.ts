import {
  createShopifyClient,
  GetProductOptions,
  FetchProductResult,
  GetCollectionOptions,
  FetchCollectionResult,
} from "@nextshopkit/sdk";

/**
 * NextShopKit client configuration for Shopify integration
 * This is the core client that handles all Shopify API interactions
 * with built-in caching and optimization features
 */
const client = createShopifyClient({
  // Shopify store domain from environment variables
  shop: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  // Shopify Storefront API access token
  token: process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN!,
  // Shopify API version for compatibility
  apiVersion: "2025-04",
  // Enable in-memory caching for faster repeated requests
  enableMemoryCache: true,
  // Default cache TTL for memory cache (5 minutes)
  defaultCacheTtl: 300,
  // Enable Vercel edge caching for production performance
  enableVercelCache: true,
  // Default revalidation time for Vercel cache (1 minute)
  defaultRevalidate: 60,
});

/**
 * Fetch a single product with NextShopKit optimizations
 * Includes automatic caching and error handling
 */
export const getProduct = async (
  args: GetProductOptions
): Promise<FetchProductResult> => client.getProduct(args);

/**
 * Fetch a collection with products and metadata
 * Supports filtering, pagination, and metafield resolution
 */
export const getCollection = async (
  args: GetCollectionOptions
): Promise<FetchCollectionResult> => client.getCollection(args);

export default client;
