import { httpClient } from "@/lib/http-client";
import { ApiResponse, OrderDetail } from "@repo/shared";
import { cookies } from "next/headers";

export const ordersServerService = {
  getAll: async (): Promise<ApiResponse<Array<OrderDetail>>> =>
    httpClient.get<OrderDetail[]>("/api/v1/order", {
      headers: {
        Cookie: (await cookies()).toString(),
      },
    }),
  cancelOrder: async (orderId: string): Promise<ApiResponse<void>> =>
    httpClient.delete(`/api/v1/order/${orderId}`, {
      headers: {
        Cookie: (await cookies()).toString(),
      },
    }),
};
