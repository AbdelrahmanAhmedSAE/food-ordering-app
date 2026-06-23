import { ApiResponse, ApiError, ErrorCode, Nullable } from "@repo/shared";

const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export class HttpError extends Error implements ApiError {
  public status: number;
  public code: ErrorCode;
  public details?: Record<string, unknown>;

  constructor(
    status: number,
    code: ErrorCode,
    message?: string,
    details?: Record<string, unknown>
  ) {
    super(message ?? `HTTP Error ${status}`);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const request = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const res: Response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data: Nullable<ApiResponse<T>> = await res.json().catch(() => null);

  if (!res.ok) {
    if (!data || !data.error)
      throw new HttpError(
        res.status,
        ErrorCode.INTERNAL_SERVER_ERROR,
        data?.message ?? "Internal server error"
      );

    throw new HttpError(res.status, data.error?.code, data.error.message);
  }

  return data as ApiResponse<T>;
};

export const httpClient = {
  get: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { ...options, method: "GET" }),
  post: <T, B>(url: string, body: B, options?: RequestInit) =>
    request<T>(url, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T, B>(url: string, body: B, options?: RequestInit) =>
    request<T>(url, { ...options, method: "PUT", body: JSON.stringify(body) }),
  patch: <T, B>(url: string, body: B, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: <T = void>(url: string, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: "DELETE",
    }),
};
