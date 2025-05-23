import { CartLine } from "@nextshopkit/pro-development";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useCart } from "@nextshopkit/pro-development/client";
import Link from "next/link";
import QuantitySelector from "../Reusables/QuantitySelector";

interface CartItem1Props {
  line: CartLine;
}

const CartItem1 = ({ line }: CartItem1Props) => {
  const { removeProduct, updateQuantity } = useCart();
  const [loading, setLoading] = React.useState(false);

  const handleRemove = async () => {
    try {
      setLoading(true);
      await removeProduct(line.id);
    } catch (error) {
      console.error("Error removing product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (lineId: string, quantity: number) => {
    try {
      setLoading(true);
      await updateQuantity(lineId, quantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div key={line.id} className="flex gap-4 items-center">
      <div>
        <div className="aspect-square h-21 relative overflow-hidden rounded-lg border border-gray-200 ">
          <Image
            src={line?.merchandise?.image?.url ?? ""}
            alt={line?.merchandise?.image?.altText ?? ""}
            fill
            className="object-contain pointer-events-none"
            sizes="(max-width: 768px) 100vw, 10vw"
          />
        </div>
      </div>
      <div className="flex-1 self-start">
        <Link
          href={`/products/${line.merchandise.product.handle}`}
          scroll={false}
          aria-label={`View ${line.merchandise.product.title}`}
          title={`View ${line.merchandise.product.title}`}
        >
          <h3
            className="text-md font-semibold truncate"
            title={`${line.merchandise.product.title}`}
          >
            {line.merchandise.product.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 my-1">
          {line.quantity} x {line.merchandise.price.amount}
          {line.merchandise.title !== "Default Title" &&
            ` (${line.merchandise.title})`}
        </p>
        <QuantitySelector
          value={line.quantity}
          setValue={(value) => handleUpdateQuantity(line.id, value)}
          loading={loading}
          size="sm"
          min={0}
          max={10}
        />
      </div>
      <div>
        <Button
          variant="ghost"
          className="text-gray-500 hover:text-gray-700"
          onClick={() => handleRemove()}
          aria-label="Close cart drawer"
          disabled={loading}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};

export default CartItem1;
