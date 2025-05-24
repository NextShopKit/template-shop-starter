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

  const [searchValue, setSearchValue] = useState("");

  // Debounced search function - only update URL after typing stops
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (pathname !== "/search") {
        // Not on search page, push to /search
        if (query.trim()) {
          router.push(`/search?query=${encodeURIComponent(query.trim())}`);
        } else {
          router.push("/search");
        }
      } else {
        // Already on /search, just update query param
        if (query.trim()) {
          router.replace(`/search?query=${encodeURIComponent(query.trim())}`);
        } else {
          router.replace("/search");
        }
      }
    }, 300),
    [router, pathname]
  );

  // Handle input change - only update local state, debounce URL update
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
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

  // Sync searchValue with URL after mount
  useEffect(() => {
    if (pathname === "/search") {
      setSearchValue(searchParams.get("query") || "");
    } else {
      setSearchValue("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

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
