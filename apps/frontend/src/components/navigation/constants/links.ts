export type NavLinkType = {
  name: string;
  link: string;
};

export const PUBLIC_LINKS: readonly NavLinkType[] = [
  { name: "Home", link: "/" },
  { name: "Menu", link: "/menu" },
] as const;

export const AUTH_LINKS: readonly NavLinkType[] = [
  { name: "Signin", link: "/signin" },
  { name: "Signup", link: "/signup" },
] as const;

export const PROTECTED_LINKS: readonly NavLinkType[] = [
  { name: "Orders", link: "/orders" },
  { name: "Cart", link: "/cart" },
] as const;
