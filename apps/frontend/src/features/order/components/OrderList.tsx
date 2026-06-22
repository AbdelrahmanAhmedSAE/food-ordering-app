import { cn } from "@/lib/utils";
import { OrdersCard } from "./OrderCard";
import { ordersServerService } from "../services/orderServerService";
import { OrderDetail } from "@repo/shared";

interface OrdersListProps {
  className?: string;
}

export const OrdersList = async ({ className }: OrdersListProps) => {
  const { data } = await ordersServerService.getAll();

  return (
    <main className={cn("mt-20", className)}>
      <h1 className="text-4xl font-bold text-center text-primary">Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-14 gap-10">
        {data.map((order: OrderDetail) => (
          <OrdersCard order={order} key={order.id} />
        ))}
      </div>
    </main>
  );
};
