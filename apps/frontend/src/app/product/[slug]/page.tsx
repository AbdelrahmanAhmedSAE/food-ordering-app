import { ProductDetailCard } from "@/features/product/components/ProductDetailCard";
import { ProductService } from "@/features/product/services/productService";
import { HttpError } from "@/lib/http-client";
import { ApiResponse, ErrorCode, ProductDetail } from "@repo/shared";
import { notFound } from "next/navigation";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const { slug } = await params;

  const { data } = (await ProductService.getDetail(slug).catch(
    (error: unknown) => {
      if (
        error instanceof HttpError &&
        error.code === ErrorCode.PRODUCT_NOT_FOUND
      )
        notFound();

      throw error;
    }
  )) as ApiResponse<ProductDetail>;

  return (
    <main className="w-screen h-screen p-40">
      <ProductDetailCard product={data} />
    </main>
  );
};

export default ProductDetailPage;
