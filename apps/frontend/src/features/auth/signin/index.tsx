"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  type SigninSchema,
  signinSchema,
} from "../validations/signinValidation";
import { toast } from "sonner";
import { useAuthControllerSignin } from "@/generated/auth/auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";

const SigninForm = () => {
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

  const router = useRouter();

  const signinMutation = useAuthControllerSignin({
    mutation: {
      onSuccess: () => {
        toast.success("Signed in successfully", {
          position: "top-right",
        });
        router.replace("/");
      },
      onError: () => {
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      },
    },
  });

  const onSubmit = (data: SigninSchema) => {
    signinMutation.mutate({ data });
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

            <Button
              className="w-full cursor-pointer"
              type="submit"
              disabled={signinMutation.isPending}
            >
              {signinMutation.isPending ? <Spinner /> : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default SigninForm;
