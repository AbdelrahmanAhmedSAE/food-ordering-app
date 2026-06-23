"use client";
import { Button } from "@/components/ui/button";
import { useProductVariantStore } from "../store/productVariantStore";
import { useRouter } from "next/navigation";
import { useProductExtrasStore } from "../store/productExtrasStore";
import { cartClientService } from "@/features/cart/services/cartClientService";
import { ApiResponse, CartDetail, ErrorCode } from "@repo/shared";
import { HttpError } from "@/lib/http-client";
import { toast } from "sonner";

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
    if (!selectedVariant.id && variantQuantity <= 0) {
      toast.warning("Select the variant and his quantity");
      return;
    }

    try {
      const result: ApiResponse<CartDetail> = await cartClientService.addToCart(
        selectedVariant,
        variantQuantity,
        extras
      );

      if (result.success) {
        clearVariantStore();
        clearExtraStore();
        router.push("/cart");
      }
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        if (error.code === ErrorCode.UNAUTHORIZED) router.push("/auth/signin");

        if (error.code === ErrorCode.UNAVAILABLE_PRODUCT_VARIANT)
          toast.error("This product variant is not available");

        if (error.code === ErrorCode.INVALID_PRODUCT_EXTRA)
          toast.error("This product extra is invalid");
      }

      throw error;
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
