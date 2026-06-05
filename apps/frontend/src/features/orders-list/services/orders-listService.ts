import httpClient from "@/lib/http-client";
import { ApiResponse, OrderDetail } from "@app/shared";
import { cookies } from "next/headers";

const ordersListService = {
  getAll: async (): Promise<ApiResponse<Array<OrderDetail>>> => {
    const cookieStore = await cookies();
    return httpClient.get<OrderDetail[]>("/api/v1/order", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
  },
  cancelOrder: async (orderId: string): Promise<ApiResponse<void>> => {
    const cookieStore = await cookies();
    return httpClient.delete(`/api/v1/order/${orderId}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
  },
};

export default ordersListService;
