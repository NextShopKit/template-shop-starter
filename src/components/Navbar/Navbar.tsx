"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@nextshopkit/pro-development/client";
import SearchInput from "@/components/SearchInput/SearchInput";

export default function Navbar() {
  const { totalCount } = useCart();
  const cartCount = totalCount;

  return (
    <header className="w-full border-b bg-white">
      <div className="page-container">
        <div className="mx-auto py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold">
              <Link href="/">Acme Store</Link>
            </div>

            <Link href="/collections/all" className="text-sm text-gray-500">
              All products
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden sm:flex items-center flex-1 max-w-md mx-auto">
            <SearchInput placeholder="Search products..." className="flex-1" />
          </div>

          {/* Cart */}
          <div className="relative flex items-center gap-2">
            <Link href="/cart" scroll={false}>
              <Button
                variant="outline"
                size="icon"
                aria-label="Cart"
                className="cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            {cartCount > 0 && (
              <Badge
                className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-xs px-1.5 py-0.5 rounded-full"
                variant="secondary"
              >
                {cartCount}
              </Badge>
            )}
          </div>
        </div>
        {/* Search on Mobile */}
        <div className="sm:hidden px-4 pb-3">
          <SearchInput placeholder="Search products..." />
        </div>
      </div>
    </header>
  );
}
