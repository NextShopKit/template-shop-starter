"use client";
import { cn } from "@/lib/utils";
import { Product } from "@nextshopkit/pro-development";
import { useCart } from "@nextshopkit/pro-development/client";
import { ChevronRight, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { formatCurrency } from "@/utils/formatCurrency";

interface ProductHeaderProps {
  product: Product;
}

const ProductHeader = ({ product }: ProductHeaderProps) => {
  const { title, featuredImage, images, metafields, variants } = product;
  const [currentImage, setCurrentImage] = React.useState(featuredImage);
  const [selectedVariant, setSelectedVariant] = React.useState(variants[0]);
  const userLocale = navigator.language;
  console.log("ProductHeader", product);
  const { addProducts } = useCart();
  const [loading, setLoading] = React.useState(false);

  const handleAddToCart = async (variantId: string) => {
    console.log("Add to cart clicked:", variantId);
    try {
      setLoading(true);
      await addProducts([{ merchandiseId: variantId, quantity: 1 }]);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }

    // Add your logic here
  };
  const handleBuyNow = (variantId: string) => {
    console.log("Buy now clicked:", variantId);
    // Add your logic here
  };
  return (
    <div className="page-container">
      <nav aria-label="Breadcrumb" className="w-full pt-4">
        <ol className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
          <li>
            <Link
              href="/"
              className="hover:underline font-medium text-foreground"
            >
              All products
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="text-gray-400" />
          </li>
          <li aria-current="page" className="font-medium text-foreground">
            {title}
          </li>
        </ol>
      </nav>
      <div className="flex gap-8 py-4">
        <div className="w-1/2">
          <div className="h-150 relative overflow-hidden rounded-lg border border-gray-200 shadow-md group">
            <div className="w-full h-full relative transition-transform duration-300 group-hover:scale-105">
              <Image
                src={currentImage?.originalSrc ?? ""}
                alt={currentImage?.altText ?? title}
                fill
                className="object-contain select-none pointer-events-none"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
          </div>
          {/* Add any additional product image gallery here. They are small boxes */}
          <div className="flex gap-2 mt-4">
            {images?.map((image, index) => (
              <div
                key={index}
                onClick={() => setCurrentImage(image)}
                className="aspect-square w-1/4 cursor-pointer relative overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:ring-2 hover:ring-black transition-all"
              >
                <Image
                  src={image?.originalSrc ?? ""}
                  alt={image?.altText ?? title}
                  fill
                  className="object-contain pointer-events-none"
                  sizes="(max-width: 768px) 100vw, 10vw"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2">
          <h1>{title}</h1>
          <p className="text-gray-600 mt-2">
            {metafields?.general?.shortDescription}
          </p>
          <div className="mt-4">
            {variants.length > 1 && (
              <div>
                <h2 className="text-lg font-semibold mt-4 mb-2">Variants</h2>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant, index) => (
                    <Button
                      key={index}
                      disabled={!variant.availableForSale}
                      onClick={() => setSelectedVariant(variant)}
                      className={cn(
                        "px-3 py-1 text-sm rounded-full border transition-colors cursor-pointer",
                        selectedVariant.id === variant.id
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-300 hover:bg-gray-100"
                      )}
                    >
                      {variant.variantTitle}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-6 align-center">
            <p className="text-2xl font-bold text-gray-700">Price:</p>
            <p className="text-2xl font-bold text-cyan-700">
              {formatCurrency(selectedVariant.price, userLocale)}
            </p>
          </div>
          <div className="flex gap-2 mt-4 w-max">
            <Button
              variant="outline"
              size="default"
              aria-label="Add to cart"
              disabled={loading}
              onClick={() => handleAddToCart(selectedVariant.id)}
            >
              <ShoppingCart /> Add to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
