"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { debounce } from "lodash";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

/**
 * SearchInput for NextShopKit starter template.
 * - Debounced, accessible search input for product search
 * - Updates URL and routes to /search with query param
 * - Integrates with NextShopKit's search page and SSR/ISR
 * - Used in navbar, sidebar, and mobile search UIs
 */
export default function SearchInput({
  placeholder = "Search products...",
  className = "",
  autoFocus = false,
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Local state for the current input value
  const [searchValue, setSearchValue] = useState("");

  /**
   * Debounced search handler:
   * - Waits 300ms after typing before updating the URL
   * - Navigates to /search with query param, or updates query param if already there
   * - Prevents excessive navigation and improves UX
   */
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (pathname !== "/search") {
        // If not on the search page, navigate to /search with the query
        if (query.trim()) {
          router.push(`/search?query=${encodeURIComponent(query.trim())}`);
        } else {
          router.push("/search");
        }
      } else {
        // If already on /search, just update the query param
        if (query.trim()) {
          router.replace(`/search?query=${encodeURIComponent(query.trim())}`);
        } else {
          router.replace("/search");
        }
      }
    }, 300),
    [router, pathname]
  );

  // Handle input changes and trigger debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  /**
   * Immediate search on submit (Enter or search button):
   * - Cancels debounce and navigates instantly
   * - Used for accessibility and keyboard support
   */
  const handleSearch = () => {
    debouncedSearch.cancel();

    if (searchValue.trim()) {
      router.push(
        `/search?query=${encodeURIComponent(searchValue.trim())}&execute=true`
      );
    } else {
      router.push("/search");
    }
  };

  // Handle Enter key for instant search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Clear the search input and reset to base /search page
  const clearSearch = () => {
    debouncedSearch.cancel();
    setSearchValue("");
    router.push("/search");
  };

  /**
   * Sync input value with URL param when on /search
   * - Ensures input reflects the current query param
   * - Resets input when navigating away
   */
  useEffect(() => {
    if (pathname === "/search") {
      setSearchValue(searchParams.get("query") || "");
    } else {
      setSearchValue("");
    }
  }, [pathname, searchParams]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className={`relative ${className}`}
    >
      <div className="relative">
        {/* Search icon on the left side of the input */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="pl-10 pr-10"
        />
        {/* Show a clear (X) button when there is text in the input */}
        {searchValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-auto p-1 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
