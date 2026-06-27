import { ErrorCode, type ActiveUser, type ApiResponse } from "@repo/shared";
import { HttpError, httpClient } from "../../../lib/http-client";
import { cookies } from "next/headers";

export const getMe = async () => {
  try {
    const res: ApiResponse<ActiveUser> = await httpClient.get<ActiveUser>(
      "/api/v1/auth/me",
      {
        headers: {
          Cookie: (await cookies()).toString(),
        },
        cache: "no-store",
      }
    );

    return res.data;
  } catch (error: unknown) {
    if (error instanceof HttpError && error.code === ErrorCode.UNAUTHORIZED)
      return null;

    throw error;
  }
};
