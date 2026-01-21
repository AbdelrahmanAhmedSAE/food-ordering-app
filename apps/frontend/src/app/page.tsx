import Hero from "@/features/hero";

export default function Home() {
  return (
    <main>
      <Hero />

      {process.env.NEXT_PUBLIC_API_URL}
    </main>
  );
}
