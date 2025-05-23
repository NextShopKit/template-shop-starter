import {
  createShopifyClient,
  GetProductOptions,
  FetchProductResult,
  GetCollectionOptions,
  FetchCollectionResult,
} from "@nextshopkit/pro-development";

const client = createShopifyClient({
  shop: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  token: process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN!,
  apiVersion: "2025-04",
  enableMemoryCache: true,
  defaultCacheTtl: 300,
  enableVercelCache: true,
  defaultRevalidate: 60,
});

export const getProduct = async (
  args: GetProductOptions
): Promise<FetchProductResult> =>
  client.getProduct(args, {
    cacheTtl: 60,
    revalidate: 60,
    useMemoryCache: true,
    useVercelCache: true,
  });

export const getCollection = async (
  args: GetCollectionOptions
): Promise<FetchCollectionResult> =>
  client.getCollection(args, {
    cacheTtl: 300,
    revalidate: 300,
    useMemoryCache: true,
    useVercelCache: true,
  });

export default client;
