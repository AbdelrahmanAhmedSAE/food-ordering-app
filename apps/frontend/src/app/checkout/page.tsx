import PaymentPage from "@/features/payment/components/paymentPage";

const CheckoutPage = ({
  searchParams,
}: {
  searchParams: Promise<{ orderId: string }>;
}) => {
  return <PaymentPage searchParams={searchParams} />;
};

export default CheckoutPage;
