"use client";

import { Suspense } from "react";
import { Search } from "lucide-react";
import FilterSidebar from "@/components/FilterSidebar/FilterSidebar";
import SearchGridWithInfiniteScroll from "@/components/SearchGridLayout/SearchGridWithInfiniteScroll";

interface SearchPageClientProps {
  products: any[];
  pageInfo: any;
  availableFilters: any[];
  urlParams: { [key: string]: string | string[] | undefined };
  query: string;
  filters: any[];
  limit: number;
  sortParam?: string;
}

function FilterSidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filter section 1 */}
      <div>
        <div className="animate-pulse bg-gray-200 h-5 w-20 rounded mb-3"></div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="animate-pulse bg-gray-200 h-4 w-4 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter section 2 */}
      <div>
        <div className="animate-pulse bg-gray-200 h-5 w-16 rounded mb-3"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="animate-pulse bg-gray-200 h-4 w-4 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Price filter */}
      <div>
        <div className="animate-pulse bg-gray-200 h-5 w-12 rounded mb-3"></div>
        <div className="space-y-3">
          <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
          <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
        </div>
      </div>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div>
      {/* Sort Controls Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="animate-pulse bg-gray-200 h-5 w-32 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-10 w-48 rounded"></div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="space-y-3">
            {/* Product Image */}
            <div className="animate-pulse bg-gray-200 aspect-square rounded-lg"></div>

            {/* Product Title */}
            <div className="space-y-2">
              <div className="animate-pulse bg-gray-200 h-5 w-full rounded"></div>
              <div className="animate-pulse bg-gray-200 h-5 w-3/4 rounded"></div>
            </div>

            {/* Product Price */}
            <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>

            {/* Product Variants/Options */}
            <div className="flex space-x-2">
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className="animate-pulse bg-gray-200 h-8 w-8 rounded"
                ></div>
              ))}
            </div>

            {/* Add to Cart Button */}
            <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
          </div>
        ))}
      </div>

      {/* Load More Button Skeleton */}
      <div className="flex justify-center">
        <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
      </div>
    </div>
  );
}

export default function SearchPageClient({
  products,
  pageInfo,
  availableFilters,
  urlParams,
  query,
  filters,
  limit,
  sortParam,
}: SearchPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="page-container flex gap-8 py-6">
          <div className="w-1/4">
            <FilterSidebarSkeleton />
          </div>
          <div className="w-3/4">
            <SearchResultsSkeleton />
          </div>
        </div>
      }
    >
      <div className="page-container flex gap-8 py-6">
        <div className="w-1/4">
          <FilterSidebar
            availableFilters={availableFilters}
            currentFilters={urlParams}
          />
        </div>
        <div className="w-3/4">
          {products && products.length > 0 ? (
            <SearchGridWithInfiniteScroll
              initialProducts={products}
              pageInfo={pageInfo}
              searchQuery={query}
              filters={filters}
              currentFilters={urlParams}
              currentLimit={limit}
              currentSort={sortParam}
            />
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-lg font-semibold mb-2">No products found</h2>
              <p className="text-gray-600">
                {filters.length > 0
                  ? `No results found for "${query}" with the current filters. Try adjusting your filters or search term.`
                  : `No results found for "${query}". Try different keywords or check the spelling.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
