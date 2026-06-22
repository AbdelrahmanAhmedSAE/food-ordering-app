import { httpClient } from "@/lib/http-client";
import { ProductDetail } from "@repo/shared";
import { cookies } from "next/headers";

export const ProductService = {
  getDetail: async (slug: string) =>
    httpClient.get<ProductDetail>(`/api/v1/product/slug/${slug}`, {
      headers: {
        Cookie: (await cookies()).toString(),
      },
    }),
};
