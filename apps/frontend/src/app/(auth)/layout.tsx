import { getMe } from "@/features/auth/logic/getMe";
import { ActiveUser, Nullable } from "@repo/shared";
import { redirect } from "next/navigation";

const AuthLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const user: Nullable<ActiveUser> = await getMe();
  if (user) redirect("/");

  return <>{children}</>;
};

export default AuthLayout;
