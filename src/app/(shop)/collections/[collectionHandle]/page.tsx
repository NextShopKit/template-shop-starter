import { fetchCollectionWithMetafields } from "@/lib/nextshopkit/collection";
import { FilterSidebar } from "@/components/features/search";
import { ProductGridWithInfiniteScroll } from "@/components/features/product";
import Image from "next/image";

interface CollectionPageProps {
  params: Promise<{ collectionHandle: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Dynamic collection page for the NextShopKit starter template
 * Handles collection display with filtering, sorting, and pagination
 * Demonstrates advanced NextShopKit features like metafields and filters
 */
export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { collectionHandle } = await params;
  const urlParams = await searchParams;

  /**
   * Parse URL parameters into NextShopKit filter format
   * Supports various filter types: availability, price, product type, tags, metafields, and variant options
   * URL format: ?filter_size=large&filter_price=10-50&filter_available=true
   */
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
              // Parse price range format: "min-max" (e.g., "10-50")
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
              // Handle product metafields (format: namespace.key)
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
                // Handle variant options (size, color, material, etc.)
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

  const filters = parseFilters(urlParams);

  // Parse pagination limit from URL with sensible defaults
  const requestedLimit = urlParams.limit
    ? parseInt(urlParams.limit as string, 10)
    : 9; // Default to 9 products

  // Ensure reasonable limits for performance
  const limit = Math.max(9, Math.min(requestedLimit, 100));

  /**
   * Parse sort parameters from URL format: "SORTKEY-order"
   * Examples: "PRICE-desc", "TITLE-asc", "BEST_SELLING-desc"
   */
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

  // Fetch collection data using NextShopKit with all parsed parameters
  const collectionData = await fetchCollectionWithMetafields({
    collectionHandle,
    limit,
    ...(filters.length > 0 && { filters }),
    ...(sortKey && { sortKey }),
    ...(reverse !== undefined && { reverse }),
  });

  const {
    collection,
    collectionMetafields,
    products,
    error,
    availableFilters,
    pageInfo,
  } = collectionData;

  // Error handling for failed collection fetch
  if (error) {
    return (
      <div className="page-container py-4 px-4 sm:py-6">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">
            Error
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {collectionData.error}
          </p>
        </div>
      </div>
    );
  }

  // Handle case where collection doesn't exist
  if (!collection) {
    return (
      <div className="page-container py-4 px-4 sm:py-6">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">
            Collection Not Found
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            The requested collection could not be found.
          </p>
        </div>
      </div>
    );
  }

  console.log(collectionMetafields);

  return (
    <div className="page-container py-4 px-4 sm:py-6">
      {/* Responsive layout: mobile-first with desktop sidebar */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Desktop filter sidebar - hidden on mobile */}
        <div className="hidden lg:block lg:w-1/4">
          <FilterSidebar
            availableFilters={availableFilters}
            currentFilters={urlParams}
            isMobile={false}
          />
        </div>

        {/* Main content area */}
        <div className="w-full lg:w-3/4">
          {/* Collection header with image and description from metafields */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Image
                src={collectionMetafields?.custom?.mainImage?.url}
                alt={collection?.title}
                width={90}
                height={90}
                className="w-16 h-16 sm:w-[90px] sm:h-[90px] rounded-full object-cover"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold mb-2">
                {collection?.title}
              </h1>
              {/* Display collection description from metafields */}
              {collectionMetafields?.custom?.shortDescription && (
                <p className="text-sm sm:text-base text-gray-600">
                  {collectionMetafields?.custom?.shortDescription}
                </p>
              )}
            </div>
          </div>

          {/* Mobile filter button - only visible on mobile */}
          <div className="lg:hidden mb-4">
            <FilterSidebar
              availableFilters={availableFilters}
              currentFilters={urlParams}
              isMobile={true}
            />
          </div>

          {/* Product grid with infinite scroll or empty state */}
          {products && products.length > 0 ? (
            <ProductGridWithInfiniteScroll
              initialProducts={products}
              pageInfo={pageInfo}
              collectionHandle={collectionHandle}
              filters={filters}
              currentFilters={urlParams}
              currentLimit={limit}
              currentSort={sortParam}
            />
          ) : (
            <div className="text-center py-8 sm:py-12">
              <h2 className="text-base sm:text-lg font-semibold mb-2">
                No products found
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {filters.length > 0
                  ? "Try adjusting your filters to see more products."
                  : "This collection doesn't have any products yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
