"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductGridLayout2 from "../ProductGridLayout/ProductGridLayout2";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loadMoreSearchResults } from "@/lib/actions/loadMoreSearchResults";

import type { Product, ProductsPageInfo } from "@nextshopkit/pro-development";

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

interface SearchGridWithInfiniteScrollProps {
  initialProducts: Product[];
  pageInfo: ProductsPageInfo | null | undefined;
  searchQuery: string;
  filters: any[];
  currentFilters: { [key: string]: string | string[] | undefined };
  currentLimit: number;
  currentSort?: string;
}

export default function SearchGridWithInfiniteScroll({
  initialProducts,
  pageInfo,
  searchQuery,
  filters,
  currentFilters,
  currentLimit,
  currentSort,
}: SearchGridWithInfiniteScrollProps) {
  const [products, setProducts] = useState(initialProducts);
  const [currentPageInfo, setCurrentPageInfo] = useState(pageInfo);
  const [loading, setLoading] = useState(false);
  const [hasJavaScript, setHasJavaScript] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Progressive enhancement - detect JS availability
  useEffect(() => {
    setHasJavaScript(true);
  }, []);

  // Reset products when initial products change (from server-side updates)
  useEffect(() => {
    setProducts(initialProducts);
    setCurrentPageInfo(pageInfo || null);
  }, [initialProducts, pageInfo]);

  // Restore scroll position on back navigation
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

  const updateURLQuietly = useCallback(
    (newLimit: number) => {
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
    if (!currentPageInfo?.hasNextPage || loading || !searchQuery.trim()) {
      return;
    }

    setLoading(true);

    try {
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
        setProducts((prevProducts) => {
          // Deduplicate products to prevent duplicates
          const combined = [...prevProducts, ...result.newProducts!];
          const seen = new Set();
          return combined.filter((product) => {
            if (seen.has(product.id)) {
              return false;
            }
            seen.add(product.id);
            return true;
          });
        });
        setCurrentPageInfo(result.pageInfo);

        const newLimit = products.length + result.newProducts.length;
        updateURLQuietly(newLimit);

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

  // Infinite scroll detection
  useEffect(() => {
    if (!hasJavaScript || !currentPageInfo?.hasNextPage || loading) {
      return;
    }

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    const throttledScroll = throttle(handleScroll, 200);
    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [hasJavaScript, currentPageInfo?.hasNextPage, loading, loadMore]);

  function throttle(func: (...args: any[]) => void, limit: number) {
    let lastFunc: NodeJS.Timeout;
    let lastRan: number;
    return function (this: any, ...args: any[]) {
      if (!lastRan) {
        func.apply(this, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  const getLoadMoreUrl = () => {
    const params = new URLSearchParams();
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    });
    params.set("limit", (products.length + 12).toString());
    return `${window.location.pathname}?${params.toString()}`;
  };

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {products.length} {products.length === 1 ? "result" : "results"}
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

      {/* Products Grid */}
      <ProductGridLayout2 products={products} />

      {/* Load More Button */}
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
