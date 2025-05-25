"use server";
import { GetCollectionOptions } from "@nextshopkit/sdk";
import { getCollection } from "./client";

// https://apps.shopify.com/search-and-discovery
// This app is required to see metafields in the available filters.
// Before trying to find the metafields in the filters, activate the related filter on the app

/**
 * Fetch collection data with metafields using NextShopKit
 * This function demonstrates how to retrieve collections with custom metafields
 * and products, commonly used for category pages and filtered product listings
 */
export async function fetchCollectionWithMetafields(
  params: Partial<GetCollectionOptions> & { collectionHandle: string }
) {
  return await getCollection({
    // Include products in the collection response
    includeProducts: true,

    // Define collection-level metafields to fetch
    // These are custom fields added to collections in Shopify admin
    collectionMetafields: [
      { field: "custom.short_description", type: "multi_line_text" },
      { field: "custom.main_image", type: "File" },
    ],

    // Define product-level metafields to fetch for each product
    // Useful for additional product data like specifications
    productMetafields: [
      { field: "test_data.binding_mount", type: "single_line_text" },
      { field: "test_data.snowboard_length", type: "dimension" },
    ],

    options: {
      // NextShopKit processing options
      // Convert rich text metafields to HTML for rendering
      renderRichTextAsHtml: true,
      // Resolve file metafields to full URLs
      resolveFiles: true,
      // Convert snake_case keys to camelCase for JavaScript
      camelizeKeys: true,

      // Optional transformation hooks for advanced use cases
      // transformCollectionMetafields: async (raw, casted, defs) => {},
      // transformVariantMetafields: async (raw, casted, defs) => {},

      // Merge any additional options from the caller
      ...params.options,
    },

    // Override with any parameters passed to this function
    ...params,
  });
}
