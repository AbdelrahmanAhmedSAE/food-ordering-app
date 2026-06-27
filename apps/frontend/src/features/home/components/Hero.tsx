import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getMe } from "@/features/auth/logic/getMe";

export const Hero = async () => {
  const user = await getMe();

  return (
    <section className="w-full bg-white flex flex-col lg:flex-row items-center px-6 lg:px-16 py-20 gap-10">
      {/* Top on mobile - Image */}
      <div className="relative size-hero-sm sm:size-hero-md lg:size-hero-lg rounded-full overflow-hidden shadow-2xl animate-in fade-in slide-in-from-right-10 duration-700">
        <Image
          fill
          loading="eager"
          src="/hero.jpg"
          alt="hero"
          className="object-cover"
        />
      </div>

      {/* Bottom on mobile - Text */}
      <div className="flex-1 flex flex-col gap-6 items-center lg:items-start text-center lg:text-left animate-in fade-in slide-in-from-left-10 duration-700">
        <span className="text-primary font-semibold text-sm uppercase tracking-widest">
          🔥 Free Delivery Today
        </span>
        <h1 className="text-4xl lg:text-6xl font-black text-gray-900 leading-tight">
          Delicious Food <br />
          <span className="text-primary">Delivered Fast</span>
        </h1>
        <p className="text-gray-500 text-base lg:text-lg max-w-sm">
          Order your favorite meals from the best restaurants near you
        </p>
        <Button
          asChild
          size="lg"
          className="w-fit bg-primary hover:opacity-80 text-white px-8 py-6 text-lg rounded-full"
        >
          <Link href={user ? "/menu" : "/signin"}>Order Now 🍕</Link>
        </Button>
      </div>
    </section>
  );
};
