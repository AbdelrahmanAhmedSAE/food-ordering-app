"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface NavigationButtonProps {
  children: ReactNode;
  url: string;
}

export const ClientNavigationButton = ({
  children,
  url,
}: NavigationButtonProps) => {
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
