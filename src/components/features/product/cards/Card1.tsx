"use client";
import { Product } from "@nextshopkit/sdk";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";
import { useCart } from "@nextshopkit/sdk/client";
import { useRouter } from "next/navigation";

interface ProductProps {
  product: Product;
}

/**
 * Product card for the NextShopKit starter template.
 * - Displays product image, title, price, and compare-at price
 * - Integrates with NextShopKit's cart system for add-to-cart
 * - Responsive, accessible, and optimized for e-commerce UX
 * - Used in product grids, featured sections, and search results
 */
const Card1 = ({ product }: ProductProps) => {
  const { title, featuredImage, price, compareAtPrice, handle } = product;
  const { loading, addProducts } = useCart();
  const userLocale = navigator.language;
  const router = useRouter();

  // Format prices for display
  const productPrice = formatCurrency(price, userLocale);
  const productCompareAtPrice = formatCurrency(compareAtPrice, userLocale);

  // Add product to cart using NextShopKit's cart system
  const handleAddToCart = async () => {
    try {
      await addProducts([
        { merchandiseId: product.variants[0].id, quantity: 1 },
      ]);
      router.push("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden border border-gray-200 shadow-md group">
      {/*
        Product image with zoom-on-hover effect.
        Uses NextShopKit product image data.
      */}
      <div className="w-full h-full relative transition-transform duration-300 group-hover:scale-105">
        {featuredImage?.originalSrc ? (
          <Image
            src={featuredImage.originalSrc}
            alt={featuredImage.altText ?? title}
            fill
            className="object-contain select-none pointer-events-none"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
      </div>

      {/*
        Price and add-to-cart overlay.
        - Shows product title (links to PDP)
        - Shows price and compare-at price
        - Add-to-cart button uses NextShopKit cart logic
      */}
      <div className="absolute bottom-0 left-0 bg-white/90 rounded px-4 py-2 w-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <Link
              href={`/products/${handle}`}
              className="text-md font-semibold hover:underline"
            >
              {title}
            </Link>
            <div className="flex gap-2 items-center">
              <div className="text-sm font-semibold">{productPrice}</div>
              {compareAtPrice?.amount && (
                <div className="text-sm font-semibold line-through text-gray-400">
                  {productCompareAtPrice}
                </div>
              )}
            </div>
          </div>
          <Button
            type="button"
            className="cursor-pointer"
            onClick={() => handleAddToCart()}
            disabled={loading}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Card1;
