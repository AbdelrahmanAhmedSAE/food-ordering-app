import { SignupSchema } from "@repo/shared";
import { signupService } from "../services/signupService";

export const signupAction = async (
  data: Omit<SignupSchema, "confirmPassword">
) => {
  await signupService.signup(data);
  return { success: true };
};
