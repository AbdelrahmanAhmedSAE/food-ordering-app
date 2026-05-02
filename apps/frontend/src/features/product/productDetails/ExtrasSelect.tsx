import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductExtraDto } from "@/lib/types/product";

interface ExtrasSelectProps {
  extras: ProductExtraDto[];
}

export default function ExtrasSelect({ extras }: ExtrasSelectProps) {
  return (
    <Select>
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
  );
}
