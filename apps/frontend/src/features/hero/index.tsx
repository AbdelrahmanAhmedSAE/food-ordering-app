import Image from "next/image";

export default function Hero() {
  return (
    <main className="w-full h-screen content">
      <Image fill loading="eager" src={"/hero.jpg"} alt="hero" />
    </main>
  );
}
