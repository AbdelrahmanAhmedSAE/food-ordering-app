import Image from "next/image";

export const Hero = () => (
  <main className="w-full h-screen content">
    <Image fill loading="eager" src={"/hero.jpg"} alt="hero" />
  </main>
);
