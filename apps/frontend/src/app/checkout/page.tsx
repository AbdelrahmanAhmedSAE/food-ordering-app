import { PaymentContent } from "@/features/payment/components/PaymentContent";

interface CheckoutPageProps {
  searchParams: Promise<{ orderId: string }>;
}

const CheckoutPage = ({ searchParams }: CheckoutPageProps) => (
  <PaymentContent searchParams={searchParams} />
);

export default CheckoutPage;
