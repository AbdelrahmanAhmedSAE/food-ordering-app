"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { type SigninSchema, signinSchema, ErrorCode } from "@repo/shared";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { httpClient, HttpError } from "@/lib/http-client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export const SigninForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
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
      toast.success("Signed in successfully", {
        position: "top-right",
      });

      router.replace("/");
      router.refresh();
    } catch (e) {
      if (e instanceof HttpError && e.code === ErrorCode.UNAUTHORIZED) {
        toast.error("Invalid credentials or email already in use");

        return;
      }
      toast.error("Something went wrong", { position: "top-right" });
    }
  };

  return (
    <main className="flex justify-center bg-background lg:p-16 min-h-screen m-12">
      <Card className="border-none flex flex-col gap-8 shadow-xl w-full lg:w-1/2 bg-card text-card-foreground shadow-black h-fit p-6">
        <CardHeader className=" flex flex-col items-start justify-center">
          <h1 className="text-primary text-4xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted">
            Sign in to your account to continue
          </p>
        </CardHeader>

        <CardContent>
          <form
            className="flex flex-col justify-center gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              <h2>Email</h2>
              <Input
                className="outline-primary border-primary"
                type="email"
                {...register("email")}
                placeholder="You@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <h2>Password</h2>
              <Input
                className="outline-primary border-primary"
                {...register("password")}
                type="password"
                placeholder="**********"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button className="w-full cursor-pointer" type="submit">
              {isSubmitting ? <Spinner /> : "Submit"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <h3>Don&apos;t have an account?</h3>
          <Link
            href={"/signup"}
            className="flex items-center gap-2 text-primary hover:underline"
          >
            Create account <ArrowRight />
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
};
