import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductVariantDto } from "@/lib/types/product";

interface VariantsSelectProps {
  variants: ProductVariantDto[];
}

const VariantsSelect = ({ variants }: VariantsSelectProps) => (
  <Select>
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
);

export default VariantsSelect;
