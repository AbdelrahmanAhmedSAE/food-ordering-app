import { httpClient } from "@/lib/http-client";
import { ProductSummery } from "@app/shared";
import { cookies } from "next/headers";

export const latestProductsService = {
  get: async () =>
    httpClient.get<ProductSummery[]>("/api/v1/product/latest-product", {
      headers: {
        Cookie: (await cookies()).toString(),
      },
    }),
};
