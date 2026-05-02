import BestSellers from "@/features/bestSellers";
import Hero from "@/features/hero";
import LatestProducts from "@/features/latestProducts";

export default function Home() {
  return (
    <main>
      <Hero />
      <BestSellers />
      <LatestProducts />
    </main>
  );
}
