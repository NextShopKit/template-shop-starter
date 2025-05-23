"use server";

import { fetchSearchResults } from "@/lib/nextshopkit/search";

export async function loadMoreSearchResults({
  query,
  currentProductCount,
  filters = [],
  sortKey,
  reverse,
}: {
  query: string;
  currentProductCount: number;
  filters?: any[];
  sortKey?: "TITLE" | "PRICE" | "BEST_SELLING" | "CREATED";
  reverse?: boolean;
}) {
  try {
    if (!query.trim()) {
      return {
        success: false,
        error: "Search query is required",
        newProducts: [],
        pageInfo: null,
      };
    }

    // Calculate cursor based on current product count
    // For search, we need to load more products starting from the current count
    const limit = 12; // Load 12 more products

    const result = await fetchSearchResults({
      query: query.trim(),
      limit,
      filters,
      sortKey,
      reverse,
      // Note: For cursor-based pagination, you would pass the endCursor here
      // For now, we'll use limit-based pagination similar to collections
    });

    if (result.error) {
      return {
        success: false,
        error: result.error,
        newProducts: [],
        pageInfo: null,
      };
    }

    // Return products starting from the current count
    const newProducts = result.products.slice(currentProductCount) || [];

    return {
      success: true,
      newProducts,
      pageInfo: result.pageInfo,
      totalCount: result.totalCount,
    };
  } catch (error) {
    console.error("Error loading more search results:", error);
    return {
      success: false,
      error: "Failed to load more search results",
      newProducts: [],
      pageInfo: null,
    };
  }
}
