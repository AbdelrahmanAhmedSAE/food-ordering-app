import ProductDetailsPageBody from "@/features/product/productDetails";

interface ProductDetailsPageProps {
  params: Promise<{ slug: string }>;
}

const ProductDetailsPage = async ({ params }: ProductDetailsPageProps) => {
  const { slug } = await params;
  return <ProductDetailsPageBody slug={slug} />;
};

export default ProductDetailsPage;
