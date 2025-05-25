"use client";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface PriceSliderProps {
  min?: number;
  max?: number;
  currentMin?: number;
  currentMax?: number;
  onPriceChange: (min?: number, max?: number) => void;
}

/**
 * PriceSlider for NextShopKit filter sidebar.
 * Allows users to set a min/max price range for product filtering.
 * - Integrates with NextShopKit's filter system via onPriceChange
 * - Validates input and disables actions when invalid
 * - Used in both mobile and desktop filter UIs
 */
const PriceSlider = ({
  min = 0,
  max = 1000,
  currentMin,
  currentMax,
  onPriceChange,
}: PriceSliderProps) => {
  // Local state for input fields (string for controlled input)
  const [minValue, setMinValue] = useState<string>(
    currentMin?.toString() || ""
  );
  const [maxValue, setMaxValue] = useState<string>(
    currentMax?.toString() || ""
  );

  // Sync local state with external changes (e.g. URL param updates)
  useEffect(() => {
    setMinValue(currentMin?.toString() || "");
    setMaxValue(currentMax?.toString() || "");
  }, [currentMin, currentMax]);

  // Apply the selected price range (with validation)
  const handleApply = () => {
    const parsedMin = minValue ? parseFloat(minValue) : undefined;
    const parsedMax = maxValue ? parseFloat(maxValue) : undefined;

    // Validate values
    if (parsedMin && parsedMin < min) return;
    if (parsedMax && parsedMax > max) return;
    if (parsedMin && parsedMax && parsedMin > parsedMax) return;

    onPriceChange(parsedMin, parsedMax);
  };

  // Clear the price range filter
  const handleClear = () => {
    setMinValue("");
    setMaxValue("");
    onPriceChange(undefined, undefined);
  };

  return (
    <div className="space-y-3">
      {/* Min/Max input fields */}
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder={`Min (${min})`}
          value={minValue}
          onChange={(e) => setMinValue(e.target.value)}
          className="text-sm"
          min={min}
          max={max}
        />
        <span className="text-sm text-gray-500">—</span>
        <Input
          type="number"
          placeholder={`Max (${max})`}
          value={maxValue}
          onChange={(e) => setMaxValue(e.target.value)}
          className="text-sm"
          min={min}
          max={max}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleApply}
          className="flex-1 text-xs"
          disabled={!minValue && !maxValue}
        >
          Apply
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="flex-1 text-xs"
          disabled={!minValue && !maxValue}
        >
          Clear
        </Button>
      </div>

      {/* Show current range if set */}
      {(currentMin || currentMax) && (
        <div className="text-xs text-gray-600">
          Current: {currentMin || 0} - {currentMax || "∞"}
        </div>
      )}
    </div>
  );
};

export default PriceSlider;
