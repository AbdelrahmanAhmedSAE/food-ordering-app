/* eslint-disable @next/next/no-img-element */
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClientNavigationButton } from "@/components/navigation/ClientNavigationButton";
import type { ProductSummery } from "@repo/shared";

interface ProductCardProps {
  product: ProductSummery;
  className?: string;
}
export const ProductCard = ({ product, className }: ProductCardProps) => (
  <Card
    className={`border-none shadow-black shadow-xl flex flex-col justify-between py-6 items-center 
 lg:transition-all lg:duration-300 lg:hover:shadow-2xl ${
   className === undefined
     ? "lg:hover:-translate-y-2"
     : "lg:hover:-translate-y-12"
 } ${className}`}
  >
    <CardHeader>
      <CardTitle className="text-center font-bold text-lg">
        {product.name}
      </CardTitle>
    </CardHeader>
    <CardContent className="w-full px-6 flex flex-col items-center gap-4">
      <div className="w-full aspect-square rounded-2xl overflow-hidden">
        {" "}
        <img
          className="w-full h-full object-cover"
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads${product.imageUrl}`}
          alt={product.name}
        />
      </div>
      <span className="text-primary font-black text-xl">{product.price}$</span>
    </CardContent>
    <CardFooter>
      <ClientNavigationButton url={`/product/${product.slug}`}>
        View Details
      </ClientNavigationButton>
    </CardFooter>
  </Card>
);
