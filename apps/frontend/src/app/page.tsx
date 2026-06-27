import { Hero } from "@/features/home/components/Hero";
import { BestSellersSection } from "@/features/home/components/BestSellersSection";
import { LatestProductsSection } from "@/features/home/components/LatestProductsSection";

const HomePage = () => (
  <main className="w-full flex flex-col gap-20">
    <Hero />
    <BestSellersSection />
    <LatestProductsSection />
  </main>
);

export default HomePage;
