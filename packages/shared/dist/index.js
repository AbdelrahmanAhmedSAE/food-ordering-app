"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ErrorCode: () => ErrorCode,
  OrderStatus: () => OrderStatus,
  PaymentMethod: () => PaymentMethod,
  PaymentStatus: () => PaymentStatus,
  Role: () => Role,
  createCartItemExtraSchema: () => createCartItemExtraSchema,
  createCartItemSchema: () => createCartItemSchema,
  createCategorySchema: () => createCategorySchema,
  createOrderSchema: () => createOrderSchema,
  signinSchema: () => signinSchema,
  signupSchema: () => signupSchema
});
module.exports = __toCommonJS(index_exports);

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
var import_zod = require("zod");
var createOrderSchema = import_zod.z.object({
  deliveryAddress: import_zod.z.string().min(10, "Address is very short").max(200, "Address is very long"),
  paymentMethod: import_zod.z.enum(Object.values(PaymentMethod))
});

// src/schemas/signinValidation.ts
var import_zod2 = require("zod");
var signinSchema = import_zod2.z.object({
  email: import_zod2.z.string().email("Invalid email"),
  password: import_zod2.z.string().min(6, "Password must be at least 6 characters")
});

// src/schemas/signupValidation.ts
var import_zod3 = require("zod");
var signupSchema = import_zod3.z.object({
  name: import_zod3.z.string().min(6, "Name must be at least 6 characters"),
  email: import_zod3.z.string().email("Invalid email"),
  password: import_zod3.z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: import_zod3.z.string().min(6, "Password must be at least 6 characters"),
  phone: import_zod3.z.string().optional().refine((val) => !val || val.length >= 11 && val.length <= 20, {
    message: "Phone must be 11-20 characters"
  }),
  address: import_zod3.z.string().optional().refine((val) => !val || val.length >= 11 && val.length <= 20, {
    message: "Address must be 11-200 characters"
  })
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords are not matched!"
});

// src/schemas/cart.ts
var import_zod4 = require("zod");
var createCartItemExtraSchema = import_zod4.z.object({
  extraId: import_zod4.z.string().cuid("extraId must be a valid UUID"),
  quantity: import_zod4.z.number().int("quantity must be an integer").min(1, "quantity must be at least 1")
});
var createCartItemSchema = import_zod4.z.object({
  productVariantId: import_zod4.z.string().cuid("productVariantId must be a valid UUID"),
  quantity: import_zod4.z.number().int("quantity must be an integer").min(1, "quantity must be at least 1"),
  extras: import_zod4.z.array(createCartItemExtraSchema).default([])
});

// src/schemas/category.ts
var import_zod5 = __toESM(require("zod"));
var createCategorySchema = import_zod5.default.object({
  name: import_zod5.default.string().length(20)
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.js.map