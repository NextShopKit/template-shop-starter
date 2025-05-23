"use client";
import client from "@/lib/nextshopkit/client";
import React from "react";
import { CartProvider as LibCartProvider } from "@nextshopkit/sdk/client";

interface CartProviderProps {
  children: React.ReactNode;
}

const CartProvider = ({ children }: CartProviderProps) => {
  return <LibCartProvider client={client}>{children}</LibCartProvider>;
};

export default CartProvider;
