"use client";
import { Button } from "@/components/ui/button";
import useProductVariantStore from "../store/productVariantStore";
import addToCartService from "../services/addToCartService";
import { useRouter } from "next/navigation";

const AddToCartButton = () => {
  const variantQuantity = useProductVariantStore((state) => state.quantity);
  const selectedProductVariant = useProductVariantStore(
    (state) => state.selectedProductVariant
  );

  const router = useRouter();

  return (
    <div className="w-full flex flex-col gap-5">
      <Button
        onClick={async () => {
          const result: boolean = await addToCartService.addToCart(
            selectedProductVariant,
            variantQuantity
          );

          if (result) router.push("/cart");
        }}
        className="font-semibold cursor-pointer"
      >
        Add to cart
      </Button>
    </div>
  );
};

export default AddToCartButton;
