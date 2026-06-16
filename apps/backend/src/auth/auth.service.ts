import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ActiveUser, Nullable } from '@app/shared';
import { Role, User } from 'src/generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<Nullable<ActiveUser>> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        id: user.id,
        name: user.name,
        role: user.role || Role.CUSTOMER,
      } satisfies ActiveUser;
    } else {
      return null;
    }
  }

  public async signup(signupDto: SignupDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: signupDto.email },
    });

    if (user) {
      throw new ConflictException('User already existed');
    }

    const hashedPassword: string = await bcrypt.hash(signupDto.password, 10);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...data } = await this.prisma.user.create({
      data: {
        email: signupDto.email,
        name: signupDto.name,
        password: hashedPassword,
        phone: signupDto.phone,
        address: signupDto.address,
      },
    });

    return data;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async signin(user: User): Promise<{ access_token: string }> {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        name: user.name,
        role: user.role,
      }),
    };
  }
}
