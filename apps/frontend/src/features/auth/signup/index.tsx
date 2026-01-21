"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  type SignupSchema,
  signupSchema,
} from "../validations/signupValidation";
import { toast } from "sonner";
import { useAuthControllerSignup } from "@/generated/auth/auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import type { SignupDto } from "@/generated/models.ts";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const router = useRouter();

  const signupMutation = useAuthControllerSignup({
    mutation: {
      onSuccess: () => {
        toast.success("Signed up successfully", {
          position: "top-right",
        });
        router.push("/auth/signin");
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        console.log(error);
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      },
    },
  });

  const onSubmit = (data: SignupSchema) => {
    const payload: SignupDto = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    if (data.phone) payload.phone = data.phone;
    if (data.address) payload.address = data.address;

    signupMutation.mutate({ data: payload });
  };

  return (
    <main className="flex justify-center items-center bg-background min-h-screen">
      <Card className="border-none shadow w-4/5">
        <CardHeader className="text-primary text-4xl font-bold w-full flex items-center justify-center">
          Signup
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Input
                className="outline-primary border-primary"
                {...register("name")}
                placeholder="Name..."
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-red-800 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

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

            <div className="space-y-1">
              <Input
                className="outline-primary border-primary"
                type="password"
                {...register("confirmPassword")}
                placeholder="Password again..."
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-red-800 text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                className="outline-primary border-primary"
                {...register("phone")}
                placeholder="Phone..."
                autoComplete="tel"
              />
              {errors.phone && (
                <p className="text-red-800 text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                className="outline-none border-primary"
                {...register("address")}
                placeholder="Address..."
                autoComplete="address-level1"
              />
              {errors.address && (
                <p className="text-red-800 text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            <Button
              className="w-full cursor-pointer"
              type="submit"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? <Spinner /> : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
