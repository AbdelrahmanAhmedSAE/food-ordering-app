import { httpClient } from "@/lib/http-client";
import type { ActiveUser, SigninSchema } from "@repo/shared";

export const signinService = {
  signin: async (body: SigninSchema) =>
    httpClient.post<ActiveUser, SigninSchema>("/api/v1/auth/signin", body),
};
