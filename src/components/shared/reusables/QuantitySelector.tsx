"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * QuantitySelector for NextShopKit starter template.
 * - Used in cart, product, and quick-add UIs
 * - Handles min/max, disables during loading, and is fully accessible
 * - Integrates with NextShopKit's cart/product state via setValue
 */
export default function QuantitySelector({
  value,
  setValue,
  min = 0,
  max = 99,
  loading = false,
  size = "md",
}: {
  value: number;
  setValue: (val: number) => void;
  min?: number;
  max?: number;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  // Responsive sizing for buttons/inputs
  const sizeClasses = {
    sm: {
      button: "h-8 w-8 text-sm",
      input: "h-8 px-2 text-sm",
    },
    md: {
      button: "h-10 w-10 text-base",
      input: "h-10 px-2.5 text-base",
    },
    lg: {
      button: "h-12 w-12 text-lg",
      input: "h-12 px-3 text-lg",
    },
  };

  // Handle direct input changes (with clamping)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) setValue(Math.min(max, Math.max(min, val)));
  };

  return (
    <div className="flex items-center gap-2">
      {/* Decrement button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setValue(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
        disabled={loading}
        className={sizeClasses[size].button}
      >
        <Minus className="w-4 h-4" />
      </Button>

      {/* Numeric input field */}
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        className={cn(
          "w-12 text-center appearance-none",
          "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]",
          sizeClasses[size].input
        )}
      />

      {/* Increment button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setValue(Math.min(max, value + 1))}
        aria-label="Increase quantity"
        disabled={loading}
        className={sizeClasses[size].button}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
