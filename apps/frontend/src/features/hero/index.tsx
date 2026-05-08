import Image from "next/image";

const Hero = () => (
  <main className="w-full h-screen content">
    <Image fill loading="eager" src={"/hero.jpg"} alt="hero" />
  </main>
);

export default Hero;
