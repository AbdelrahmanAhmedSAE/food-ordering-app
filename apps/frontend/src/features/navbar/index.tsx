import { ShoppingCart } from "lucide-react";
import Link from "next/link";

type NavLink = {
  name: string;
  link: string;
};

const navLinks: NavLink[] = [
  { name: "Home", link: "/" },
  { name: "Menu", link: "/menu" },
  { name: "Orders", link: "/orders" },
  { name: "Cart", link: "/cart" },
];

export default function Navbar() {
  return (
    <nav className="bg-background z-50 shadow-2xl shadow-black w-full h-20 fixed flex justify-between p-6 items-center">
      <span className="text-3xl font-bold text-primary">Foodify</span>

      <div className="flex items-center gap-4 ">
        {navLinks.map((l) => (
          <Link
            className="text-primary underline hover:opacity-45"
            href={l.link}
            key={l.link}
          >
            {l.link == "/cart" ? <ShoppingCart /> : `${l.name}`}
          </Link>
        ))}
      </div>
    </nav>
  );
}
