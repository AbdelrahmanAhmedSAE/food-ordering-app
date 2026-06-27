"use client";
import { useProductVariantStore } from "../store/productVariantStore";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { ProductVariant } from "@repo/shared";

interface VariantsSelectProps {
  productVariants: ProductVariant[];
  disabled: boolean;
}

export const VariantsPopover = ({
  productVariants,
  disabled,
}: VariantsSelectProps) => {
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
          disabled={disabled}
          onValueChange={(value) => {
            const variant = productVariants.find((v) => v.id === value);
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
          disabled={disabled}
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
