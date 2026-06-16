export const Role = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  DELIVERY: "DELIVERY",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
