/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AddToCartButton } from "./AddToCartButton";
import type {
  ActiveUser,
  Nullable,
  ProductDetail,
  ProductVariant,
} from "@repo/shared";
import Link from "next/link";
import { ExtrasSection } from "./ExtrasSection";
import { VariantsSection } from "./VariantsSection";
import { Separator } from "@/components/ui/separator";
import { VariantQuantityControl } from "./VariantQuantityControl";
import { cn } from "@/lib/utils";

interface ProductDetailCardProps {
  product: ProductDetail;
  user: Nullable<ActiveUser>;
}
export const ProductDetailCard = ({
  product,
  user,
}: ProductDetailCardProps) => {
  const availableVariants: ProductVariant[] = product.variants.filter(
    (variant) => variant.isAvailable
  );

  return (
    <Card
      className={cn(
        "w-full max-w-2xl flex flex-col items-center border-none shadow-xl shadow-black/20 p-8 ",
        "animate-in fade-in slide-in-from-bottom duration-700"
      )}
    >
      <CardHeader className="w-full">
        <CardTitle className="text-center text-4xl text-primary">
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex flex-col gap-6">
        <Carousel className="w-full max-w-md mx-auto">
          <CarouselContent>
            {product.images.map((image) => (
              <CarouselItem key={image.url}>
                <img
                  className="object-cover w-full aspect-square rounded-2xl"
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads${image.url}`}
                  alt={product.name}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className="bg-primary text-white border-none hover:bg-primary/80 cursor-pointer" />
          <CarouselPrevious className="bg-primary text-white border-none hover:bg-primary/80 cursor-pointer" />
        </Carousel>

        <VariantsSection productVariants={availableVariants} disabled={!user} />
        <Separator />
        <ExtrasSection productExtras={product.extras} disabled={!user} />
        <Separator />

        {user ? (
          <div className="flex flex-col justify-center items-center gap-8">
            <VariantQuantityControl />
            <AddToCartButton />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <h3 className="text-muted-foreground">Sign in to add to cart</h3>
            <Link
              href="/signin"
              className="text-primary hover:underline font-semibold"
            >
              Sign in
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
