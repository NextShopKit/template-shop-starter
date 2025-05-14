import ProductGridLayout from "@/components/ProductGridLayout/ProductGridLayout";
import { fetchCollectionWithMetafields } from "@/lib/nextshopkit/collection";

export default async function Home() {
  const result = await fetchCollectionWithMetafields({
    collectionHandle: "home-page",
    includeProducts: true,
  });
  const {
    data,
    error,
    pageInfo,
    collectionMetafields,
    collection,
    availableFilters,
  } = result;

  console.log("Collection data:", result);
  return (
    <>
      <div className="page-container">
        <h1 className="mt-6 mb-2 px-4 relative">Featured products</h1>
      </div>
      <ProductGridLayout products={data} />
    </>
  );
}
