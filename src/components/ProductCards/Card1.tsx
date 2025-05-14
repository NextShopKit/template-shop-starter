import { Product } from "@nextshopkit/pro-development";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface ProductProps {
  product: Product;
}

const Card1 = ({ product }: ProductProps) => {
  const { title, featuredImage, price, compareAtPrice, handle } = product;

  const { amount, currencyCode } = price;

  const productPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);

  const productCompareAtPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: compareAtPrice?.currencyCode ?? currencyCode,
  }).format(compareAtPrice?.amount ?? 0);

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden border border-gray-200 shadow-md group">
      {/* Image Zoom on Hover */}
      <div className="w-full h-full relative transition-transform duration-300 group-hover:scale-105">
        <Image
          src={featuredImage?.originalSrc ?? ""}
          alt={featuredImage?.altText ?? title}
          fill
          className="object-contain select-none pointer-events-none"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />
      </div>

      {/* Price + CTA Overlay */}
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
          <Button type="button" className="cursor-pointer">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Card1;
