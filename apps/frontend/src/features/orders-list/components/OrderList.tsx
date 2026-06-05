import { cn } from "@/lib/utils";
import ordersListService from "../services/orders-listService";
import OrdersCard from "./OrderCard";

interface OrdersListProps {
  className?: string;
}

const OrdersList = async ({ className }: OrdersListProps) => {
  const { data: orders } = await ordersListService.getAll();

  return (
    <main className={cn("mt-20", className)}>
      <h1 className="text-4xl font-bold text-center text-primary">Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-14 gap-10">
        {orders.map((order) => (
          <OrdersCard order={order} key={order.id} />
        ))}
      </div>
    </main>
  );
};

export default OrdersList;
