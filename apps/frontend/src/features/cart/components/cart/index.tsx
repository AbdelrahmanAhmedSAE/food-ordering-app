import { cn } from "@/lib/utils";
import cartService from "../../services/cartService";
import { Button } from "@/components/ui/button";
import CartItemCard from "../cartItemCard";

interface CartProps {
  className?: string;
}

const Cart = async ({ className }: CartProps) => {
  const { data: cart } = await cartService.getCart();

  return (
    <main
      className={cn("border-none m-10 flex flex-col gap-10 mt-14", className)}
    >
      <h1 className="text-center text-4xl text-primary font-bold">Cart</h1>
      <h2 className="text-2xl font-semibold underline">
        Total price: {cart.totalPrice}$
      </h2>

      <div className="flex flex-col gap-10">
        {cart.cartItems.map((ci) => (
          <CartItemCard key={ci.id} cartItem={ci} />
        ))}
      </div>

      <footer className="w-full">
        <Button className="w-full text-2xl font-semibold cursor-pointer">
          Create Order
        </Button>
      </footer>
    </main>
  );
};

export default Cart;
