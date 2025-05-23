"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductGridLayout2 from "./ProductGridLayout2";
import { loadMoreProducts } from "@/lib/actions/loadMoreProducts";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Product, ProductsPageInfo } from "@nextshopkit/sdk";

// Sort options configuration
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

interface ProductGridWithInfiniteScrollProps {
  initialProducts: Product[];
  pageInfo: ProductsPageInfo | null | undefined;
  collectionHandle: string;
  filters: any[];
  currentFilters: { [key: string]: string | string[] | undefined };
  currentLimit: number;
  currentSort?: string;
}

export default function ProductGridWithInfiniteScroll({
  initialProducts,
  pageInfo,
  collectionHandle,
  filters,
  currentFilters,
  currentLimit,
  currentSort,
}: ProductGridWithInfiniteScrollProps) {
  const [products, setProducts] = useState(initialProducts);
  const [currentPageInfo, setCurrentPageInfo] = useState(pageInfo);
  const [loading, setLoading] = useState(false);
  const [hasJavaScript, setHasJavaScript] = useState(false);

  // Keep track of previous filters and sort to detect actual changes
  const previousFiltersRef = useRef<string>(JSON.stringify(filters));
  const previousSortRef = useRef<string | undefined>(currentSort);
  const isInitialLoadRef = useRef(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Progressive enhancement - detect JS availability
  useEffect(() => {
    setHasJavaScript(true);
  }, []);

  // Reset products when filters or sort actually change, not on limit changes
  useEffect(() => {
    const currentFiltersString = JSON.stringify(filters);
    const filtersChanged = previousFiltersRef.current !== currentFiltersString;
    const sortChanged = previousSortRef.current !== currentSort;

    if (filtersChanged || sortChanged || isInitialLoadRef.current) {
      setProducts(initialProducts);
      setCurrentPageInfo(pageInfo || null);
      previousFiltersRef.current = currentFiltersString;
      previousSortRef.current = currentSort;
      isInitialLoadRef.current = false;
    }
  }, [filters, currentSort, initialProducts, pageInfo]);

  // Restore scroll position on back navigation
  useEffect(() => {
    // Only restore scroll if we have more than the base amount of products
    if (currentLimit > 9 && products.length >= currentLimit) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const scrollPosition = sessionStorage.getItem(
          `scroll-${collectionHandle}`
        );
        if (scrollPosition) {
          window.scrollTo(0, parseInt(scrollPosition, 10));
          sessionStorage.removeItem(`scroll-${collectionHandle}`);
        }
      }, 100);
    }
  }, [currentLimit, products.length, collectionHandle]);

  const updateURLQuietly = useCallback(
    (newLimit: number) => {
      // Update URL without triggering navigation
      const params = new URLSearchParams();
      searchParams.forEach((value, key) => {
        if (key !== "limit") {
          params.append(key, value);
        }
      });
      params.set("limit", newLimit.toString());

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);
    },
    [searchParams]
  );

  const handleSortChange = useCallback(
    (sortValue: string) => {
      const params = new URLSearchParams();

      // Preserve all current parameters except sort
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && key !== "sort") {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else {
            params.set(key, value);
          }
        }
      });

      // Add the new sort parameter
      if (sortValue && sortValue !== "default") {
        params.set("sort", sortValue);
      }

      // Navigate to new URL with sort parameter
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.push(newUrl);
    },
    [currentFilters, router]
  );

  const loadMore = useCallback(async () => {
    if (!currentPageInfo?.hasNextPage || loading) {
      return;
    }

    setLoading(true);

    try {
      // Parse current sort parameters
      const parseSortParam = (sortParam?: string) => {
        if (!sortParam) return { sortKey: undefined, reverse: undefined };

        const [sortKey, order] = sortParam.split("-");
        const validSortKeys = ["TITLE", "PRICE", "BEST_SELLING", "CREATED"];

        if (!validSortKeys.includes(sortKey)) {
          return { sortKey: undefined, reverse: undefined };
        }

        return {
          sortKey: sortKey as "TITLE" | "PRICE" | "BEST_SELLING" | "CREATED",
          reverse: order === "desc",
        };
      };

      const { sortKey, reverse } = parseSortParam(currentSort);

      const result = await loadMoreProducts({
        collectionHandle,
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
        // Append new products to existing ones
        setProducts((prevProducts) => [
          ...prevProducts,
          ...result.newProducts!,
        ]);
        setCurrentPageInfo(result.pageInfo);

        // Update URL for SEO and back navigation
        const newLimit = products.length + result.newProducts.length;
        updateURLQuietly(newLimit);

        // Save scroll position for back navigation
        sessionStorage.setItem(
          `scroll-${collectionHandle}`,
          window.scrollY.toString()
        );
      }
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setLoading(false);
    }
  }, [
    collectionHandle,
    currentPageInfo?.hasNextPage,
    products.length,
    filters,
    updateURLQuietly,
    currentSort,
  ]);

  // Infinite scroll handler
  useEffect(() => {
    if (!hasJavaScript) return;

    const handleScroll = () => {
      // Don't trigger if already loading or no more pages
      if (loading || !currentPageInfo?.hasNextPage) return;

      // Load more when user is 200px from bottom
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 200
      ) {
        loadMore();
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 200);
    window.addEventListener("scroll", throttledHandleScroll);

    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [loadMore, hasJavaScript, loading, currentPageInfo?.hasNextPage]);

  // Throttle function to limit scroll event frequency
  function throttle(func: (...args: any[]) => void, limit: number) {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Generate load more URL for no-JS fallback
  const getLoadMoreUrl = () => {
    const params = new URLSearchParams();

    // Preserve current filters
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== undefined && key !== "limit") {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    });

    // Add increased limit for pagination
    const newLimit = products.length + 9;
    params.set("limit", newLimit.toString());

    return `?${params.toString()}`;
  };

  return (
    <div>
      {/* Sort Dropdown */}
      <div className="flex justify-end items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select
            value={currentSort || "default"}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
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

      <ProductGridLayout2 products={products} />

      {/* Load More Section */}
      {currentPageInfo?.hasNextPage && (
        <div className="flex justify-center mt-8">
          {hasJavaScript ? (
            /* Enhanced JS version */
            <Button
              onClick={loadMore}
              disabled={loading}
              className="min-w-[140px]"
              variant="outline"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Products"
              )}
            </Button>
          ) : (
            /* Fallback for no-JS (SEO bots) */
            <a
              href={getLoadMoreUrl()}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 min-w-[140px]"
            >
              Load More Products
            </a>
          )}
        </div>
      )}
    </div>
  );
}
