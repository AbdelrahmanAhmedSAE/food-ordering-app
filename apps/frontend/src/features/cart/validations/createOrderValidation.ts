import { PaymentMethod } from "@/lib/enums/order";
import { z } from "zod";

export const createOrderSchema = z.object({
  deliveryAddress: z
    .string()
    .min(10, "Address is very short")
    .max(200, "Address is very long"),
  paymentMethod: z.enum(Object.values(PaymentMethod)),
});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
