import ProductGridLayout from "@/components/ProductGridLayout/ProductGridLayout";
import { fetchCollectionWithMetafields } from "@/lib/nextshopkit/collection";

export default async function Home() {
  const result = await fetchCollectionWithMetafields({
    collectionHandle: "home-page",
    includeProducts: true,
  });
  console.log("result", result);
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
      <ProductGridLayout products={products} />
    </>
  );
}
