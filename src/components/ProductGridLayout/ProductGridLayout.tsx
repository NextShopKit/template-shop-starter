import { Product } from "@nextshopkit/sdk";
import Card1 from "../ProductCards/Card1";

interface ProductGridLayoutProps {
  products: Product[];
}

export default function ProductGridLayout({
  products,
}: ProductGridLayoutProps) {
  const product1 = products[0];
  const product2 = products[1];
  const product3 = products[2];

  return (
    <div className="page-container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
        {/* Left Large Box */}
        <div className="md:col-span-2 aspect-[4/3]">
          <Card1 product={product1} />
        </div>

        {/* Right Two Boxes */}
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
