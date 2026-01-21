import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthIdentity } from '../types/identity,types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  public async validate(
    email: string,
    password: string,
  ): Promise<AuthIdentity> {
    const user = await this.authService.validateUser(email, password);

    console.log('strategy');

    if (!user) {
      throw new UnauthorizedException('Forbi');
    }

    return user;
  }
}
