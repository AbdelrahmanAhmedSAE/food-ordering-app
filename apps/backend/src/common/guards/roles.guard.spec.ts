import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { RolesGuard } from './roles.guard';

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeExecutionContext = (user?: { role?: string }): ExecutionContext =>
  ({
    getHandler: vi.fn().mockReturnValue({}),
    getClass: vi.fn().mockReturnValue({}),
    switchToHttp: vi.fn().mockReturnValue({
      getRequest: vi.fn().mockReturnValue({ user }),
    }),
  }) as unknown as ExecutionContext;

// ── Mocks ─────────────────────────────────────────────────────────────────────

const reflectorMock = {
  getAllAndOverride: vi.fn(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RolesGuard', () => {
  let guard: RolesGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, { provide: Reflector, useValue: reflectorMock }],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    vi.clearAllMocks();
  });

  it('should allow access when no roles metadata is defined on the route', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);
    const context = makeExecutionContext({ role: 'CUSTOMER' });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should allow access when user role matches one of the required roles', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(['ADMIN', 'STAFF']);
    const context = makeExecutionContext({ role: 'ADMIN' });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should deny access when user role does not match any required role', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(['ADMIN']);
    const context = makeExecutionContext({ role: 'CUSTOMER' });

    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('should deny access when user is undefined', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(['ADMIN']);
    const context = makeExecutionContext(undefined);

    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('should deny access when roles array is empty', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([]);
    const context = makeExecutionContext({ role: 'ADMIN' });

    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('should check both handler and class metadata via getAllAndOverride', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);
    const context = makeExecutionContext({ role: 'CUSTOMER' });

    await guard.canActivate(context);

    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledWith(
      expect.anything(), // Roles decorator reference
      [context.getHandler(), context.getClass()],
    );
  });

  it('should match correctly when multiple required roles include the user role', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([
      'ADMIN',
      'STAFF',
      'CUSTOMER',
    ]);
    const context = makeExecutionContext({ role: 'CUSTOMER' });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });
});
