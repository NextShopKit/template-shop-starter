"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@nextshopkit/pro-development/client";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const { totalCount } = useCart();

  const handleSearch = () => {
    console.log("Search clicked:", query);
    // Add your logic here
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("Enter pressed:", query);
      // Add your logic here
    }
  };
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

            <Link href="/" className="text-sm text-gray-500">
              All products
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden sm:flex items-center flex-1 max-w-md mx-auto">
            <Input
              type="search"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="rounded-none rounded-l-md border-r-0"
            />
            <Button
              type="button"
              onClick={handleSearch}
              className="rounded-none rounded-r-md cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Cart */}
          <div className="relative flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Cart"
              className="cursor-pointer"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>

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
        <div className="sm:hidden px-4 pb-3 flex items-center">
          <Input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rounded-none rounded-l-md border-r-0"
          />
          <Button
            type="button"
            onClick={handleSearch}
            className="rounded-none rounded-r-md cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
