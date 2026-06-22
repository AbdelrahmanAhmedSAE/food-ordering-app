import { ProductDetailCard } from "@/features/product/components/ProductDetailCard";
import { ProductService } from "@/features/product/services/productService";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const { slug } = await params;
  const { data } = await ProductService.getDetail(slug);

  return (
    <main className="w-screen h-screen p-40">
      <ProductDetailCard product={data} />
    </main>
  );
};

export default ProductDetailPage;
