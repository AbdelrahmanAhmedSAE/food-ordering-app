import { redirect } from "next/navigation";
import { CheckoutForm } from "./CheckoutForm";
import { paymentService } from "../services/paymentService";

interface PaymentPageProps {
  searchParams: Promise<{ orderId: string }>;
}

export const PaymentContent = async ({ searchParams }: PaymentPageProps) => {
  const { orderId } = await searchParams;
  if (!orderId) redirect("/cart");

  const { data } = await paymentService.getPaymentIntentClientSecret(orderId);

  return (
    <main className="w-screen h-screen flex justify-center items-center p-10">
      <CheckoutForm
        clientSecret={
          typeof data.client_secret === "string" ? data.client_secret : ""
        }
      />
    </main>
  );
};
