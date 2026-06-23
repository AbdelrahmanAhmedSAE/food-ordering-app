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
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PaymentMethod, createOrderSchema } from "@repo/shared";
import { orderClientService } from "@/features/order/services/orderClientService";

export interface CreateOrderButtonProps {
  totalPrice: number;
}

export const CreateOrderButton = ({ totalPrice }: CreateOrderButtonProps) => {
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );

  const router = useRouter();

  const handleCreateOrder = async () => {
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
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer text-primary-foreground text-2xl font-semibold w-full">
          Create order
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-10">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create order</DialogTitle>
          <DialogDescription>Total price: {totalPrice}$</DialogDescription>
        </DialogHeader>

        <div className=" flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="delivery-address">Delivery address</Label>
            <Input
              className="border-none outline-primary"
              id="delivery-address"
              placeholder="Enter you delivery address..."
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDeliveryAddress(e.target.value)
              }
            />
          </div>
          <RadioGroup
            defaultValue={PaymentMethod.CASH}
            className="flex justify-around"
            onValueChange={(value: string) =>
              setPaymentMethod(value as PaymentMethod)
            }
          >
            {Object.keys(PaymentMethod).map((method: string) => (
              <div key={method}>
                <RadioGroupItem id={method} value={method} />
                <Label htmlFor={method}>{method}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button className="cursor-pointer w-full" onClick={handleCreateOrder}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
