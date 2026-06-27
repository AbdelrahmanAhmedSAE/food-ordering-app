import { SignupSchema, signupSchema } from '@repo/shared';
import { createDto } from 'src/common/utils/create-dto';

export class SignupDto
  extends createDto(signupSchema)
  implements Omit<SignupSchema, 'confirmPassword'>
{
  name: string;
  email: string;
  password: string;
  phone?: string | undefined;
  address?: string | undefined;
}
