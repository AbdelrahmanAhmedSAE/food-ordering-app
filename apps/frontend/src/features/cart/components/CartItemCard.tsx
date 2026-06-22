/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DeleteCartItemButton } from "./DeleteCartItemButton";
import type { CartItemDetail } from "@repo/shared";

interface CartItemCardProps {
  className?: string;
  cartItem: CartItemDetail;
}

export const CartItemCard = ({ className, cartItem }: CartItemCardProps) => {
  return (
    <Card
      className={cn("flex flex-col p-10 border-none shadow-2xl", className)}
    >
      <CardContent className="w-full py-10 px-6 flex flex-col gap-3">
        <div className="flex justify-between w-full">
          <div className="w-full flex flex-col md:flex-row gap-10 text-center">
            <img
              className="sm:h-10 md:h-32 rounded-2xl"
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${cartItem.productVariant.image.url}`}
              alt={cartItem.productVariant.name}
            />
            <div className="flex flex-col gap-5">
              <span className="text-xl lg:text-2xl font-semibold">
                {cartItem.productName}
              </span>
              <span className="lg:text-xl font-semibold">
                {cartItem.productVariant.name}
              </span>
              <span>price: {cartItem.productVariant.price}$</span>
            </div>
            <div className="flex flex-col gap-5">
              <span className="text-xl lg:text-2xl font-semibold">
                X{cartItem.quantity}
              </span>
              <span>total price: {cartItem.totalPrice}$</span>
            </div>
          </div>
          <div className="flex md:flex-col justify-between"></div>
        </div>
        <Separator />
        <div className="flex gap-6 items-center">
          {cartItem.cartItemExtras.map((cartItemExtra) => (
            <Badge
              className="border-none bg-secondary text-primary flex flex-col w-fit"
              variant={"secondary"}
              key={cartItemExtra.id}
            >
              <span>
                X{cartItemExtra.quantity} {cartItemExtra.productExtra.name}
              </span>
              <span>{cartItemExtra.productExtra.price}$</span>
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="w-full">
        <DeleteCartItemButton cartItemId={cartItem.id} />
      </CardFooter>
    </Card>
  );
};
