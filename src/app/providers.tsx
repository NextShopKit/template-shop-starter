"use client";
import CartProvider from "@/providers/CartProvider";
import ConsentProvider from "@/providers/ConsentProvider";
import { ReactNode } from "react";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <CartProvider>
      <ConsentProvider>{children}</ConsentProvider>
    </CartProvider>
  );
};
