"use server";
import { SigninSchema } from "@repo/shared";
import { signinService } from "../services/signinService";

export const signinAction = async (data: SigninSchema) => {
  await signinService.signin(data);
  return { success: true };
};
