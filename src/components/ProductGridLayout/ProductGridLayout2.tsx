import { Product } from "@nextshopkit/pro-development";
import Card1 from "../ProductCards/Card1";

interface ProductGridLayoutProps {
  products: Product[];
}

export default function ProductGridLayout2({
  products,
}: ProductGridLayoutProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
      {products.map((product) => (
        <div key={product.id} className="aspect-[4/5]">
          <Card1 product={product} />
        </div>
      ))}
    </div>
  );
}
