import { getMe } from "@/features/auth/logic/getMe";
import { Nullable, ActiveUser } from "@repo/shared";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ProtectedLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const user: Nullable<ActiveUser> = await getMe();
  if (!user) {
    (await cookies()).delete("access_token");
    redirect("/signin");
  }

  return <>{children}</>;
};

export default ProtectedLayout;
