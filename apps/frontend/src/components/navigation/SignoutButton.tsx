"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signoutService } from "@/features/auth/services/signoutService";
import { Spinner } from "../ui/spinner";

export const SignoutButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignout = async () => {
    setLoading(true);
    await signoutService.signout();
    router.replace("/");
    router.refresh();
  };

  return (
    <Button
      className="bg-red-500 hover:opacity-60 cursor-pointer"
      onClick={handleSignout}
      disabled={loading}
    >
      {loading ? <Spinner /> : "Signout"}
    </Button>
  );
};
