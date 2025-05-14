"use server";

import { GetProductOptions } from "@nextshopkit/pro-development";
import { getProduct } from "./client";

export async function fetchProduct(
  params: Partial<GetProductOptions> & { handle: string }
) {
  const { handle, ...otherParams } = params;
  return await getProduct({
    handle,
    variantFields: ["quantityAvailable", "availableForSale"],
    customMetafields: [
      { field: "test_data.binding_mount", type: "single_line_text" },
      { field: "test_data.binding_mount", type: "dimension" },
      { field: "general.short_description", type: "multi_line_text" },
    ],
    options: {
      renderRichTextAsHtml: true,
      resolveFiles: true,
      camelizeKeys: true,
      ...otherParams.options, // Merge additional options from params
    },
    ...otherParams, // Merge other params into the main getProduct call
  });
}
