import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(6, "Name must be at least 6 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || (val.length >= 11 && val.length <= 20), {
        message: "Phone must be 11-20 characters",
      }),
    address: z
      .string()
      .optional()
      .refine((val) => !val || (val.length >= 11 && val.length <= 20), {
        message: "Address must be 11-200 characters",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords are not matched!",
  });

export type SignupSchema = z.infer<typeof signupSchema>;
