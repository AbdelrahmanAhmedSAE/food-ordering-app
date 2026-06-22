import { ApiResponse } from "@repo/shared";

const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export class HttpError extends Error {
  constructor(public status: number, public data: unknown, message?: string) {
    super(message ?? `HTTP Error ${status}`);
    this.name = "HttpError";
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

  console.log(res);

  if (!res.ok) {
    let errorData = null;
    let errorMsg = "Network error";
    try {
      errorData = await res.json();
      errorMsg = errorData?.message || errorMsg;
    } catch {}
    console.error(errorMsg);
    throw new HttpError(res.status, errorData, errorMsg);
  }

  return res.json();
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
