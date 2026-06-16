import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from 'src/generated/prisma/client';
import {
  ApiOperation,
  ApiCookieAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { SetResponseMessage } from 'src/common/decorators/set-message.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { CookieInterceptor } from 'src/common/interceptors/cookie.interceptor';
import { SetCookie } from 'src/common/decorators/set-cookie.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create new user account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
  })
  @SetResponseMessage('Signup successfully')
  @Public()
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
  @SetCookie([
    {
      name: 'access_token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    },
  ])
  @UseInterceptors(CookieInterceptor)
  @SetResponseMessage('Signin successfully')
  @Public()
  @Post('/signin')
  public async signin(@CurrentUser() user: User) {
    return this.authService.signin(user);
  }

  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiCookieAuth('access_token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authenticated user profile',
  })
  @SetResponseMessage('Profile fetched successfully')
  @Get('/profile')
  public getProfile(@CurrentUser() user: User) {
    return user;
  }
}
