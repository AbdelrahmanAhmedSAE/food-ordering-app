"use client";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { cartItemService } from "../services/cartItemService";
import { toast } from "sonner";

interface DeleteCartItemButton {
  cartItemId: string;
}

export const DeleteCartItemButton = ({ cartItemId }: DeleteCartItemButton) => {
  const router = useRouter();

  const handleDeleteCartItem = async () => {
    try {
      await cartItemService.deleteCartItem(cartItemId);
      router.refresh();
    } catch {
      toast.error("Failed to delete item");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="w-full">
        <Button className="font-semibold bg-red-700 cursor-pointer rounded-full w-full">
          <CircleX className="text-4xl font-black" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-none bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure about delete this item?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-none cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteCartItem}
            className="border-none cursor-pointer bg-red-700"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
