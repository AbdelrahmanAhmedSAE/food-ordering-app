import { httpClient } from "@/lib/http-client";
import type { CartDetail } from "@repo/shared";
import { cookies } from "next/headers";

export const CartServerService = {
  getCart: async () =>
    httpClient.get<CartDetail>(`/api/v1/cart`, {
      headers: {
        Cookie: (await cookies()).toString(),
      },
    }),
};
