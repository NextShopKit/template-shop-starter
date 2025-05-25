"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@nextshopkit/sdk/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreditCard, ShoppingBasket, Trash2, X } from "lucide-react";
import CartItem1 from "@/components/CartItems/CartItem1";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";

/**
 * Cart drawer modal for the NextShopKit starter template.
 * Uses Next.js parallel routing to show the cart as a modal/drawer.
 * Integrates with NextShopKit's cart state and actions for real-time updates.
 */
export default function CartDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { loading, cart, totalCount, emptyCart } = useCart(); // NextShopKit cart state/actions
  const userLocale = navigator.language;

  // Close drawer on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [router]);

  // Animate drawer entrance
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timeout);
  }, []);

  // Animate and close drawer, then navigate back
  const closeDrawer = () => {
    setIsClosing(true);
    setTimeout(() => {
      router.back();
    }, 300); // match your exit duration
  };

  // Only render drawer on /cart route (parallel routing)
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
          "flex flex-col",
          isClosing
            ? "translate-x-full"
            : isVisible
            ? "translate-x-0"
            : "translate-x-full"
        )}
      >
        {/* Drawer header: cart icon, item count, close button */}
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

        {/* Empty cart button */}
        <div className="px-4 pt-2 self-end">
          <Button
            variant="outline"
            onClick={() => emptyCart()} // NextShopKit action
            aria-label="Clean cart"
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
            Clean cart
          </Button>
        </div>

        {/* Cart items list, scrollable */}
        <div className="overflow-y-auto px-4 py-4 flex flex-col flex-1 gap-4">
          {cart?.lines.map((line) => (
            <CartItem1 key={line.id} line={line} />
          ))}
        </div>

        {/* Checkout button, fixed at bottom */}
        <div className="p-4 shrink-0 border-t border-gray-200">
          <Link
            href={cart?.checkoutUrl || "#"} // Provided by NextShopKit
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
