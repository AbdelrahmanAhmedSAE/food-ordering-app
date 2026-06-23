import { signupSchema } from '@repo/shared';
import { createDto } from 'src/common/utils/create-dto';

export class SignupDto extends createDto(signupSchema) {}
