import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ActiveUser, Nullable } from '@repo/shared';
import { AppUnauthorizedException } from 'src/common/exceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  public async validate(email: string, password: string): Promise<ActiveUser> {
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
