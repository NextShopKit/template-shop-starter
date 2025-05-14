"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@nextshopkit/pro-development/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreditCard, ShoppingBasket, Trash2, X } from "lucide-react";
import CartItem1 from "@/components/CartItems/CartItem1";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";

export default function CartDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { loading, cart, totalCount, emptyCart } = useCart();
  const userLocale = navigator.language;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [router]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timeout);
  }, []);

  const closeDrawer = () => {
    setIsClosing(true);
    setTimeout(() => {
      router.back();
    }, 300); // match your exit duration
  };
  if (pathname !== "/cart") return null;
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 backdrop-blur-sm transition-opacity duration-200",
        isClosing
          ? "opacity-0"
          : isVisible
          ? "opacity-100 bg-black/50"
          : "opacity-0"
      )}
      onClick={() => closeDrawer()}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute top-0 right-0 h-full w-[90vw] max-w-md bg-white shadow-xl transition-transform duration-300",
          "flex flex-col", // <== KEY
          isClosing
            ? "translate-x-full"
            : isVisible
            ? "translate-x-0"
            : "translate-x-full"
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBasket className="text-cyan-700 w-8 h-8" />
            <h2 className="text-xl font-bold">{totalCount} items</h2>
          </div>
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-gray-700"
            onClick={closeDrawer}
            aria-label="Close cart drawer"
            disabled={isClosing}
          >
            <X />
          </Button>
        </div>

        <hr className="border-gray-200 shrink-0" />
        <div className="px-4 pt-2 self-end">
          <Button
            variant="outline"
            onClick={() => emptyCart()}
            aria-label="View full cart"
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
            Clean cart
          </Button>
        </div>

        {/* SCROLLABLE CART ITEMS */}
        <div className="overflow-y-auto px-4 py-4 flex flex-col flex-1 gap-4">
          {cart?.lines.map((line) => (
            <CartItem1 key={line.id} line={line} />
          ))}
        </div>

        {/* FIXED BOTTOM BUTTON */}
        <div className="p-4 shrink-0 border-t border-gray-200">
          <Link
            href={cart?.checkoutUrl || "#"}
            className="w-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full">
              <CreditCard />
              Checkout ({formatCurrency(cart?.cost?.totalAmount, userLocale)})
            </Button>
          </Link>
        </div>
      </aside>
    </div>
  );
}
