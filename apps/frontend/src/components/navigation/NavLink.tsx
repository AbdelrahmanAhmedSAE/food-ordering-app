"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export interface NavLinkProps {
  link: string;
  children: React.ReactNode;
}

export const NavLink = ({ children, link }: NavLinkProps) => {
  const pathname = usePathname();

  return (
    <Link
      href={link}
      className={`text-primary transition-all duration-200 ${
        pathname === link ? "underline font-bold" : "hover:underline"
      }`}
    >
      {children}
    </Link>
  );
};
