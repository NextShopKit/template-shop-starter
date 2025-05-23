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

const PriceSlider = ({
  min = 0,
  max = 1000,
  currentMin,
  currentMax,
  onPriceChange,
}: PriceSliderProps) => {
  const [minValue, setMinValue] = useState<string>(
    currentMin?.toString() || ""
  );
  const [maxValue, setMaxValue] = useState<string>(
    currentMax?.toString() || ""
  );

  useEffect(() => {
    setMinValue(currentMin?.toString() || "");
    setMaxValue(currentMax?.toString() || "");
  }, [currentMin, currentMax]);

  const handleApply = () => {
    const parsedMin = minValue ? parseFloat(minValue) : undefined;
    const parsedMax = maxValue ? parseFloat(maxValue) : undefined;

    // Validate values
    if (parsedMin && parsedMin < min) return;
    if (parsedMax && parsedMax > max) return;
    if (parsedMin && parsedMax && parsedMin > parsedMax) return;

    onPriceChange(parsedMin, parsedMax);
  };

  const handleClear = () => {
    setMinValue("");
    setMaxValue("");
    onPriceChange(undefined, undefined);
  };

  return (
    <div className="space-y-3">
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

      {(currentMin || currentMax) && (
        <div className="text-xs text-gray-600">
          Current: {currentMin || 0} - {currentMax || "∞"}
        </div>
      )}
    </div>
  );
};

export default PriceSlider;
