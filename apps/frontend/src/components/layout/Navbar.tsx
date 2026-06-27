import { getMe } from "@/features/auth/logic/getMe";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { SignoutButton } from "../navigation/SignoutButton";
import type { Nullable, ActiveUser } from "@repo/shared";
import { NavLink } from "../navigation/NavLink";
import {
  PUBLIC_LINKS,
  PROTECTED_LINKS,
  AUTH_LINKS,
} from "../navigation/constants/links";
import { MobileNavButton } from "../navigation/MobileNavButton";

export const Navbar = async () => {
  const user: Nullable<ActiveUser> = await getMe();

  return (
    <nav className="bg-background z-50 shadow-2xl shadow-black w-full h-20 fixed flex justify-between p-6 items-center">
      <span className="text-3xl font-bold text-primary">Foodify</span>

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-6">
        {PUBLIC_LINKS.map((l) => (
          <NavLink key={l.link} link={l.link}>
            {l.name}
          </NavLink>
        ))}
        {user ? (
          <>
            {PROTECTED_LINKS.map((l) => (
              <NavLink key={l.link} link={l.link}>
                {l.link === "/cart" ? (
                  <ShoppingCart className="w-5 h-5" />
                ) : (
                  l.name
                )}
              </NavLink>
            ))}
            <SignoutButton />
          </>
        ) : (
          AUTH_LINKS.map((l) => (
            <Button key={l.link} asChild>
              <Link href={l.link}>{l.name}</Link>
            </Button>
          ))
        )}
      </div>

      <MobileNavButton user={user} />
    </nav>
  );
};
