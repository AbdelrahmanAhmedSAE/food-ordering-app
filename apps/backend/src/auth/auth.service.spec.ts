import { Role, User } from 'src/generated/prisma/client';
import { beforeEach, describe, vi, it, expect } from 'vitest';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ActiveUser, Nullable } from '@repo/shared';
import { ConflictException } from '@nestjs/common';

vi.mock('bcryptjs', () => ({ compare: vi.fn(), hash: vi.fn() }));

const prismaMock = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};

const jwtServiceMock = {
  sign: vi.fn(),
};

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-1',
  name: 'Ahmed',
  email: 'ahmed@test.com',
  password: 'hashed-password',
  phone: '01012345678',
  address: 'Cairo',
  role: Role.CUSTOMER,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    vi.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return ActiveUser when credentials are valid', async () => {
      const user = makeUser();
      prismaMock.user.findUnique.mockResolvedValue(user);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const result: Nullable<ActiveUser> = await service.validateUser(
        user.email,
        'plain-password',
      );

      expect(result).toEqual({
        id: user.id,
        name: user.name,
        role: Role.CUSTOMER,
      });

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: user.email },
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'plain-password',
        user.password,
      );
    });

    it('should return null when user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      const result = await service.validateUser('nobody@test.com', 'any');
      expect(result).toBeNull();
    });

    it('should return null when password is wrong', async () => {
      prismaMock.user.findUnique.mockResolvedValue(makeUser());
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
      const result = await service.validateUser('ahmed@test.com', 'wrong');
      expect(result).toBeNull();
    });

    it('should fallback to CUSTOMER role when user.role is null', async () => {
      const user = makeUser({ role: null as unknown as Role });
      prismaMock.user.findUnique.mockResolvedValue(user);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      const result = await service.validateUser(user.email, 'plain-password');
      expect(result?.role).toBe(Role.CUSTOMER);
    });
  });

  describe('signup', () => {
    const signupDto = {
      name: 'Ahmed',
      email: 'ahmed@test.com',
      password: 'plain-password',
      phone: '01012345678',
      address: 'Cairo',
    };

    it('should create a new user and return data without password', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as never);

      const createdUser = makeUser({ password: 'hashed-password' });
      prismaMock.user.create.mockResolvedValue(createdUser);

      const result = await service.signup(signupDto);

      expect(result).not.toHaveProperty('password');
      expect(result).toMatchObject({
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(signupDto.password, 10);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: signupDto.email,
          name: signupDto.name,
          password: 'hashed-password',
          phone: signupDto.phone,
          address: signupDto.address,
        },
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(makeUser());

      await expect(service.signup(signupDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.signup(signupDto)).rejects.toThrow(
        'User already existed',
      );

      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });

    it('should hash the password before saving', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed' as never);
      prismaMock.user.create.mockResolvedValue(
        makeUser({ password: 'hashed' }),
      );

      await service.signup({ ...signupDto, password: 'plain' });

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ password: 'hashed' }) as {
          password: string;
        },
      });
      expect(prismaMock.user.create).not.toHaveBeenCalledWith({
        data: expect.objectContaining({ password: 'plain' }) as {
          password: string;
        },
      });
    });
  });

  // ── signin ──────────────────────────────────────────────────────────────────

  describe('signin', () => {
    it('should return a signed access_token', async () => {
      const user = makeUser();
      jwtServiceMock.sign.mockReturnValue('signed-jwt-token');

      const result = await service.signin(user);

      expect(result).toEqual({ access_token: 'signed-jwt-token' });
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        sub: user.id,
        name: user.name,
        role: user.role,
      });
    });
  });
});
