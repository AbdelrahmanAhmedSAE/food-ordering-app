import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ActiveUser, Nullable, signinSchema } from '@repo/shared';
import { AppUnauthorizedException } from 'src/common/exceptions';
import { ZodValidationException } from 'nestjs-zod';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  public async validate(email: string, password: string): Promise<ActiveUser> {
    const result = signinSchema.safeParse({ email, password });

    if (!result.success) {
      throw new ZodValidationException(result.error);
    }

    const user: Nullable<ActiveUser> = await this.authService.validateUser(
      email,
      password,
    );

    if (!user) {
      throw new AppUnauthorizedException();
    }

    return user;
  }
}
