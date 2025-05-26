import { ProductHeader } from "@/components/features/product";
import ShopLayout from "@/layouts/ShopLayout";
import { fetchProduct } from "@/lib/nextshopkit/product";
import { notFound } from "next/navigation";
import React from "react";

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

/**
 * Product detail page for the NextShopKit starter template.
 * Fetches product data from Shopify using NextShopKit's product utilities.
 * Handles 404 state if the product is not found or fetch fails.
 * Renders the main product header/details using a dedicated component.
 */
const ProductPage = async ({ params }: ProductPageProps) => {
  const { handle } = await params;

  // Fetch product data from Shopify via NextShopKit SDK
  const result = await fetchProduct({
    handle,
  });

  // Show 404 page if product doesn't exist or fetch errored
  if (result.error || !result.data) {
    return notFound();
  }

  // Render product details (header, gallery, etc.)
  return (
    <>
      <ProductHeader product={result.data} />
    </>
  );
};

export default ProductPage;
