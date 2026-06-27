import { httpClient } from "@/lib/http-client";

export const signoutService = {
  signout: async () =>
    httpClient.post<null, void>("/api/v1/auth/signout", undefined),
};
