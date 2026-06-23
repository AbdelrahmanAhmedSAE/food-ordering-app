import { z } from "zod";

export const createCartItemExtraSchema = z.object({
  extraId: z.string().cuid("extraId must be a valid UUID"),
  quantity: z
    .number()
    .int("quantity must be an integer")
    .min(1, "quantity must be at least 1"),
});

export const createCartItemSchema = z.object({
  productVariantId: z.string().cuid("productVariantId must be a valid UUID"),
  quantity: z
    .number()
    .int("quantity must be an integer")
    .min(1, "quantity must be at least 1"),
  extras: z.array(createCartItemExtraSchema).default([]),
});

export type CreateCartItemSchema = z.infer<typeof createCartItemSchema>;

export type CreateCartItemExtraSchema = z.infer<
  typeof createCartItemExtraSchema
>;
