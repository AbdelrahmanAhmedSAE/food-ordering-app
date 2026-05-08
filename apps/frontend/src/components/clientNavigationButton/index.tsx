"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ReactNode } from "react";

interface NavigationButtonProps {
  children: ReactNode;
  url: string;
}

const ClientNavigationButton = ({ children, url }: NavigationButtonProps) => {
  const router = useRouter();

  return (
    <Button
      className="cursor-pointer hover:opacity-70"
      onClick={() => router.push(url)}
    >
      {children}
    </Button>
  );
};

export default ClientNavigationButton;
