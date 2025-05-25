import { Product } from "@nextshopkit/sdk";
import Card1 from "../ProductCards/Card1";

interface ProductGridLayoutProps {
  products: Product[];
}

/**
 * Featured product grid layout for the NextShopKit starter homepage
 * Creates an asymmetric grid with one large featured product and two smaller ones
 * Uses NextShopKit Product types for type safety
 */
export default function ProductGridLayout({
  products,
}: ProductGridLayoutProps) {
  // Extract first three products for the featured layout
  const product1 = products[0];
  const product2 = products[1];
  const product3 = products[2];

  return (
    <div className="page-container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
        {/* Large featured product on the left */}
        <div className="md:col-span-2 aspect-[4/3]">
          <Card1 product={product1} />
        </div>

        {/* Two smaller products stacked on the right */}
        <div className="flex flex-col gap-6 h-full">
          <div className="flex-1 aspect-[4/3] md:aspect-auto">
            <Card1 product={product2} />
          </div>
          <div className="flex-1 aspect-[4/3] md:aspect-auto">
            <Card1 product={product3} />
          </div>
        </div>
      </div>
    </div>
  );
}
