"use client";
import { Input } from "@/components/ui/input";
import type { ProductExtraDto } from "@/lib/types/product";
import useProductExtraStore from "../store/productExtrasStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ExtrasSelectProps {
  productExtras: ProductExtraDto[];
}

const ExtrasPopover = ({ productExtras }: ExtrasSelectProps) => {
  const extras = useProductExtraStore((state) => state.extras);
  const addExtra = useProductExtraStore((state) => state.addExtra);

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

  // return (
  //   <div className="flex items-center justify-center gap-2">
  //     <h4 className="text-center font-semibold text-xl">Extras: </h4>
  //     <div className="flex justify-center gap-5">
  //       {productExtras.map((extra) => (
  //         <div key={extra.id} className="flex flex-col gap-1">
  //           <span>{extra.name}</span>
  //           <span>
  //             {extras.find((e) => e.extra.id === extra.id)?.quantity ?? ""}
  //           </span>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );

  // return (
  //   <div className="w-full flex flex-col gap-5">
  //     <Select
  //       onValueChange={(name) => {
  //         const extra = extras.find((e) => e.name === name);
  //         if (extra) setSelectedExtra(extra);
  //       }}
  //     >
  //       <SelectTrigger className="text-black cursor-pointer">
  //         <SelectValue placeholder="Select a extra"></SelectValue>
  //       </SelectTrigger>
  //       <SelectContent className="bg-white">
  //         <SelectGroup>
  //           {extras.map((extra) => (
  //             <SelectItem
  //               className=" cursor-pointer"
  //               key={extra.name}
  //               value={extra.name}
  //             >
  //               {extra.name}
  //             </SelectItem>
  //           ))}
  //         </SelectGroup>
  //       </SelectContent>
  //     </Select>

  //     <Input
  //       type="number"
  //       value={extraQuantity}
  //       onChange={(e) => setExtraQuantity(Number(e.target.value))}
  //     />
  //   </div>
  // );
};

export default ExtrasPopover;
