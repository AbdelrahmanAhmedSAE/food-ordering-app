"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "./NavLink";
import { Button } from "../ui/button";
import Link from "next/link";
import { SignoutButton } from "./SignoutButton";
import { PUBLIC_LINKS, PROTECTED_LINKS, AUTH_LINKS } from "./constants/links";
import type { ActiveUser, Nullable } from "@repo/shared";
import { FadeSlide } from "../animations/FadeSlide";
import { RotateOnToggle } from "../animations/RotateOnToggle";

interface MobileNavButtonProps {
  user: Nullable<ActiveUser>;
}

export const MobileNavButton = ({ user }: MobileNavButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button className="cursor-pointer" onClick={() => setOpen(!open)}>
        <RotateOnToggle toggled={open}>
          {open ? (
            <X className="w-6 h-6 text-primary" />
          ) : (
            <Menu className="w-6 h-6 text-primary" />
          )}
        </RotateOnToggle>
      </button>

      <FadeSlide
        show={open}
        direction="down"
        className="absolute top-20 left-0 right-0 bg-background shadow-md flex flex-col gap-4 p-6 z-50"
      >
        {PUBLIC_LINKS.map((l) => (
          <NavLink key={l.link} link={l.link}>
            {l.name}
          </NavLink>
        ))}
        {user ? (
          <>
            {PROTECTED_LINKS.map((l) => (
              <NavLink key={l.link} link={l.link}>
                {l.name}
              </NavLink>
            ))}
            <SignoutButton />
          </>
        ) : (
          AUTH_LINKS.map((l) => (
            <Button key={l.link} asChild onClick={() => setOpen(false)}>
              <Link href={l.link}>{l.name}</Link>
            </Button>
          ))
        )}
      </FadeSlide>
    </div>
  );
};
