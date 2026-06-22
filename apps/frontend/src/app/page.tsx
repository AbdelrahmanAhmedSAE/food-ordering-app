import { Hero } from "@/features/home/components/Hero";
import { BestSellersSection } from "@/features/home/components/BestSellersSection";
import { LatestProductsSection } from "@/features/home/components/LatestProductsSection";

const HomePage = () => (
  <main>
    <Hero />
    <BestSellersSection />
    <LatestProductsSection />
  </main>
);

export default HomePage;
