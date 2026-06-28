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
// CartItemCard.tsx
export const CartItemCard = ({ className, cartItem }: CartItemCardProps) => (
  <Card className={cn("border-none shadow-md shadow-black/10 p-4", className)}>
    <CardContent className="p-0 flex gap-4">
      <img
        className="w-24 h-24 rounded-xl object-cover"
        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${cartItem.productVariant.image.url}`}
        alt={cartItem.productVariant.name}
      />

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-bold">{cartItem.productName}</span>
            <span className="text-muted-foreground text-sm">
              {cartItem.productVariant.name}
            </span>
          </div>
          <DeleteCartItemButton cartItemId={cartItem.id} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            x{cartItem.quantity}
          </span>
          <span className="text-primary font-black text-lg">
            {cartItem.totalPrice}$
          </span>
        </div>

        {/* Extras */}
        {cartItem.cartItemExtras.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-wrap gap-2">
              {cartItem.cartItemExtras.map((cartItemExtra) => (
                <Badge
                  key={cartItemExtra.id}
                  className="border-none bg-secondary text-primary"
                  variant="secondary"
                >
                  x{cartItemExtra.quantity} {cartItemExtra.productExtra.name} —{" "}
                  {cartItemExtra.productExtra.price}$
                </Badge>
              ))}
            </div>
          </>
        )}
      </div>
    </CardContent>
  </Card>
);
