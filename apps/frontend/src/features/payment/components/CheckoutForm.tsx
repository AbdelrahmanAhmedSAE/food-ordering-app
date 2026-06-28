"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/orders`,
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    }

    if (paymentIntent?.status === "succeeded") {
      router.refresh();
      router.push("/orders");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer"
      >
        {loading ? <Spinner /> : "Pay now"}
      </Button>
    </form>
  );
};

interface CheckoutFormProps {
  className?: string;
  clientSecret: string;
}

export const CheckoutForm = ({ clientSecret }: CheckoutFormProps) => (
  <Card className="w-full max-w-md mt-40 border-none shadow-2xl shadow-black">
    <CardHeader>
      <CardTitle>Checkout</CardTitle>
    </CardHeader>
    <CardContent>
      <Elements stripe={stripePromise} options={{ clientSecret, locale: "ar" }}>
        <PaymentForm />
      </Elements>
    </CardContent>
  </Card>
);
