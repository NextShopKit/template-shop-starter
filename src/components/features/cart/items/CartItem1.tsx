import { CartLine } from "@nextshopkit/sdk";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useCart } from "@nextshopkit/sdk/client";
import Link from "next/link";
import { QuantitySelector } from "@/components/shared";

interface CartItem1Props {
  line: CartLine;
}

/**
 * Cart item component for the NextShopKit starter template.
 * Handles display and management of a single cart line, including:
 * - Product image, title, price, and variant
 * - Quantity controls (NextShopKit state)
 * - Remove button (mobile: overlay on image, desktop: above image)
 * - Responsive layout for mobile and desktop
 * Integrates with NextShopKit's cart state/actions for real-time updates.
 */
const CartItem1 = ({ line }: CartItem1Props) => {
  const { removeProduct, updateQuantity } = useCart();
  const [loading, setLoading] = React.useState(false);

  // Remove this product from the cart (NextShopKit action)
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

  // Update quantity for this cart line (NextShopKit action)
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
    <div
      key={line.id}
      className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full"
    >
      {/*
        Image section with responsive remove button:
        - On mobile: trash icon overlays top-right of image (absolute)
        - On desktop: trash icon is inline above image (hidden on mobile)
      */}
      <div className="flex-shrink-0 w-full sm:w-20 md:w-24">
        <div className="aspect-square min-h-[72px] sm:min-h-0 relative overflow-hidden rounded-lg border border-gray-200 ">
          {/* Remove button: absolute on mobile, inline above image on desktop */}
          {/* Mobile: absolute top-right, visible only on mobile */}
          <div className="absolute top-1 right-1 z-10 flex sm:hidden">
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={() => handleRemove()}
              aria-label="Remove item from cart"
              disabled={loading}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
          {/* Desktop: inline above image, hidden on mobile */}
          <div className="hidden sm:flex justify-end items-center mt-2 sm:mt-0">
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={() => handleRemove()}
              aria-label="Remove item from cart"
              disabled={loading}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
          <Image
            src={line?.merchandise?.image?.url ?? ""}
            alt={line?.merchandise?.image?.altText ?? ""}
            fill
            className="object-contain pointer-events-none"
            sizes="(max-width: 640px) 100vw, 96px"
          />
        </div>
      </div>
      {/*
        Details section: product title, price, variant, and quantity selector.
        - Title links to product page
        - QuantitySelector uses NextShopKit state
        - Truncation for long titles/variants
      */}
      <div className="flex-1 flex flex-col justify-between self-start min-w-0">
        <Link
          href={`/products/${line.merchandise.product.handle}`}
          scroll={false}
          aria-label={`View ${line.merchandise.product.title}`}
          title={`View ${line.merchandise.product.title}`}
        >
          <h3
            className="text-md font-semibold truncate max-w-full"
            title={`${line.merchandise.product.title}`}
          >
            {line.merchandise.product.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 my-1 truncate">
          {line.quantity} x {line.merchandise.price.amount}
          {line.merchandise.title !== "Default Title" &&
            ` (${line.merchandise.title})`}
        </p>
        <div className="mt-2 max-w-[160px] sm:max-w-none">
          <QuantitySelector
            value={line.quantity}
            setValue={(value) => handleUpdateQuantity(line.id, value)}
            loading={loading}
            size="sm"
            min={0}
            max={10}
          />
        </div>
      </div>
      {/*
        (Legacy/extra) Remove button section - only visible on desktop (sm+)
        This is now handled above in the image section for both mobile and desktop.
      */}
      {/*
      <div className="hidden sm:flex justify-end items-center mt-2 sm:mt-0">
        <Button
          variant="ghost"
          className="text-gray-500 hover:text-gray-700 p-1"
          onClick={() => handleRemove()}
          aria-label="Remove item from cart"
          disabled={loading}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
      */}
    </div>
  );
};

export default CartItem1;
