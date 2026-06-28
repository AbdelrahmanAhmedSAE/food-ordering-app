"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type SignupSchema, signupSchema, ErrorCode } from "@repo/shared";
import { HttpError } from "@/lib/http-client";
import { signupService } from "../services/signupService";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const SignupForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data: SignupSchema) => {
    try {
      await signupService.signup(data);
      toast.success("Signed up successfully", { position: "top-right" });
      router.replace("/signin");
      return;
    } catch (e: unknown) {
      if (e instanceof HttpError && e.code === ErrorCode.USER_ALREADY_EXISTED) {
        toast.error("Invalid credentials or email already in use", {
          position: "top-right",
        });

        return;
      }

      toast.error("Something went wrong", { position: "top-right" });
    }
  };

  return (
    <main className="flex justify-center bg-background lg:p-16 min-h-screen m-12">
      <Card className="border-none flex flex-col gap-8 shadow-xl w-full lg:w-1/2 bg-card text-card-foreground shadow-black h-fit p-6">
        <CardHeader className=" flex flex-col items-start justify-center">
          <h1 className="text-primary text-4xl font-bold">Join Foodify</h1>
          <p className="text-sm text-muted">Your next meal is one step away</p>
        </CardHeader>

        <CardContent>
          <form
            className="flex flex-col justify-center gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              <h2>Name</h2>
              <Input
                className="outline-primary border-primary"
                {...register("name")}
                placeholder="You"
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

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

            <div className="flex flex-col gap-2">
              <h2>Confirm Password</h2>
              <Input
                className="outline-primary border-primary"
                type="password"
                {...register("confirmPassword")}
                placeholder="**********"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button className="w-full cursor-pointer" type="submit">
              {isSubmitting ? <Spinner /> : "Submit"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <h3>Already have an account?</h3>
          <Link
            href={"/signin"}
            className="flex items-center gap-2 text-primary hover:underline"
          >
            Sign in <ArrowRight />
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
};
