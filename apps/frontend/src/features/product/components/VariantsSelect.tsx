"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductVariantDto } from "@/lib/types/product";
import useProductVariantStore from "../store/productVariantStore";
import { Input } from "@/components/ui/input";

interface VariantsSelectProps {
  variants: ProductVariantDto[];
}

const VariantsSelect = ({ variants }: VariantsSelectProps) => {
  const variantQuantity = useProductVariantStore((state) => state.quantity);
  const setSelectedVariant = useProductVariantStore(
    (state) => state.setProductVariant
  );

  const setVariantQuantity = useProductVariantStore(
    (state) => state.setProductVariantQuantity
  );

  return (
    <div className="w-full flex flex-col gap-5">
      <Select
        onValueChange={(name) => {
          const variant = variants.find((v) => v.name === name);
          if (variant) setSelectedVariant(variant);
        }}
      >
        <SelectTrigger className="text-black cursor-pointer">
          <SelectValue placeholder="Select a variant"></SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectGroup>
            {variants.map((variant) => (
              <SelectItem
                className="cursor-pointer"
                key={variant.name}
                value={variant.name}
              >
                {variant.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Input
        type="number"
        value={variantQuantity}
        onChange={(e) => setVariantQuantity(Number(e.target.value))}
      />
    </div>
  );
};

export default VariantsSelect;
