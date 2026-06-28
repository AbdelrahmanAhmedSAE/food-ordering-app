"use client";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
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
      <AlertDialogTrigger asChild>
        <button className="text-muted-foreground hover:text-red-500 transition-colors cursor-pointer">
          <CircleX className="w-5 h-5" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove item?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-none cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteCartItem}
            className="border-none cursor-pointer bg-red-500 hover:bg-red-600"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
