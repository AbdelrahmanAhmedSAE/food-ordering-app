import { ActiveUser, JwtPayload } from '@repo/shared';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (req: Request) => req?.cookies?.['access_token'],
      ]),
      ignoreExpiration: process.env.NODE_ENV === ('production' as string),
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async validate(payload: JwtPayload): Promise<ActiveUser> {
    return {
      id: payload.sub,
      name: payload.name,
      role: payload.role,
    };
  }
}
