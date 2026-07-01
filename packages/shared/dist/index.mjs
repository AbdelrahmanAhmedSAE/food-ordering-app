// src/enums/error-code.ts
var ErrorCode = {
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  RECORD_NOT_FOUND: "RECORD_NOT_FOUND",
  DUPLICATE_ENTRY: "DUPLICATE_ENTRY",
  USER_ALREADY_EXISTED: "USER_ALREADY_EXISTED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  CART_NOT_FOUND: "CART_NOT_FOUND",
  ORDER_NOT_FOUND: "ORDER_NOT_FOUND",
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  UNAVAILABLE_PRODUCT_VARIANT: "UNAVAILABLE_PRODUCT_VARIANT",
  INVALID_PRODUCT_EXTRA: "INVALID_PRODUCT_EXTRA",
  CATEGORY_ALREADY_EXISTED: "CATEGORY_ALREADY_EXISTED",
  CART_EMPTY: "CART_EMPTY",
  CATEGORY_NOT_FOUND: "CATEGORY_NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  ORDER_CANNOT_BE_CANCELED: "ORDER_CANNOT_BE_CANCELED",
  FORBIDDEN: "FORBIDDEN"
};

// src/enums/order.ts
var PaymentMethod = {
  ONLINE: "ONLINE",
  CASH: "CASH"
};
var PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED"
};
var OrderStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELED: "CANCELED"
};

// src/enums/user.ts
var Role = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  DELIVERY: "DELIVERY"
};

// src/schemas/order.ts
import { z } from "zod";
var createOrderSchema = z.object({
  deliveryAddress: z.string().min(10, "Address is very short").max(200, "Address is very long"),
  paymentMethod: z.enum(Object.values(PaymentMethod))
});

// src/schemas/signinValidation.ts
import { z as z2 } from "zod";
var signinSchema = z2.object({
  email: z2.string().email("Invalid email"),
  password: z2.string().min(6, "Password must be at least 6 characters")
});

// src/schemas/signupValidation.ts
import { z as z3 } from "zod";
var signupSchema = z3.object({
  name: z3.string().min(6, "Name must be at least 6 characters"),
  email: z3.string().email("Invalid email"),
  password: z3.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z3.string().min(6, "Password must be at least 6 characters"),
  phone: z3.string().optional().refine((val) => !val || val.length >= 11 && val.length <= 20, {
    message: "Phone must be 11-20 characters"
  }),
  address: z3.string().optional().refine((val) => !val || val.length >= 11 && val.length <= 20, {
    message: "Address must be 11-200 characters"
  })
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords are not matched!"
});

// src/schemas/cart.ts
import { z as z4 } from "zod";
var createCartItemExtraSchema = z4.object({
  extraId: z4.string().cuid("extraId must be a valid UUID"),
  quantity: z4.number().int("quantity must be an integer").min(1, "quantity must be at least 1")
});
var createCartItemSchema = z4.object({
  productVariantId: z4.string().cuid("productVariantId must be a valid UUID"),
  quantity: z4.number().int("quantity must be an integer").min(1, "quantity must be at least 1"),
  extras: z4.array(createCartItemExtraSchema).default([])
});

// src/schemas/category.ts
import z5 from "zod";
var createCategorySchema = z5.object({
  name: z5.string().length(20)
});
export {
  ErrorCode,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Role,
  createCartItemExtraSchema,
  createCartItemSchema,
  createCategorySchema,
  createOrderSchema,
  signinSchema,
  signupSchema
};
//# sourceMappingURL=index.mjs.map