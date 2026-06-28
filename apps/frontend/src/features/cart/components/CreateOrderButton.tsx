"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PaymentMethod, createOrderSchema } from "@repo/shared";
import { orderClientService } from "@/features/order/services/orderClientService";
import { Spinner } from "@/components/ui/spinner";

export interface CreateOrderButtonProps {
  totalPrice: number;
}

export const CreateOrderButton = ({ totalPrice }: CreateOrderButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );

  const router = useRouter();

  const handleCreateOrder = () => {
    startTransition(async () => {
      const valid = createOrderSchema.safeParse({
        deliveryAddress,
        paymentMethod,
      });

      if (!valid.success) {
        toast.error(valid.error.message, { position: "top-right" });
        return;
      }

      try {
        const { data } = await orderClientService.createOrder({
          deliveryAddress,
          paymentMethod,
        });

        if (data.paymentMethod === PaymentMethod.ONLINE)
          router.replace(`/checkout?orderId=${data.id}`);
        else router.replace("/orders");
      } catch (error) {
        if (error instanceof Error)
          toast.error(error.message, { position: "top-right" });
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer text-primary-foreground text-2xl font-semibold w-full">
          Create order
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Order</DialogTitle>
          <DialogDescription className="text-primary font-bold text-lg">
            Total: {totalPrice}$
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="delivery-address" className="font-semibold">
              Delivery Address
            </Label>
            <Input
              className="border border-border rounded-xl"
              id="delivery-address"
              placeholder="Enter your delivery address..."
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-semibold">Payment Method</Label>
            <RadioGroup
              defaultValue={PaymentMethod.CASH}
              className="flex gap-4"
              onValueChange={(value) =>
                setPaymentMethod(value as PaymentMethod)
              }
            >
              {Object.keys(PaymentMethod).map((method) => (
                <div
                  key={method}
                  className="flex items-center gap-2 border border-border rounded-xl px-4 py-3 cursor-pointer"
                >
                  <RadioGroupItem id={method} value={method} />
                  <Label htmlFor={method} className="cursor-pointer">
                    {method}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button className="w-full cursor-pointer" onClick={handleCreateOrder}>
            {isPending ? <Spinner /> : "Confirm Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
