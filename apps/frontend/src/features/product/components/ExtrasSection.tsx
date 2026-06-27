"use client";
import { useProductExtrasStore } from "../store/productExtrasStore";
import { QuantityControl } from "../../../components/product/QuantityControl";
import type { ProductExtra } from "@repo/shared";
import { cn } from "@/lib/utils";

interface ExtrasSectionProps {
  productExtras: ProductExtra[];
  disabled: boolean;
}

export const ExtrasSection = ({
  productExtras,
  disabled,
}: ExtrasSectionProps) => {
  const extras = useProductExtrasStore((state) => state.extras);
  const addExtra = useProductExtrasStore((state) => state.addExtra);

  return (
    <div className="w-full flex flex-col gap-3">
      <h4 className="font-bold text-lg">Extras</h4>
      {productExtras.map((extra) => (
        <div key={extra.id} className="flex items-center justify-between">
          <span>{extra.name}</span>
          <div className="flex gap-4 items-center">
            <span className="text-primary font-bold">{extra.price}$</span>
            <QuantityControl
              className={cn(disabled && "hidden")}
              value={extras.find((e) => e.extra.id === extra.id)?.quantity ?? 0}
              onChange={(value) => addExtra(extra, value)}
              min={0}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
