import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type OrderDetail, PaymentMethod, PaymentStatus } from "@repo/shared";
import Link from "next/link";

interface OrdersCardProps {
  className?: string;
  order: OrderDetail;
}

export const OrdersCard = async ({ className, order }: OrdersCardProps) => {
  return (
    <Card className={cn("border-none shadow-2xl", className)}>
      <CardHeader>
        <CardTitle className="text-2xl text-primary">
          Order:{" "}
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
          }).format(new Date(order.createdAt))}
        </CardTitle>
        <CardDescription>
          <div>Order status: {order.status}</div>
          <div>Payment method: {order.paymentMethod}</div>
          {order.paymentMethod === PaymentMethod.ONLINE && (
            <div>Payment status: {order.paymentStatus}</div>
          )}
          <div>Total: {order.totalPrice}$</div>
        </CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-5">
        {order.items.map((item) => (
          <div key={item.id} className="rounded-lg border p-3 space-y-1">
            <div>Name: {item.name}</div>
            <div>Quantity: {item.quantity}</div>
            <div>Price: {item.totalPrice}$</div>
            {item.extras.length > 0 && (
              <div>
                <span>Extras: </span>
                {item.extras.map((e) => `${e.quantity}× ${e.name}`).join(", ")}
              </div>
            )}
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        {order.paymentMethod === PaymentMethod.ONLINE &&
          !(order.paymentStatus === PaymentStatus.PAID) && (
            <Button
              asChild
              className="cursor-pointer font-semibold text-xl bg-sky-700 hover:bg-sky-500 w-full"
            >
              <Link href={`/checkout?orderId=${order.id}`}>Pay</Link>
            </Button>
          )}
        <Button className="cursor-pointer font-semibold text-xl bg-red-700 hover:bg-red-500 w-full">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};
