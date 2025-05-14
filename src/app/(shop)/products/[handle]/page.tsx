import ProductHeader from "@/components/ProductHeader/ProductHeader";
import ShopLayout from "@/Layouts/ShopLayout";
import { fetchProduct } from "@/lib/nextshopkit/product";
import { notFound } from "next/navigation";
import React from "react";

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { handle } = await params;
  const result = await fetchProduct({
    handle,
  });

  if (result.error || !result.data) {
    return notFound();
  }

  return (
    <>
      <ProductHeader product={result.data} />
    </>
  );
};

export default ProductPage;
