import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { of, firstValueFrom } from 'rxjs';
import { CookieInterceptor } from './cookie.interceptor';
import type { CookieConfig } from '../types/cookie';

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeResponseMock = () => ({
  cookie: vi.fn(),
});

const makeExecutionContext = (
  response: ReturnType<typeof makeResponseMock>,
): ExecutionContext =>
  ({
    getHandler: vi.fn().mockReturnValue({}),
    getClass: vi.fn().mockReturnValue({}),
    switchToHttp: vi.fn().mockReturnValue({
      getResponse: vi.fn().mockReturnValue(response),
    }),
  }) as unknown as ExecutionContext;

const makeCallHandler = (data: unknown): CallHandler => ({
  handle: vi.fn().mockReturnValue(of(data)),
});

// ── Mocks ─────────────────────────────────────────────────────────────────────

const reflectorMock = {
  getAllAndOverride: vi.fn(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CookieInterceptor', () => {
  let interceptor: CookieInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CookieInterceptor,
        { provide: Reflector, useValue: reflectorMock },
      ],
    }).compile();

    interceptor = module.get<CookieInterceptor>(CookieInterceptor);
    vi.clearAllMocks();
  });

  it('should pass through without setting cookies when no @SetCookie metadata exists', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);
    const response = makeResponseMock();
    const context = makeExecutionContext(response);
    const handler = makeCallHandler({ access_token: 'jwt-token' });

    const result = await firstValueFrom(
      interceptor.intercept(context, handler),
    );

    expect(response.cookie).not.toHaveBeenCalled();
    expect(result).toEqual({ access_token: 'jwt-token' });
  });

  it('should set a cookie when the matching key exists in the response data', async () => {
    const cookieConfigs: CookieConfig[] = [
      { name: 'access_token', options: { httpOnly: true } },
    ];
    reflectorMock.getAllAndOverride.mockReturnValue(cookieConfigs);
    const response = makeResponseMock();
    const context = makeExecutionContext(response);
    const handler = makeCallHandler({ access_token: 'jwt-token-value' });

    await firstValueFrom(interceptor.intercept(context, handler));

    expect(response.cookie).toHaveBeenCalledWith(
      'access_token',
      'jwt-token-value',
      { httpOnly: true },
    );
  });

  it('should set multiple cookies when multiple configs are defined', async () => {
    const cookieConfigs: CookieConfig[] = [
      { name: 'access_token', options: { httpOnly: true } },
      { name: 'refresh_token', options: { httpOnly: true, path: '/auth' } },
    ];
    reflectorMock.getAllAndOverride.mockReturnValue(cookieConfigs);
    const response = makeResponseMock();
    const context = makeExecutionContext(response);
    const handler = makeCallHandler({
      access_token: 'jwt-1',
      refresh_token: 'jwt-2',
    });

    await firstValueFrom(interceptor.intercept(context, handler));

    expect(response.cookie).toHaveBeenCalledTimes(2);
    expect(response.cookie).toHaveBeenCalledWith('access_token', 'jwt-1', {
      httpOnly: true,
    });
    expect(response.cookie).toHaveBeenCalledWith('refresh_token', 'jwt-2', {
      httpOnly: true,
      path: '/auth',
    });
  });

  it('should not set a cookie when the configured key is missing from the response data', async () => {
    const cookieConfigs: CookieConfig[] = [{ name: 'access_token' }];
    reflectorMock.getAllAndOverride.mockReturnValue(cookieConfigs);
    const response = makeResponseMock();
    const context = makeExecutionContext(response);
    // الـ result مفيهوش access_token خالص
    const handler = makeCallHandler({ id: 'user-1' });

    await firstValueFrom(interceptor.intercept(context, handler));

    expect(response.cookie).not.toHaveBeenCalled();
  });

  it('should use an empty object as default options when none are provided', async () => {
    const cookieConfigs: CookieConfig[] = [{ name: 'access_token' }];
    reflectorMock.getAllAndOverride.mockReturnValue(cookieConfigs);
    const response = makeResponseMock();
    const context = makeExecutionContext(response);
    const handler = makeCallHandler({ access_token: 'jwt-token' });

    await firstValueFrom(interceptor.intercept(context, handler));

    expect(response.cookie).toHaveBeenCalledWith(
      'access_token',
      'jwt-token',
      {},
    );
  });

  it('should not set a cookie when its value is falsy (empty string)', async () => {
    const cookieConfigs: CookieConfig[] = [{ name: 'access_token' }];
    reflectorMock.getAllAndOverride.mockReturnValue(cookieConfigs);
    const response = makeResponseMock();
    const context = makeExecutionContext(response);
    const handler = makeCallHandler({ access_token: '' });

    await firstValueFrom(interceptor.intercept(context, handler));

    expect(response.cookie).not.toHaveBeenCalled();
  });

  it('should preserve the original response data unchanged', async () => {
    const cookieConfigs: CookieConfig[] = [{ name: 'access_token' }];
    reflectorMock.getAllAndOverride.mockReturnValue(cookieConfigs);
    const response = makeResponseMock();
    const context = makeExecutionContext(response);
    const originalData = { access_token: 'jwt-token', user: { id: '1' } };
    const handler = makeCallHandler(originalData);

    const result = await firstValueFrom(
      interceptor.intercept(context, handler),
    );

    expect(result).toEqual(originalData);
  });

  it('should check both handler and class metadata via getAllAndOverride', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);
    const response = makeResponseMock();
    const context = makeExecutionContext(response);
    const handler = makeCallHandler({});

    await firstValueFrom(interceptor.intercept(context, handler));

    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledWith(
      expect.anything(), // SetCookie decorator reference
      [context.getHandler(), context.getClass()],
    );
  });
});
