import ApiResponse from "./response";

export const fetchClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorMsg = "Network error";
    try {
      const data = await res.json();
      errorMsg = data.message || errorMsg;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return res.json();
};
