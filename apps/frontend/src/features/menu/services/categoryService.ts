import { httpClient } from "@/lib/http-client";
import { CategorySummery, ProductSummery } from "@repo/shared";
import { cookies } from "next/headers";

export const categoryService = {
  getCategories: async () =>
    httpClient.get<CategorySummery[]>("/api/v1/category", {
      headers: {
        Cookie: (await cookies()).toString(),
      },
    }),
  getCategoryProducts: async (categoryId?: string) => {
    const url: string = categoryId
      ? `/api/v1/product/category/${categoryId}`
      : `/api/v1/product/`;

    return httpClient.get<ProductSummery[]>(url, {
      headers: {
        Cookie: (await cookies()).toString(),
      },
    });
  },
};
