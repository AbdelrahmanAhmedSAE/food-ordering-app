import { httpClient } from "@/lib/http-client";
import { SignupSchema } from "@repo/shared";

export const signupService = {
  signup: async (body: Omit<SignupSchema, "confirmPassword">) =>
    httpClient.post<unknown, Omit<SignupSchema, "confirmPassword">>(
      "/api/v1/auth/signup",
      body
    ),
};
