import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useCart } from "@nextshopkit/pro-development/client";

interface NavbarCartButtonProps {
  cartCount: number;
}

const NavbarCartButton: React.FC<NavbarCartButtonProps> = ({}) => {
  const { totalCount } = useCart();
  const cartCount = 2; // Replace with actual cart count from context or props
  return (
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
  );
};

export default NavbarCartButton;
