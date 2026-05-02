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
import VariantsSelect from "./VariantsSelect";
import ExtrasSelect from "./ExtrasSelect";

interface ProductDetailsCardProps {
  product: ProductDto;
}

export default function ProductDetailsCard({
  product,
}: ProductDetailsCardProps) {
  return (
    <Card className="flex flex-col items-center border-none shadow-2xl shadow-black">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-primary">
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
        <div className="flex items-center justify-between w-full gap-10">
          <div className="w-2/3">
            <VariantsSelect variants={product.variants} />
          </div>
          <div className="w-2/3">
            <ExtrasSelect extras={product.extras} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

//
