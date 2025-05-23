import { fetchCollectionWithMetafields } from "@/lib/nextshopkit/collection";
import FilterSidebar from "@/components/FilterSidebar/FilterSidebar";
import ProductGridWithInfiniteScroll from "@/components/ProductGridLayout/ProductGridWithInfiniteScroll";
import Image from "next/image";

interface CollectionPageProps {
  params: Promise<{ collectionHandle: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { collectionHandle } = await params;
  const urlParams = await searchParams;

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

  if (error) {
    return (
      <div className="page-container py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">{collectionData.error}</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="page-container py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Collection Not Found</h1>
          <p className="text-gray-600">
            The requested collection could not be found.
          </p>
        </div>
      </div>
    );
  }

  console.log(collectionMetafields);

  return (
    <div className="page-container flex gap-8 py-6">
      <div className="w-1/4">
        <FilterSidebar
          availableFilters={availableFilters}
          currentFilters={urlParams}
        />
      </div>
      <div className="w-3/4">
        <div className="flex items-start gap-6 mb-6">
          <div className="flex-shrink-0">
            <Image
              src={collectionMetafields?.custom?.mainImage?.url}
              alt={collection?.title}
              width={90}
              height={90}
              className="w-[90px] h-[90px] rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{collection?.title}</h1>
            {collectionMetafields?.custom?.shortDescription && (
              <p className="text-gray-600">
                {collectionMetafields?.custom?.shortDescription}
              </p>
            )}
          </div>
        </div>
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
          <div className="text-center py-12">
            <h2 className="text-lg font-semibold mb-2">No products found</h2>
            <p className="text-gray-600">
              {filters.length > 0
                ? "Try adjusting your filters to see more products."
                : "This collection doesn't have any products yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
