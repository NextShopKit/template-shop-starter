import client from "./client";

interface GetSearchOptionsInterface {
  query: string;
  limit?: number;
  sortKey?: "TITLE" | "PRICE" | "BEST_SELLING" | "CREATED";
  reverse?: boolean;
  cursor?: string;
  productFilters?: any[];
  types?: string[];
  unavailableProducts?: "SHOW" | "HIDE" | "LAST";
}

interface FetchSearchResultInterface {
  products: any[];
  pageInfo: any;
  availableFilters?: any[];
  totalCount?: number;
  searchTerm: string;
  error: string | null;
}

export const getSearchResult = async (args: any): Promise<any> =>
  client.getSearchResult(args, {
    cacheTtl: 60,
    revalidate: 60,
    useMemoryCache: true,
    useVercelCache: true,
  });

export const fetchSearchResults = async ({
  query,
  limit = 9,
  filters = [],
  sortKey,
  reverse,
  cursor,
}: {
  query: string;
  limit?: number;
  filters?: any[];
  sortKey?: "TITLE" | "PRICE" | "BEST_SELLING" | "CREATED";
  reverse?: boolean;
  cursor?: string;
}) => {
  try {
    const searchResult = await getSearchResult({
      query,
      limit,
      ...(filters.length > 0 && { productFilters: filters }),
      ...(sortKey && { sortKey }),
      ...(reverse !== undefined && { reverse }),
      ...(cursor && { cursor }),
      types: ["PRODUCT"],
      unavailableProducts: "HIDE",
    });

    return {
      products: searchResult.products || [],
      pageInfo: searchResult.pageInfo,
      availableFilters: searchResult.availableFilters || [],
      totalCount: searchResult.totalCount || 0,
      searchTerm: searchResult.searchTerm || query,
      error: searchResult.error,
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      products: [],
      pageInfo: null,
      availableFilters: [],
      totalCount: 0,
      searchTerm: query,
      error: "Failed to fetch search results",
    };
  }
};
