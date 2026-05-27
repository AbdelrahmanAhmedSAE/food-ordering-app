"use client";
import type { ProductVariantDto } from "@/lib/types/product";
import useProductVariantStore from "../store/productVariantStore";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface VariantsSelectProps {
  productVariants: ProductVariantDto[];
}

const VariantsPopover = ({ productVariants }: VariantsSelectProps) => {
  const variantQuantity = useProductVariantStore((state) => state.quantity);
  const setVariant = useProductVariantStore((state) => state.setVariant);

  const setVariantQuantity = useProductVariantStore(
    (state) => state.setVariantQuantity
  );

  return (
    <Popover>
      <PopoverTrigger asChild className="bg-primary border-none text-secondary">
        <Button className="cursor-pointer">Variants</Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="bg-card border-none text-card-foreground flex flex-col items-start gap-3"
      >
        <h4>Variants</h4>
        <RadioGroup
          onValueChange={(value) => {
            const variant = productVariants.find((v) => v.id === value);
            console.log("Vartiant", variant);
            if (variant) setVariant(variant);
          }}
        >
          {productVariants.map((productVariant) => (
            <div key={productVariant.id} className="flex gap-1 cursor-pointer">
              <RadioGroupItem
                value={productVariant.id}
                id={productVariant.id}
                className="cursor-pointer"
              />
              <Label className="cursor-pointer" htmlFor={productVariant.id}>
                {productVariant.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <Input
          className="border-none outline-none"
          type="number"
          value={variantQuantity}
          onChange={(e) => {
            if (Number(e.target.value) >= 0)
              setVariantQuantity(Number(e.target.value));
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default VariantsPopover;
