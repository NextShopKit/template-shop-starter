import { ProductGridLayout } from "@/components/features/product";
import { fetchCollectionWithMetafields } from "@/lib/nextshopkit/collection";

/**
 * Homepage for the NextShopKit starter template
 * Demonstrates fetching and displaying products from a Shopify collection
 * using NextShopKit's optimized collection fetching with metafields
 */
export default async function Home() {
  // Fetch the "home-page" collection with products and metafields
  // This is a server component, so data is fetched at build/request time.
  const result = await fetchCollectionWithMetafields({
    collectionHandle: "home-page",
    includeProducts: true,
  });

  const {
    products,
    error,
    pageInfo,
    collectionMetafields,
    collection,
    availableFilters,
  } = result;

  return (
    <>
      <div className="page-container">
        <h1 className="mt-6 mb-2 px-4 relative">Featured products</h1>
      </div>
      {/* Render products in a responsive grid layout */}
      <ProductGridLayout products={products} />
    </>
  );
}
