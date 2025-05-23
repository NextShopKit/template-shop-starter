"use server";
import { GetCollectionOptions } from "@nextshopkit/sdk";
import { getCollection } from "./client";

// https://apps.shopify.com/search-and-discovery
// This app is required to see metafields in the available filters.
// Before trying to find the metafields in the filters, activate the related filter on the app

export async function fetchCollectionWithMetafields(
  params: Partial<GetCollectionOptions> & { collectionHandle: string }
) {
  return await getCollection({
    includeProducts: true,

    collectionMetafields: [
      { field: "custom.short_description", type: "multi_line_text" },
      { field: "custom.main_image", type: "File" },
    ],
    productMetafields: [
      { field: "test_data.binding_mount", type: "single_line_text" },
      { field: "test_data.snowboard_length", type: "dimension" },
    ],

    options: {
      // Default configuration values
      // Set to false if these options are not required
      renderRichTextAsHtml: true,
      resolveFiles: true,
      camelizeKeys: true,

      // Mutate the raw or casted results
      // transformCollectionMetafields: async (raw, casted, defs) => {},
      // transformVariantMetafields: async (raw, casted, defs) => {},

      // Merge user's custom options (if provided)
      ...params.options,
    },

    // Finally, override everything with `params` values
    ...params,
  });
}
