"use server";
import { GetCollectionOptions } from "@nextshopkit/pro-development";
import { getCollection } from "./client";

export async function fetchCollectionWithMetafields(
  params: Partial<GetCollectionOptions> & { collectionHandle: string }
) {
  return await getCollection({
    includeProducts: true,

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
