"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductGridLayout2 from "../../product/grid-layout/ProductGridLayout2";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loadMoreSearchResults } from "@/lib/actions/products";
import throttle from "lodash/throttle";

import type { Product, ProductsPageInfo } from "@nextshopkit/sdk";

// Product grid with infinite scroll and sorting. Handles client-side fetching and deduplication.

const SORT_OPTIONS = [
  { value: "TITLE-asc", label: "Title: A-Z" },
  { value: "TITLE-desc", label: "Title: Z-A" },
  { value: "PRICE-asc", label: "Price: Low to High" },
  { value: "PRICE-desc", label: "Price: High to Low" },
  { value: "BEST_SELLING-asc", label: "Best Selling" },
  { value: "BEST_SELLING-desc", label: "Least Selling" },
  { value: "CREATED-desc", label: "Newest" },
  { value: "CREATED-asc", label: "Oldest" },
];

interface SearchGridWithInfiniteScrollProps {
  initialProducts: Product[];
  pageInfo: ProductsPageInfo | null | undefined;
  searchQuery: string;
  filters: any[];
  currentFilters: { [key: string]: string | string[] | undefined };
  currentLimit: number;
  currentSort?: string;
  totalCount: number;
}

/**
 * SearchGridWithInfiniteScroll for NextShopKit starter template.
 * - Handles infinite scroll and SSR fallback for search result grids
 * - Integrates with NextShopKit's product search, filtering, and sorting
 * - Deduplicates products, supports sort/filter, and progressive enhancement (JS/no-JS)
 * - Used for search result pages
 */
export default function SearchGridWithInfiniteScroll({
  initialProducts,
  pageInfo,
  searchQuery,
  filters,
  currentFilters,
  currentLimit,
  currentSort,
  totalCount,
}: SearchGridWithInfiniteScrollProps) {
  // Main product state and pagination info
  const [products, setProducts] = useState(initialProducts);
  const [currentPageInfo, setCurrentPageInfo] = useState(pageInfo);
  const [loading, setLoading] = useState(false);
  const [hasJavaScript, setHasJavaScript] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Detect JS for SSR fallback
  useEffect(() => {
    setHasJavaScript(true);
  }, []);

  // Reset state when server data changes (new search/filter)
  useEffect(() => {
    setProducts(initialProducts);
    setCurrentPageInfo(pageInfo || null);
  }, [initialProducts, pageInfo]);

  // Restore scroll position on back nav
  useEffect(() => {
    if (currentLimit > 9 && products.length >= currentLimit) {
      setTimeout(() => {
        const scrollPosition = sessionStorage.getItem(
          `scroll-search-${searchQuery}`
        );
        if (scrollPosition) {
          window.scrollTo(0, parseInt(scrollPosition, 10));
          sessionStorage.removeItem(`scroll-search-${searchQuery}`);
        }
      }, 100);
    }
  }, [currentLimit, products.length, searchQuery]);

  // Update limit param in URL without navigation
  const updateURLQuietly = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams();
      searchParams.forEach((value, key) => {
        if (key !== "limit") params.append(key, value);
      });
      params.set("limit", newLimit.toString());
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`
      );
    },
    [searchParams]
  );

  // Handle sort dropdown
  const handleSortChange = useCallback(
    (sortValue: string) => {
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && key !== "sort") {
          if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
          else params.set(key, value);
        }
      });
      if (sortValue && sortValue !== "default") params.set("sort", sortValue);
      router.push(`${window.location.pathname}?${params.toString()}`);
    },
    [currentFilters, router]
  );

  /**
   * Fetch more products (infinite scroll or button)
   * Uses NextShopKit's loadMoreSearchResults action for SSR/ISR compatibility
   * Deduplicates products by id, updates state, URL, and scroll position
   */
  const loadMore = useCallback(async () => {
    if (!currentPageInfo?.hasNextPage || loading || !searchQuery.trim()) return;
    setLoading(true);
    try {
      const parseSortParam = (sortParam?: string) => {
        if (!sortParam) return { sortKey: undefined, reverse: undefined };
        const [sortKey, order] = sortParam.split("-");
        // NextShopKit/Shopify accepted sort keys. There are others, but these are the relevant ones for this UI.
        const validSortKeys = ["TITLE", "PRICE", "BEST_SELLING", "CREATED"];
        if (!validSortKeys.includes(sortKey))
          return { sortKey: undefined, reverse: undefined };
        return {
          sortKey: sortKey as "TITLE" | "PRICE" | "BEST_SELLING" | "CREATED",
          reverse: order === "desc",
        };
      };
      const { sortKey, reverse } = parseSortParam(currentSort);
      const result = await loadMoreSearchResults({
        query: searchQuery,
        currentProductCount: products.length,
        filters,
        sortKey,
        reverse,
      });
      if (
        result.success &&
        result.newProducts &&
        result.newProducts.length > 0
      ) {
        setProducts((prev) => {
          // Deduplicate by product id
          const combined = [...prev, ...result.newProducts!];
          const seen = new Set();
          return combined.filter((product) => {
            if (seen.has(product.id)) return false;
            seen.add(product.id);
            return true;
          });
        });
        setCurrentPageInfo(result.pageInfo);
        updateURLQuietly(products.length + result.newProducts.length);
        sessionStorage.setItem(
          `scroll-search-${searchQuery}`,
          window.scrollY.toString()
        );
      }
    } catch (error) {
      console.error("Error loading more search results:", error);
    } finally {
      setLoading(false);
    }
  }, [
    currentPageInfo,
    loading,
    searchQuery,
    filters,
    currentSort,
    products.length,
    updateURLQuietly,
  ]);

  // Infinite scroll: trigger loadMore near bottom
  useEffect(() => {
    if (!hasJavaScript || !currentPageInfo?.hasNextPage || loading) return;
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 1000
      )
        loadMore();
    };
    const throttledScroll = throttle(handleScroll, 200);
    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [hasJavaScript, currentPageInfo?.hasNextPage, loading, loadMore]);

  // SSR fallback: build "Load More" URL
  const getLoadMoreUrl = () => {
    const params = new URLSearchParams();
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
        else params.set(key, value);
      }
    });
    params.set("limit", (products.length + 12).toString());
    return `${window.location.pathname}?${params.toString()}`;
  };

  return (
    <div>
      {/* Sort controls and result count */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {totalCount} {totalCount === 1 ? "result" : "results"}
          {searchQuery && ` for "${searchQuery}"`}
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={currentSort || "default"}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product grid */}
      <ProductGridLayout2 products={products} />

      {/* Load More button or SSR fallback */}
      {currentPageInfo?.hasNextPage && (
        <div className="flex justify-center mt-8">
          {hasJavaScript ? (
            <Button
              onClick={loadMore}
              disabled={loading}
              className="min-w-32"
              variant="outline"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          ) : (
            <Button asChild variant="outline">
              <a href={getLoadMoreUrl()}>Load More</a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
