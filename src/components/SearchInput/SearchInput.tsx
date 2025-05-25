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

// This component renders a search input that lets users search for products from any page.
// It updates the URL and routes to the /search page after the user stops typing (debounced),
// so the search results update smoothly without lag or unnecessary reloads.

export default function SearchInput({
  placeholder = "Search products...",
  className = "",
  autoFocus = false,
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Local state to keep track of the current value in the search input
  const [searchValue, setSearchValue] = useState("");

  // Debounced function: waits until the user stops typing for 300ms before updating the URL.
  // This prevents the app from routing on every keystroke, which can cause lag, especially in production.
  // If the user is not on the /search page, it pushes to /search with the query param.
  // If already on /search, it just updates the query param in the URL (without adding to browser history).
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

  // Called whenever the user types in the input.
  // Updates local state immediately, and triggers the debounced search function.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  // Called when the user submits the form (e.g. presses Enter or clicks search).
  // Cancels any pending debounced search and immediately routes to /search with the query.
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

  // Handles the Enter key in the input, so pressing Enter triggers an immediate search.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Clears the search input and routes to the base /search page (no query param).
  const clearSearch = () => {
    debouncedSearch.cancel();
    setSearchValue("");
    router.push("/search");
  };

  // Syncs the input value with the URL when the component mounts or the URL changes.
  // This ensures the input always shows the current query when on the /search page.
  useEffect(() => {
    if (pathname === "/search") {
      setSearchValue(searchParams.get("query") || "");
    } else {
      setSearchValue("");
    }
  }, [pathname, searchParams]);

  // Cleans up the debounced function when the component unmounts to avoid memory leaks.
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
