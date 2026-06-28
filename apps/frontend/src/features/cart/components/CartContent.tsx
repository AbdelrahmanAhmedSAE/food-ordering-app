import { cn } from "@/lib/utils";

import { CartItemDetail } from "@repo/shared";
import { CartItemCard } from "./CartItemCard";
import { CartServerService } from "../services/cartServerService";
import { CreateOrderButton } from "./CreateOrderButton";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Link } from "lucide-react";
import { ScrollAnimation } from "@/components/animations/ScrollAnimation";

interface CartContentProps {
  className?: string;
}

export const CartContent = async ({ className }: CartContentProps) => {
  const { data } = await CartServerService.getCart();

  if (data.cartItems.length === 0) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4 flex flex-col items-center justify-center gap-4">
        <ShoppingCart className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold text-muted-foreground">
          Your cart is empty
        </h2>
        <Link href="/menu">
          <Button className="mt-4">Browse Menu</Button>
        </Link>
      </main>
    );
  }

  return (
    <main
      className={cn(
        "min-h-screen pt-24 pb-16 px-4 md:px-16 flex flex-col gap-6",
        className
      )}
    >
      <h1 className="text-center text-5xl font-black text-primary">Cart</h1>

      {/* Total */}
      <div className="flex items-center justify-between bg-card shadow-sm rounded-2xl px-6 py-4">
        <span className="text-lg font-semibold text-muted-foreground">
          Total
        </span>
        <span className="text-2xl font-black text-primary">
          {data.totalPrice}$
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {data.cartItems.map((cartItem: CartItemDetail) => (
          <ScrollAnimation key={cartItem.id}>
            <CartItemCard cartItem={cartItem} />
          </ScrollAnimation>
        ))}
      </div>

      <footer className="w-full">
        <CreateOrderButton totalPrice={data.totalPrice} />
      </footer>
    </main>
  );
};
