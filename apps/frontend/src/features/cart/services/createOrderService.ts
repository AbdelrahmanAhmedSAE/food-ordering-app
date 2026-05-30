import httpClient from "@/lib/http-client";

import { OrderDto } from "@/lib/types/order";
import { CreateOrderSchema } from "../validations/createOrderValidation";

const CreateOrderService = {
  create: async (createOrderBody: CreateOrderSchema) => {
    return httpClient.post<OrderDto, CreateOrderSchema>(
      "/api/v1/order",
      createOrderBody
    );
  },
};

export default CreateOrderService;
