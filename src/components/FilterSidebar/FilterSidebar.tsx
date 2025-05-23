"use client";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { FilterGroup } from "@nextshopkit/sdk";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import PriceSlider from "./PriceSlider";

interface FilterSidebarProps {
  availableFilters?: FilterGroup[];
  currentFilters?: { [key: string]: string | string[] | undefined };
}

const FilterSidebar = ({
  availableFilters = [],
  currentFilters = {},
}: FilterSidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(availableFilters.map((filter) => filter.id))
  );

  // Memoize the filter state signature to detect changes
  const filterSignature = useMemo(() => {
    return JSON.stringify(currentFilters);
  }, [currentFilters]);

  // Reset expanded filters when available filters change
  useEffect(() => {
    setExpandedFilters(new Set(availableFilters.map((filter) => filter.id)));
  }, [availableFilters]);

  const toggleFilter = (filterId: string) => {
    const newExpanded = new Set(expandedFilters);
    if (newExpanded.has(filterId)) {
      newExpanded.delete(filterId);
    } else {
      newExpanded.add(filterId);
    }
    setExpandedFilters(newExpanded);
  };

  const updateURL = (filterId: string, valueId: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    // Map Shopify filter IDs to our URL format
    let filterKey = `filter_${filterId}`;
    let urlValue = valueId;

    if (filterId === "filter.v.availability") {
      filterKey = "filter_available";
      // Map filter value IDs to boolean strings
      if (valueId === "filter.v.availability.1") {
        urlValue = "true";
      } else if (valueId === "filter.v.availability.0") {
        urlValue = "false";
      }
    } else if (filterId === "filter.v.price") {
      filterKey = "filter_price";
      // For price, valueId should already be in "min-max" format
      urlValue = valueId;
    } else if (filterId.startsWith("filter.p.m.")) {
      // Handle product metafields: filter.p.m.namespace.key
      const parts = filterId.split(".");
      if (parts.length >= 4) {
        const namespace = parts[3]; // "product"
        const key = parts[4]; // "category"
        filterKey = `filter_${namespace}.${key}`;

        // Get the actual value from the filter object instead of extracting from ID
        const filter = availableFilters?.find((f) => f.id === filterId);
        const filterValue = filter?.values.find((v) => v.id === valueId);
        urlValue = filterValue?.label || valueId; // Use the label (actual value) or fallback to valueId
      }
    } else if (filterId.startsWith("filter.v.option.")) {
      // Handle variant options: filter.v.option.color
      const optionName = filterId.replace("filter.v.option.", ""); // "color"
      filterKey = `filter_${optionName}`;

      // Get the actual value from the filter object
      const filter = availableFilters?.find((f) => f.id === filterId);
      const filterValue = filter?.values.find((v) => v.id === valueId);
      urlValue = filterValue?.label || valueId; // Use the label (actual value)
    }

    if (checked) {
      // Add filter value
      const currentValues = params.getAll(filterKey);
      if (!currentValues.includes(urlValue)) {
        params.append(filterKey, urlValue);
      }
    } else {
      // Remove filter value
      const currentValues = params.getAll(filterKey);
      params.delete(filterKey);
      currentValues
        .filter((value) => value !== urlValue)
        .forEach((value) => params.append(filterKey, value));
    }

    // Preserve the query parameter if we're on search page
    if (pathname === "/search") {
      const currentQuery = searchParams.get("query");
      if (currentQuery) {
        params.set("query", currentQuery);
      }
    }

    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  // Special function for price range updates
  const updatePriceRange = (min?: number, max?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const filterKey = "filter_price";

    // Remove existing price filters
    params.delete(filterKey);

    // Add new price range if values exist
    if (min !== undefined || max !== undefined) {
      const priceValue = `${min || 0}-${max || ""}`;
      params.append(filterKey, priceValue);
    }

    // Preserve the query parameter if we're on search page
    if (pathname === "/search") {
      const currentQuery = searchParams.get("query");
      if (currentQuery) {
        params.set("query", currentQuery);
      }
    }

    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();

    // Preserve the query parameter if we're on search page
    if (pathname === "/search") {
      const currentQuery = searchParams.get("query");
      if (currentQuery) {
        params.set("query", currentQuery);
      }
    }

    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const getSelectedValues = (filterId: string): string[] => {
    // Map Shopify filter IDs to our URL format
    let filterKey = `filter_${filterId}`;

    // Handle special mappings using switch case for better scalability
    switch (true) {
      case filterId === "filter.v.availability": {
        filterKey = "filter_available";
        const urlValues = currentFilters[filterKey];
        const urlValuesArray = Array.isArray(urlValues)
          ? urlValues
          : typeof urlValues === "string"
          ? [urlValues]
          : [];

        // Map URL values back to filter value IDs
        return urlValuesArray.map((urlValue) => {
          switch (urlValue) {
            case "true":
              return "filter.v.availability.1";
            case "false":
              return "filter.v.availability.0";
            default:
              return urlValue;
          }
        });
      }
      case filterId === "filter.v.price": {
        filterKey = "filter_price";
        const values = currentFilters[filterKey];
        if (Array.isArray(values)) return values;
        if (typeof values === "string") return [values];
        return [];
      }
      case filterId.startsWith("filter.p.tag."): {
        filterKey = "filter_productTag";
        const urlValues = currentFilters[filterKey];
        const urlValuesArray = Array.isArray(urlValues)
          ? urlValues
          : typeof urlValues === "string"
          ? [urlValues]
          : [];

        // Map URL values back to filter value IDs by finding matching labels
        const filter = availableFilters?.find((f) => f.id === filterId);
        return urlValuesArray.map((urlValue) => {
          const filterValue = filter?.values.find((v) => v.label === urlValue);
          return filterValue?.id || urlValue;
        });
      }
      case filterId.startsWith("filter.p.product_type."): {
        filterKey = "filter_productType";
        const urlValues = currentFilters[filterKey];
        const urlValuesArray = Array.isArray(urlValues)
          ? urlValues
          : typeof urlValues === "string"
          ? [urlValues]
          : [];

        // Map URL values back to filter value IDs by finding matching labels
        const filter = availableFilters?.find((f) => f.id === filterId);
        return urlValuesArray.map((urlValue) => {
          const filterValue = filter?.values.find((v) => v.label === urlValue);
          return filterValue?.id || urlValue;
        });
      }
      case filterId.startsWith("filter.p.m."): {
        // Handle product metafields: filter.p.m.namespace.key
        const parts = filterId.split(".");
        if (parts.length >= 4) {
          const namespace = parts[3]; // "product"
          const key = parts[4]; // "category"
          filterKey = `filter_${namespace}.${key}`;

          const urlValues = currentFilters[filterKey];
          const urlValuesArray = Array.isArray(urlValues)
            ? urlValues
            : typeof urlValues === "string"
            ? [urlValues]
            : [];

          // Map URL values back to full filter value IDs by finding matching labels
          const filter = availableFilters?.find((f) => f.id === filterId);
          return urlValuesArray.map((urlValue) => {
            const filterValue = filter?.values.find(
              (v) => v.label === urlValue
            );
            return filterValue?.id || `${filterId}.${urlValue}`;
          });
        }
        return [];
      }
      case filterId.startsWith("filter.v.option."): {
        const optionName = filterId.replace("filter.v.option.", "");
        filterKey = `filter_${optionName}`;

        const urlValues = currentFilters[filterKey];
        const urlValuesArray = Array.isArray(urlValues)
          ? urlValues
          : typeof urlValues === "string"
          ? [urlValues]
          : [];

        // Map URL values back to filter value IDs by finding matching labels
        const filter = availableFilters?.find((f) => f.id === filterId);
        return urlValuesArray.map((urlValue) => {
          const filterValue = filter?.values.find((v) => v.label === urlValue);
          return filterValue?.id || urlValue;
        });
      }
      default: {
        // Fallback for any other filter types
        const values = currentFilters[filterKey];
        if (Array.isArray(values)) return values;
        if (typeof values === "string") return [values];
        return [];
      }
    }
  };

  // Get current price range from URL
  const getCurrentPriceRange = (): { min?: number; max?: number } => {
    const priceValues = currentFilters["filter_price"];
    const priceValue = Array.isArray(priceValues)
      ? priceValues[0]
      : priceValues;

    if (typeof priceValue === "string" && priceValue.includes("-")) {
      const [minStr, maxStr] = priceValue.split("-");
      return {
        min: minStr ? parseFloat(minStr) : undefined,
        max: maxStr ? parseFloat(maxStr) : undefined,
      };
    }

    return {};
  };

  const hasActiveFilters = Object.keys(currentFilters).some(
    (key) => key.startsWith("filter_") && currentFilters[key]
  );

  if (!availableFilters?.length) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <p className="text-sm text-muted-foreground">No filters available</p>
      </div>
    );
  }

  return (
    <div className="w-full" key={filterSignature}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {availableFilters.map((filter) => {
          const isExpanded = expandedFilters.has(filter.id);
          const selectedValues = getSelectedValues(filter.id);
          const activeCount = selectedValues.length;

          return (
            <div key={filter.id} className="border-b border-gray-200 pb-4">
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto font-medium text-left"
                onClick={() => toggleFilter(filter.id)}
              >
                <span className="flex items-center gap-2">
                  {filter.label}
                  {activeCount > 0 && (
                    <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                      {activeCount}
                    </span>
                  )}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {isExpanded && (
                <div className="mt-3 space-y-2">
                  {filter.id === "filter.v.price" ? (
                    // Render price slider for price filters
                    <PriceSlider
                      min={0}
                      max={1000}
                      currentMin={getCurrentPriceRange().min}
                      currentMax={getCurrentPriceRange().max}
                      onPriceChange={updatePriceRange}
                    />
                  ) : (
                    // Render checkboxes for other filters
                    filter.values.map((value) => {
                      const isChecked = selectedValues.includes(value.id);

                      return (
                        <div
                          key={`${filter.id}-${value.id}-${filterSignature}`}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${filter.id}-${value.id}`}
                            checked={isChecked}
                            onCheckedChange={(
                              checked: boolean | "indeterminate"
                            ) =>
                              updateURL(filter.id, value.id, checked === true)
                            }
                          />
                          <Label
                            htmlFor={`${filter.id}-${value.id}`}
                            className="text-sm font-normal cursor-pointer flex-1 flex items-center justify-between"
                          >
                            <span>{value.label}</span>
                            {value.count !== undefined && (
                              <span className="text-xs text-muted-foreground">
                                ({value.count})
                              </span>
                            )}
                          </Label>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterSidebar;
