/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductDto } from "@/lib/types/product";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import VariantsPopover from "./VariantsPopover";
import ExtrasPopover from "./ExtrasPopover";
import AddToCartButton from "./AddToCartButton";

interface ProductDetailsCardProps {
  product: ProductDto;
}

const ProductDetailsCard = ({ product }: ProductDetailsCardProps) => (
  <Card className="flex flex-col items-center border-none shadow-2xl shadow-black">
    <CardHeader>
      <CardTitle className="text-center text-4xl text-primary">
        {product.name}
      </CardTitle>
    </CardHeader>
    <CardContent className="w-fit flex flex-col items-center gap-5">
      <Carousel>
        <CarouselContent>
          {product.images.map((image) => (
            <CarouselItem
              className="sm:w-14 sm:h-88 lg:w-40 lg:h-132"
              key={image.url}
            >
              <img
                className="object-cover w-full h-full rounded-2xl"
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads${image.url}`}
                alt={product.name}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="font-black text-black text-4xl cursor-pointer" />
        <CarouselPrevious className="font-black text-black text-4xl cursor-pointer" />
      </Carousel>
      <div className="flex items-center justify-around w-full">
        <VariantsPopover productVariants={product.variants} />
        <ExtrasPopover productExtras={product.extras} />
      </div>

      <AddToCartButton />
    </CardContent>
  </Card>
);

export default ProductDetailsCard;
