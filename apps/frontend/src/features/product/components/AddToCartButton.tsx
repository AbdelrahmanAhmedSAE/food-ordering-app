"use client";
import { Button } from "@/components/ui/button";
import { useProductVariantStore } from "../store/productVariantStore";
import { useRouter } from "next/navigation";
import { useProductExtrasStore } from "../store/productExtrasStore";
import { cartClientService } from "@/features/cart/services/cartClientService";

export const AddToCartButton = () => {
  const router = useRouter();

  const extras = useProductExtrasStore((state) => state.extras);
  const variantQuantity = useProductVariantStore((state) => state.quantity);
  const selectedVariant = useProductVariantStore(
    (state) => state.selectedVariant
  );

  const clearVariantStore = useProductVariantStore(
    (state) => state.clearVariantStore
  );

  const clearExtraStore = useProductExtrasStore(
    (state) => state.clearExtraStore
  );

  const handleAddToCart = async () => {
    const result: boolean = await cartClientService.addToCart(
      selectedVariant,
      variantQuantity,
      extras
    );

    if (result) {
      clearVariantStore();
      clearExtraStore();
      router.push("/cart");
    }
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <Button
        onClick={handleAddToCart}
        className="font-semibold cursor-pointer"
      >
        Add to cart
      </Button>
    </div>
  );
};
