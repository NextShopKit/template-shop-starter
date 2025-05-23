"use server";

import { fetchCollectionWithMetafields } from "@/lib/nextshopkit/collection";
import type { Product, ProductsPageInfo } from "@nextshopkit/pro-development";

interface LoadMoreProductsParams {
  collectionHandle: string;
  currentProductCount: number;
  filters?: any[];
  sortKey?: "TITLE" | "PRICE" | "BEST_SELLING" | "CREATED";
  reverse?: boolean;
}

interface LoadMoreProductsResult {
  success: boolean;
  newProducts?: Product[];
  pageInfo?: ProductsPageInfo | null;
  error?: string;
}

export async function loadMoreProducts({
  collectionHandle,
  currentProductCount,
  filters = [],
  sortKey,
  reverse,
}: LoadMoreProductsParams): Promise<LoadMoreProductsResult> {
  try {
    // Fetch more products than we currently have to get the next batch
    const newLimit = currentProductCount + 9;

    const result = await fetchCollectionWithMetafields({
      collectionHandle,
      limit: newLimit,
      ...(filters.length > 0 && { filters }),
      ...(sortKey && { sortKey }),
      ...(reverse !== undefined && { reverse }),
    });

    if (result.error) {
      return {
        success: false,
        error: result.error,
      };
    }

    // Extract only the new products (skip the ones we already have)
    const newProducts = result.data?.slice(currentProductCount) || [];

    return {
      success: true,
      newProducts,
      pageInfo: result.pageInfo,
    };
  } catch (error) {
    console.error("Error loading more products:", error);
    return {
      success: false,
      error: "Failed to load more products",
    };
  }
}
