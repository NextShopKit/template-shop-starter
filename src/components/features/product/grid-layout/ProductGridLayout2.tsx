import { Product } from "@nextshopkit/sdk";
import { ProductCard1 } from "../cards";

interface ProductGridLayoutProps {
  products: Product[];
}

/**
 * Responsive product grid for the NextShopKit starter template.
 * - Renders a grid of Card1 product cards using NextShopKit product data
 * - Mobile-first, adapts to 1/2/3 columns based on screen size
 * - Used for collection, search, and featured product sections
 */
export default function ProductGridLayout2({
  products,
}: ProductGridLayoutProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
      {/* Each product rendered as a Card1 (NextShopKit-aware) */}
      {products.map((product) => (
        <div key={product.id} className="aspect-[4/5]">
          <ProductCard1 product={product} />
        </div>
      ))}
    </div>
  );
}
