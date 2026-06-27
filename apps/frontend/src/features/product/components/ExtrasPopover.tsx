"use client";
import { Input } from "@/components/ui/input";
import { useProductExtrasStore } from "../store/productExtrasStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { ProductExtra } from "@repo/shared";

interface ExtrasSelectProps {
  productExtras: ProductExtra[];
  disabled: boolean;
}

export const ExtrasPopover = ({
  productExtras,
  disabled,
}: ExtrasSelectProps) => {
  const extras = useProductExtrasStore((state) => state.extras);
  const addExtra = useProductExtrasStore((state) => state.addExtra);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="cursor-pointer">Extras</Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        className="bg-card text-card-foreground border-none flex flex-col gap-3"
      >
        {productExtras.map((extra) => {
          return (
            <div key={extra.id} className="grid grid-cols-2">
              <h5>{extra.name}</h5>
              <Input
                disabled={disabled}
                className="border-none outline-none"
                type="number"
                value={
                  extras[extras.findIndex((e) => e.extra.id === extra.id)]
                    ?.quantity ?? 0
                }
                onChange={(e) => {
                  if (Number(e.target.value) >= 0) {
                    addExtra(extra, Number(e.target.value));
                  }
                }}
              />
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};
