/* eslint-disable @next/next/no-img-element */
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingBasket } from "lucide-react";
import { ClientNavigationButton } from "@/components/ClientNavigationButton";
import type { ProductSummery } from "@repo/shared";

interface ProductCardProps {
  product: ProductSummery;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => (
  <Card
    className={`border-none shadow-black shadow-xl flex flex-col justify-between py-10 items-center ${className}`}
  >
    <CardHeader>
      <CardTitle className="text-center font-bold">{product.name}</CardTitle>
    </CardHeader>
    <CardContent className="w-4/5 flex flex-col items-center gap-5">
      <div className="w-full mx-auto h-60 rounded-4xl">
        <img
          className="w-full h-full rounded-4xl object-cover"
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads${product.imageUrl}`}
          alt={product.name}
        />
      </div>
      <span>{product.price}$</span>
    </CardContent>
    <CardFooter>
      <ClientNavigationButton url={`/product/${product.slug}`}>
        <ShoppingBasket />
        Add to card
      </ClientNavigationButton>
    </CardFooter>
  </Card>
);
