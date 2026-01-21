import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CookieAwareRequest } from './types/auth-cookie.types';
import { AuthCookieInterceptor } from './interceptors/auth-cookie.interceptor';
import { User } from 'src/generated/prisma/client';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiOperation,
  ApiCookieAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create new user account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
  })
  @Post('/signup')
  public signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @ApiOperation({ summary: 'Sign in using email/phone and password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'ahmed@email.com' },
        password: { type: 'string', example: 'Aa@12345' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Signed in successfully (JWT set in HttpOnly cookie)',
  })
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(AuthCookieInterceptor)
  @Post('/signin')
  public async signin(@Request() req: CookieAwareRequest) {
    console.log('controller');
    const { access_token } = await this.authService.signin(req.user as User);
    req.pendingCookies = [
      {
        name: 'access_token',
        value: access_token,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      },
    ];

    return {
      status: HttpStatus.ACCEPTED,
      message: 'Signed in successfully',
    };
  }

  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiCookieAuth('access_token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authenticated user profile',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  public getProfile(@Request() req: CookieAwareRequest) {
    return req.user;
  }
}
