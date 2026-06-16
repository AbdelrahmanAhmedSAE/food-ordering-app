import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { of, firstValueFrom } from 'rxjs';
import { ResponseInterceptor } from './response.interceptor';

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeExecutionContext = (statusCode = 200): ExecutionContext =>
  ({
    getHandler: vi.fn().mockReturnValue({}),
    getClass: vi.fn().mockReturnValue({}),
    switchToHttp: vi.fn().mockReturnValue({
      getResponse: vi.fn().mockReturnValue({ statusCode }),
    }),
  }) as unknown as ExecutionContext;

/**
 * بنحاكي CallHandler.handle() اللي بيرجع Observable للـ data
 * من الـ route handler الأصلي
 */
const makeCallHandler = (data: unknown): CallHandler => ({
  handle: vi.fn().mockReturnValue(of(data)),
});

// ── Mocks ─────────────────────────────────────────────────────────────────────

const reflectorMock = {
  getAllAndOverride: vi.fn(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponseInterceptor,
        { provide: Reflector, useValue: reflectorMock },
      ],
    }).compile();

    interceptor = module.get<ResponseInterceptor>(ResponseInterceptor);
    vi.clearAllMocks();
  });

  it('should wrap the response data in the ApiResponse shape', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);
    const context = makeExecutionContext(200);
    const handler = makeCallHandler({ id: '1', name: 'Burger' });

    const result = await firstValueFrom(
      interceptor.intercept(context, handler),
    );

    expect(result).toEqual({
      success: true,
      statusCode: 200,
      data: { id: '1', name: 'Burger' },
      message: 'Success',
    });
  });

  it('should use the custom message from @SetResponseMessage when present', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue('Signup successfully');
    const context = makeExecutionContext(201);
    const handler = makeCallHandler({ id: 'user-1' });

    const result = await firstValueFrom(
      interceptor.intercept(context, handler),
    );

    expect(result).toEqual({
      success: true,
      statusCode: 201,
      data: { id: 'user-1' },
      message: 'Signup successfully',
    });
  });

  it('should default to "Success" when no message metadata is set', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);
    const context = makeExecutionContext(200);
    const handler = makeCallHandler([]);

    const result = await firstValueFrom(
      interceptor.intercept(context, handler),
    );

    expect(result.message).toBe('Success');
  });

  it('should reflect the actual response status code', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);
    const context = makeExecutionContext(204);
    const handler = makeCallHandler(null);

    const result = await firstValueFrom(
      interceptor.intercept(context, handler),
    );

    expect(result.statusCode).toBe(204);
  });

  it('should preserve null data correctly', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);
    const context = makeExecutionContext(200);
    const handler = makeCallHandler(null);

    const result = await firstValueFrom(
      interceptor.intercept(context, handler),
    );

    expect(result.data).toBeNull();
    expect(result.success).toBe(true);
  });

  it('should preserve array data correctly', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);
    const context = makeExecutionContext(200);
    const items = [{ id: '1' }, { id: '2' }];
    const handler = makeCallHandler(items);

    const result = await firstValueFrom(
      interceptor.intercept(context, handler),
    );

    expect(result.data).toEqual(items);
  });

  it('should check both handler and class metadata via getAllAndOverride', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);
    const context = makeExecutionContext();
    const handler = makeCallHandler({});

    await firstValueFrom(interceptor.intercept(context, handler));

    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledWith(
      expect.anything(), // SetResponseMessage decorator reference
      [context.getHandler(), context.getClass()],
    );
  });

  it('should always set success to true regardless of data content', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);
    const context = makeExecutionContext(200);
    const handler = makeCallHandler(undefined);

    const result = await firstValueFrom(
      interceptor.intercept(context, handler),
    );

    expect(result.success).toBe(true);
  });
});
