"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductExtraDto } from "@/lib/types/product";
import useProductExtraStore from "../store/productExtraStore";

interface ExtrasSelectProps {
  extras: ProductExtraDto[];
}

const ExtrasSelect = ({ extras }: ExtrasSelectProps) => {
  const extraQuantity = useProductExtraStore((state) => state.quantity);

  const setSelectedExtra = useProductExtraStore(
    (state) => state.setProductExtra
  );

  const setExtraQuantity = useProductExtraStore(
    (state) => state.setProductExtraQuantity
  );

  return (
    <div className="w-full flex flex-col gap-5">
      <Select
        onValueChange={(name) => {
          const extra = extras.find((e) => e.name === name);
          if (extra) setSelectedExtra(extra);
        }}
      >
        <SelectTrigger className="text-black cursor-pointer">
          <SelectValue placeholder="Select a extra"></SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectGroup>
            {extras.map((extra) => (
              <SelectItem
                className=" cursor-pointer"
                key={extra.name}
                value={extra.name}
              >
                {extra.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Input
        type="number"
        value={extraQuantity}
        onChange={(e) => setExtraQuantity(Number(e.target.value))}
      />
    </div>
  );
};

export default ExtrasSelect;
