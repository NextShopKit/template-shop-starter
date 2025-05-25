"use client";
import CartProvider from "@/providers/CartProvider";
import ConsentProvider from "@/providers/ConsentProvider";
import { ReactNode } from "react";

/**
 * Root providers for the NextShopKit starter template
 * Combines cart management and consent handling for a complete e-commerce setup
 */
export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <CartProvider>
      <ConsentProvider>{children}</ConsentProvider>
    </CartProvider>
  );
};
