import {
  createShopifyClient,
  GetProductOptions,
  FetchProductResult,
  GetCollectionOptions,
  FetchCollectionResult,
} from "@nextshopkit/sdk";

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
): Promise<FetchProductResult> => client.getProduct(args);

export const getCollection = async (
  args: GetCollectionOptions
): Promise<FetchCollectionResult> => client.getCollection(args);

export default client;
