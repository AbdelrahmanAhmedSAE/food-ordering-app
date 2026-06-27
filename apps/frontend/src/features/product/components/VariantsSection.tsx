"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useProductVariantStore } from "../store/productVariantStore";
import type { ProductVariant } from "@repo/shared";
import { useEffect } from "react";

interface VariantsSectionProps {
  productVariants: ProductVariant[];
  disabled: boolean;
}

export const VariantsSection = ({
  productVariants,
  disabled,
}: VariantsSectionProps) => {
  const selectedVariant = useProductVariantStore(
    (state) => state.selectedVariant
  );

  const setVariant = useProductVariantStore((state) => state.setVariant);

  useEffect(() => {
    if (productVariants.length > 0) {
      console.log("Effect...");
      const middleIndex = Math.floor(productVariants.length / 2);
      setVariant(productVariants[middleIndex]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full flex flex-col gap-3">
      <h4 className="font-bold text-lg">Variants</h4>
      <RadioGroup
        disabled={disabled}
        value={selectedVariant?.id ?? ""}
        onValueChange={(value) => {
          const variant = productVariants.find((v) => v.id === value);
          if (variant) setVariant(variant);
        }}
      >
        {productVariants.map((variant) => (
          <div key={variant.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RadioGroupItem value={variant.id} id={variant.id} />
              <Label htmlFor={variant.id}>{variant.name}</Label>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-primary font-bold">{variant.price}$</span>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
