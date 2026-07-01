import z$1, { z } from 'zod';

declare const ErrorCode: {
    readonly INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR";
    readonly DATABASE_ERROR: "DATABASE_ERROR";
    readonly RECORD_NOT_FOUND: "RECORD_NOT_FOUND";
    readonly DUPLICATE_ENTRY: "DUPLICATE_ENTRY";
    readonly USER_ALREADY_EXISTED: "USER_ALREADY_EXISTED";
    readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    readonly TOKEN_EXPIRED: "TOKEN_EXPIRED";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK";
    readonly PAYMENT_FAILED: "PAYMENT_FAILED";
    readonly CART_NOT_FOUND: "CART_NOT_FOUND";
    readonly ORDER_NOT_FOUND: "ORDER_NOT_FOUND";
    readonly PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND";
    readonly USER_NOT_FOUND: "USER_NOT_FOUND";
    readonly UNAVAILABLE_PRODUCT_VARIANT: "UNAVAILABLE_PRODUCT_VARIANT";
    readonly INVALID_PRODUCT_EXTRA: "INVALID_PRODUCT_EXTRA";
    readonly CATEGORY_ALREADY_EXISTED: "CATEGORY_ALREADY_EXISTED";
    readonly CART_EMPTY: "CART_EMPTY";
    readonly CATEGORY_NOT_FOUND: "CATEGORY_NOT_FOUND";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly ORDER_CANNOT_BE_CANCELED: "ORDER_CANNOT_BE_CANCELED";
    readonly FORBIDDEN: "FORBIDDEN";
};
type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

declare const PaymentMethod: {
    readonly ONLINE: "ONLINE";
    readonly CASH: "CASH";
};
type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
declare const PaymentStatus: {
    readonly PENDING: "PENDING";
    readonly PAID: "PAID";
    readonly FAILED: "FAILED";
};
type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
declare const OrderStatus: {
    readonly PENDING: "PENDING";
    readonly CONFIRMED: "CONFIRMED";
    readonly PREPARING: "PREPARING";
    readonly OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY";
    readonly DELIVERED: "DELIVERED";
    readonly CANCELED: "CANCELED";
};
type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

declare const Role: {
    readonly CUSTOMER: "CUSTOMER";
    readonly ADMIN: "ADMIN";
    readonly STAFF: "STAFF";
    readonly DELIVERY: "DELIVERY";
};
type Role = (typeof Role)[keyof typeof Role];

interface ApiError {
    code: ErrorCode;
    message: string;
    details?: Record<string, any>;
}
interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    data: T;
    error?: ApiError;
    message?: string;
}

type Nullable<T> = T | null;

interface JwtPayload {
    sub: string;
    name: string;
    role: Role;
}

interface ActiveUser {
    id: string;
    name: string;
    role: Role;
}

interface OrderItemExtra {
    id: string;
    name: string;
    totalPrice: number;
    quantity: number;
    orderItemId: string;
    createdAt: string;
}
interface OrderItemDetail {
    id: string;
    name: string;
    totalPrice: number;
    quantity: number;
    orderId: string;
    extras: OrderItemExtra[];
    createdAt: string;
}
interface OrderDetail {
    id: string;
    userId: string;
    totalPrice: number;
    paymentIntentId: Nullable<string>;
    deliveryAddress: string;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    items: OrderItemDetail[];
    createdAt: string;
}
interface OrderSummary extends Omit<OrderDetail, "items"> {
}

interface CartItemExtraDetail {
    id: string;
    itemId: string;
    quantity: number;
    totalPrice: number;
    productExtra: {
        id: string;
        name: string;
        price: number;
    };
    createdAt: string;
    updatedAt: string;
}
interface CartItemDetail {
    id: string;
    cartId: string;
    quantity: number;
    totalPrice: number;
    productName: string;
    productVariant: {
        id: string;
        name: string;
        price: number;
        image: {
            url: string;
        };
    };
    cartItemExtras: CartItemExtraDetail[];
    createdAt: string;
    updatedAt: string;
}
interface CartDetail {
    id: string;
    userId: string;
    totalPrice: number;
    cartItems: CartItemDetail[];
    createdAt: string;
    updatedAt: string;
}

interface IProduct {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
interface ProductSummery extends Omit<IProduct, "createdAt" | "updatedAt"> {
    slug: string;
    imageUrl: string | null;
    price: number;
}
interface ProductDetail extends IProduct {
    description: string;
    slug: string;
    variants: ProductVariant[];
    images: ProductImage[];
    extras: ProductExtra[];
}
interface ProductVariant extends IProduct {
    price: number;
    isAvailable: boolean;
    sku: string | null;
}
interface ProductExtra extends IProduct {
    price: number;
    isAvailable: boolean;
    sku: string | null;
}
interface ProductImage extends Omit<IProduct, "name"> {
    url: string;
    isPrimary: boolean;
}

interface CategorySummery {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

declare const createOrderSchema: z.ZodObject<{
    deliveryAddress: z.ZodString;
    paymentMethod: z.ZodEnum<{
        ONLINE: "ONLINE";
        CASH: "CASH";
    }>;
}, z.core.$strip>;
type CreateOrderSchema = z.infer<typeof createOrderSchema>;

declare const signinSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
type SigninSchema = z.infer<typeof signinSchema>;

declare const signupSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type SignupSchema = z.infer<typeof signupSchema>;

declare const createCartItemExtraSchema: z.ZodObject<{
    extraId: z.ZodString;
    quantity: z.ZodNumber;
}, z.core.$strip>;
declare const createCartItemSchema: z.ZodObject<{
    productVariantId: z.ZodString;
    quantity: z.ZodNumber;
    extras: z.ZodDefault<z.ZodArray<z.ZodObject<{
        extraId: z.ZodString;
        quantity: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>;
type CreateCartItemSchema = z.infer<typeof createCartItemSchema>;
type CreateCartItemExtraSchema = z.infer<typeof createCartItemExtraSchema>;

declare const createCategorySchema: z$1.ZodObject<{
    name: z$1.ZodString;
}, z$1.core.$strip>;
type CreateCategorySchema = z$1.infer<typeof createCategorySchema>;

export { type ActiveUser, type ApiError, type ApiResponse, type CartDetail, type CartItemDetail, type CartItemExtraDetail, type CategorySummery, type CreateCartItemExtraSchema, type CreateCartItemSchema, type CreateCategorySchema, type CreateOrderSchema, ErrorCode, type JwtPayload, type Nullable, type OrderDetail, type OrderItemDetail, type OrderItemExtra, OrderStatus, type OrderSummary, PaymentMethod, PaymentStatus, type ProductDetail, type ProductExtra, type ProductImage, type ProductSummery, type ProductVariant, Role, type SigninSchema, type SignupSchema, createCartItemExtraSchema, createCartItemSchema, createCategorySchema, createOrderSchema, signinSchema, signupSchema };
