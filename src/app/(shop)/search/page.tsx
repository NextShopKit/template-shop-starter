import { Search } from "lucide-react";
import { fetchSearchResults } from "@/lib/nextshopkit/search";
import { SearchPageClient } from "@/components/features/search";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Detailed skeleton components
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

function TypingIndicator({ query }: { query: string }) {
  return (
    <div className="page-container py-4 px-4 sm:py-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="hidden lg:block lg:w-1/4">
          <FilterSidebarSkeleton />
        </div>
        <div className="w-full lg:w-3/4">
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="text-center">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                <span className="text-sm sm:text-base text-gray-600">
                  Searching for &ldquo;{query}&rdquo;...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const urlParams = await searchParams;
  const query = (urlParams.query as string) || "";
  const shouldExecuteSearch = urlParams.execute === "true";

  const parseFilters = (params: {
    [key: string]: string | string[] | undefined;
  }) => {
    const filters: (
      | { available?: boolean }
      | { variantOption?: { name: string; value: string } }
      | { productMetafield: { namespace: string; key: string; value: string } }
      | { productTag: string }
      | { productType: string }
      | { collection?: string }
      | { price: { min?: number; max?: number } }
    )[] = [];

    Object.entries(params).forEach(([key, value]) => {
      if (key.startsWith("filter_") && value) {
        const filterKey = key.replace("filter_", "");
        const values = Array.isArray(value) ? value : [value];

        values.forEach((val) => {
          if (!val) return;

          switch (filterKey) {
            case "available":
              filters.push({ available: val === "true" });
              break;
            case "price":
              const [min, max] = val.split("-");
              filters.push({
                price: {
                  min: min ? parseFloat(min) : undefined,
                  max: max ? parseFloat(max) : undefined,
                },
              });
              break;
            case "productType":
              filters.push({ productType: val });
              break;
            case "productTag":
              filters.push({ productTag: val });
              break;
            case "collection":
              filters.push({ collection: val });
              break;
            default:
              // Check if this is a product metafield (pattern: namespace.key)
              if (filterKey.includes(".")) {
                const [namespace, key] = filterKey.split(".");
                filters.push({
                  productMetafield: {
                    namespace,
                    key,
                    value: val,
                  },
                });
              } else {
                // Handle variant options (size, color, etc.)
                filters.push({
                  variantOption: {
                    name: filterKey,
                    value: val,
                  },
                });
              }
          }
        });
      }
    });

    return filters;
  };

  // If no query, show empty state
  if (!query.trim()) {
    return (
      <div className="page-container py-4 px-4 sm:py-6">
        <div className="text-center py-12 sm:py-16">
          <Search className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Start searching
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
            Enter a search term in the navigation bar to find products. You can
            search by product name, description, tags, or any other product
            information.
          </p>
        </div>
      </div>
    );
  }

  const filters = parseFilters(urlParams);

  // Extract limit from URL params (how many products should be visible)
  const requestedLimit = urlParams.limit
    ? parseInt(urlParams.limit as string, 10)
    : 9; // Default to 9 products

  // Ensure minimum limit and reasonable maximum
  const limit = Math.max(9, Math.min(requestedLimit, 100));

  // Extract sort parameters from URL
  const sortParam = urlParams.sort as string;
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

  const { sortKey, reverse } = parseSortParam(sortParam);

  // Perform the search on the server
  const searchData = await fetchSearchResults({
    query: query.trim(),
    limit,
    ...(filters.length > 0 && { filters }),
    ...(sortKey && { sortKey }),
    ...(reverse !== undefined && { reverse }),
  });

  const { products, error, availableFilters, pageInfo, totalCount } =
    searchData;

  if (error) {
    return (
      <div className="page-container py-4 px-4 sm:py-6">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">
            Error
          </h1>
          <p className="text-sm sm:text-base text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <SearchPageClient
      products={products}
      pageInfo={pageInfo}
      availableFilters={availableFilters}
      urlParams={urlParams}
      query={query}
      filters={filters}
      limit={limit}
      sortParam={sortParam}
      totalCount={totalCount}
    />
  );
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: SearchPageProps) {
  const urlParams = await searchParams;
  const query = (urlParams.query as string) || "";

  if (query.trim()) {
    return {
      title: `Search results for "${query}"`,
      description: `Find products matching "${query}" in our store.`,
    };
  }

  return {
    title: "Search Products",
    description: "Search for products in our store.",
  };
}
