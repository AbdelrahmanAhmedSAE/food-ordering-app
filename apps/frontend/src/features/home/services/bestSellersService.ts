import { httpClient } from "@/lib/http-client";
import { ProductSummery } from "@app/shared";
import { cookies } from "next/headers";

export const bestSellersService = {
  get: async () =>
    httpClient.get<ProductSummery[]>("api/v1/product/best-sellers", {
      headers: {
        Cookie: (await cookies()).toString(),
      },
    }),
};
