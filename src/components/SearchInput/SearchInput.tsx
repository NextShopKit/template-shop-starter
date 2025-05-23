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

export default function SearchInput({
  placeholder = "Search products...",
  className = "",
  autoFocus = false,
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Only get initial query if we're on the search page
  const initialQuery =
    pathname === "/search" ? searchParams.get("query") || "" : "";
  const [searchValue, setSearchValue] = useState(initialQuery);

  // Debounced search function - triggers actual search after 300ms
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        // Use router.push for final search to add to history
        router.push(
          `/search?query=${encodeURIComponent(query.trim())}&execute=true`
        );
      } else {
        router.push("/search");
      }
    }, 300),
    [router]
  );

  // Handle input change - immediate URL update + debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Immediate URL update without triggering full search
    if (value.trim()) {
      router.replace(`/search?query=${encodeURIComponent(value.trim())}`);
    } else {
      router.replace("/search");
    }

    // Debounced search execution
    debouncedSearch(value);
  };

  // Handle form submission or Enter key - immediate search
  const handleSearch = () => {
    // Cancel any pending debounced search
    debouncedSearch.cancel();

    if (searchValue.trim()) {
      router.push(
        `/search?query=${encodeURIComponent(searchValue.trim())}&execute=true`
      );
    } else {
      router.push("/search");
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Clear search
  const clearSearch = () => {
    debouncedSearch.cancel();
    setSearchValue("");
    router.push("/search");
  };

  // Update input value when URL query changes (for back/forward navigation)
  useEffect(() => {
    if (pathname === "/search") {
      const urlQuery = searchParams.get("query") || "";
      if (urlQuery !== searchValue) {
        setSearchValue(urlQuery);
      }
    } else {
      // Clear search value when not on search page
      if (searchValue) {
        setSearchValue("");
      }
    }
  }, [searchParams, pathname, searchValue]);

  // Cleanup debounced function on unmount
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
