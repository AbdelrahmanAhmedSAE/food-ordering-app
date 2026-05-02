import ProductDetailsPageBody from "@/features/product/productDetails";

interface ProductDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params;

  return (
    <main>
      <ProductDetailsPageBody slug={slug} />
    </main>
  );
}
