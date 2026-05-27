import httpClient from "@/lib/http-client";
import { CartDto } from "../types/cartTypes";
import { cookies } from "next/headers";

const cartService = {
  getCart: async () => {
    const cookieStore = await cookies();
    return httpClient.get<CartDto>(`/api/v1/cart`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
  },
};

export default cartService;
