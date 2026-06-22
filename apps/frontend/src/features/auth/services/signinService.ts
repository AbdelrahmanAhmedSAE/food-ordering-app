import { httpClient } from "@/lib/http-client";
import type { ActiveUser, SigninSchema } from "@repo/shared";
import { cookies } from "next/headers";

export const signinService = {
  signin: async (body: SigninSchema) =>
    httpClient.post<ActiveUser, SigninSchema>("/api/v1/auth/signin", body, {
      headers: {
        Cookie: (await cookies()).toString(),
      },
    }),
};
