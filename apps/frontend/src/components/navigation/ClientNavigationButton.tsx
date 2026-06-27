"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ClientNavigationButtonProps {
  children: ReactNode;
  url: string;
}

export const ClientNavigationButton = ({
  children,
  url,
}: ClientNavigationButtonProps) => {
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
