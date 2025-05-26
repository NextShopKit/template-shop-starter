"use client";
import { cn } from "@/lib/utils";
import { Product } from "@nextshopkit/sdk";
import { useCart } from "@nextshopkit/sdk/client";
import { ChevronRight, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import { QuantitySelector } from "@/components/shared";

interface ProductHeaderProps {
  product: Product;
}

/**
 * ProductHeader for the NextShopKit starter template.
 * - Renders a full product detail view (PDP) with images, variants, price, and add-to-cart
 * - Integrates with NextShopKit's product and cart state
 * - Handles variant selection, quantity, and availability
 * - Responsive, mobile-first, and accessible
 */
const ProductHeader = ({ product }: ProductHeaderProps) => {
  const { title, featuredImage, images, metafields, variants } = product;
  const [currentImage, setCurrentImage] = React.useState(featuredImage);
  const [selectedVariant, setSelectedVariant] = React.useState(variants[0]);
  const [quantity, setQuantity] = React.useState(1);
  const userLocale = navigator.language;

  const { addProducts } = useCart();
  const [loading, setLoading] = React.useState(false);

  // Add selected variant/quantity to cart (NextShopKit action)
  const handleAddToCart = async (variantId: string) => {
    try {
      setLoading(true);
      await addProducts([{ merchandiseId: variantId, quantity: quantity }]);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container px-4 sm:px-6">
      {/*
        Breadcrumb navigation for PDP context
        (links back to all products)
      */}
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
            <ChevronRight className="text-gray-400 h-4 w-4" />
          </li>
          <li
            aria-current="page"
            className="font-medium text-foreground truncate"
          >
            {title}
          </li>
        </ol>
      </nav>

      {/*
        Main product layout: images (left), details (right)
        - Mobile: stacked, Desktop: side-by-side
      */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 py-4">
        {/* Product Images - full width on mobile, half on desktop */}
        <div className="w-full lg:w-1/2">
          {/* Main product image with zoom-on-hover */}
          <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200 shadow-md group">
            <div className="w-full h-full relative transition-transform duration-300 group-hover:scale-105">
              <Image
                src={currentImage?.originalSrc ?? ""}
                alt={currentImage?.altText ?? title}
                fill
                className="object-contain select-none pointer-events-none"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Image gallery thumbnails (if multiple images) */}
          {images && images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {images?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImage(image)}
                  className="flex-shrink-0 aspect-square w-16 sm:w-20 cursor-pointer relative overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:ring-2 hover:ring-black transition-all"
                >
                  <Image
                    src={image?.originalSrc ?? ""}
                    alt={image?.altText ?? title}
                    fill
                    className="object-contain pointer-events-none"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details - full width on mobile, half on desktop */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">{title}</h1>

          {/* Product short description from Shopify metafields */}
          {metafields?.general?.shortDescription && (
            <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
              {metafields?.general?.shortDescription}
            </p>
          )}

          {/* Price display for selected variant */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
            <span className="text-lg sm:text-xl font-semibold text-gray-700">
              Price:
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-cyan-700">
              {formatCurrency(selectedVariant.price, userLocale)}
            </span>
          </div>

          {/* Variant selector (if multiple variants) */}
          {variants.length > 1 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Variants</h2>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant, index) => (
                  <Button
                    key={index}
                    disabled={!variant.availableForSale}
                    onClick={() => setSelectedVariant(variant)}
                    size="sm"
                    className={cn(
                      "px-3 py-2 text-sm rounded-full border transition-colors cursor-pointer",
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

          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Quantity</h3>
            <QuantitySelector
              value={quantity}
              setValue={setQuantity}
              loading={loading}
              size="md"
              min={1}
              max={10}
            />
          </div>

          {/* Add to Cart Button */}
          <div className="w-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-w-48"
              aria-label="Add to cart"
              disabled={loading || !selectedVariant.availableForSale}
              onClick={() => handleAddToCart(selectedVariant.id)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {loading ? "Adding..." : "Add to cart"}
            </Button>
          </div>

          {/* Availability status for selected variant */}
          <div className="mt-4">
            <span
              className={cn(
                "text-sm font-medium",
                selectedVariant.availableForSale
                  ? "text-green-600"
                  : "text-red-600"
              )}
            >
              {selectedVariant.availableForSale ? "In stock" : "Out of stock"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
