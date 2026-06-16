import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { JwtAuthGuard } from './jwt-auth.guard';

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeExecutionContext = (): ExecutionContext =>
  ({
    getHandler: vi.fn().mockReturnValue({}),
    getClass: vi.fn().mockReturnValue({}),
    switchToHttp: vi.fn(),
  }) as unknown as ExecutionContext;

// ── Mocks ─────────────────────────────────────────────────────────────────────

const reflectorMock = {
  getAllAndOverride: vi.fn(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let superCanActivateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: Reflector, useValue: reflectorMock },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    vi.clearAllMocks();

    superCanActivateSpy = vi
      .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
      .mockReturnValue(true);
  });

  it('should allow access without invoking authentication when route is @Public', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(true);
    const context = makeExecutionContext();

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(superCanActivateSpy).not.toHaveBeenCalled();
  });

  it('should delegate to passport authentication when route is not @Public', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);
    const context = makeExecutionContext();

    await guard.canActivate(context);

    expect(superCanActivateSpy).toHaveBeenCalledWith(context);
  });

  it('should delegate to passport authentication when isPublic metadata is undefined', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);
    const context = makeExecutionContext();

    await guard.canActivate(context);

    expect(superCanActivateSpy).toHaveBeenCalledWith(context);
  });

  it('should check both handler and class metadata via getAllAndOverride', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);
    const context = makeExecutionContext();

    await guard.canActivate(context);

    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledWith(
      expect.anything(), // Public decorator reference
      [context.getHandler(), context.getClass()],
    );
  });
});
