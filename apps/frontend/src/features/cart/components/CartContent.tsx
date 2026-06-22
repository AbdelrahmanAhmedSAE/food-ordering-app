import { cn } from "@/lib/utils";

import { CartItemDetail } from "@repo/shared";
import { CartItemCard } from "./CartItemCard";
import { CartServerService } from "../services/cartServerService";
import { CreateOrderButton } from "./CreateOrderButton";

interface CartContentProps {
  className?: string;
}

export const CartContent = async ({ className }: CartContentProps) => {
  const { data } = await CartServerService.getCart();

  return (
    <main
      className={cn("border-none m-10 flex flex-col gap-10 mt-14", className)}
    >
      <h1 className="text-center text-4xl text-primary font-bold">Cart</h1>
      <h2 className="text-2xl font-semibold underline">
        Total price: {data.totalPrice}$
      </h2>

      <div className="flex flex-col gap-10">
        {data.cartItems.map((cartItem: CartItemDetail) => (
          <CartItemCard key={cartItem.id} cartItem={cartItem} />
        ))}
      </div>

      <footer className="w-full">
        <CreateOrderButton totalPrice={data.totalPrice} />
      </footer>
    </main>
  );
};
