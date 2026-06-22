import { httpClient } from "@/lib/http-client";
import { cookies } from "next/headers";

export const paymentService = {
  getPaymentIntentClientSecret: async (orderId: string) => {
    const cookieStore = await cookies();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return httpClient.post<any, { orderId: string }>(
      "/api/v1/payment/create-intent",
      {
        orderId,
      },
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );
  },
};
