"use client";
import { Button } from "@/components/ui/button";
import useProductVariantStore from "../store/productVariantStore";
import addToCartService from "../services/addToCartService";
import { useRouter } from "next/navigation";
import useProductExtraStore from "../store/productExtrasStore";

const AddToCartButton = () => {
  const variantStore = useProductVariantStore();
  const extraStore = useProductExtraStore();

  const router = useRouter();

  return (
    <div className="w-full flex flex-col gap-5">
      <Button
        onClick={async () => {
          const result: boolean = await addToCartService.addToCart(
            variantStore.selectedVariant,
            variantStore.quantity,
            extraStore.extras
          );

          if (result) {
            variantStore.clearVariantStore();
            extraStore.clearExtraStore();
            router.push("/cart");
          }
        }}
        className="font-semibold cursor-pointer"
      >
        Add to cart
      </Button>
    </div>
  );
};

export default AddToCartButton;
