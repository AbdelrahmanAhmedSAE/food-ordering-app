import { httpClient } from "@/lib/http-client";
import type { CreateOrderSchema, OrderDetail } from "@repo/shared";

export const orderClientService = {
  createOrder: async (createOrderBody: CreateOrderSchema) => {
    return httpClient.post<OrderDetail, CreateOrderSchema>(
      "/api/v1/order",
      createOrderBody
    );
  },
};
