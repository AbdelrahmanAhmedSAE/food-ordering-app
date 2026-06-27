"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type SigninSchema, signinSchema, ErrorCode } from "@repo/shared";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { httpClient, HttpError } from "@/lib/http-client";

export const SigninForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SigninSchema) => {
    try {
      await httpClient.post("/api/v1/auth/signin", data);
      toast.success("Signed in successfully", { position: "top-right" });

      router.replace("/");
      router.refresh();
    } catch (e) {
      if (e instanceof HttpError && e.code === ErrorCode.UNAUTHORIZED) {
        toast.error("Invalid credentials or email already in use", {
          position: "top-right",
        });

        return;
      }
      toast.error("Something went wrong", { position: "top-right" });
    }
  };

  return (
    <main className="flex justify-center items-center bg-background min-h-screen">
      <Card className="border-none shadow w-4/5">
        <CardHeader className="text-primary text-4xl font-bold w-full flex items-center justify-center">
          Signin
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Input
                className="outline-primary border-primary"
                type="email"
                {...register("email")}
                placeholder="Email.."
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-800 text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                className="outline-primary border-primary"
                {...register("password")}
                type="password"
                placeholder="Password..."
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-red-800 text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button className="w-full cursor-pointer" type="submit">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};
