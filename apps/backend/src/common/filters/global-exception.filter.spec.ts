import {
  ArgumentsHost,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GlobalExceptionFilter } from './global-exception.filter';
import { PrismaClientKnownRequestError } from 'src/generated/prisma/internal/prismaNamespace';

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeResponseMock = () => {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  };
  // status().json() لازم يرجع نفس الـ response عشان chaining يشتغل
  response.status.mockReturnValue(response);
  return response;
};

const makeArgumentsHost = (
  response: ReturnType<typeof makeResponseMock>,
): ArgumentsHost =>
  ({
    switchToHttp: vi.fn().mockReturnValue({
      getResponse: vi.fn().mockReturnValue(response),
    }),
  }) as unknown as ArgumentsHost;

const makePrismaError = (code: string): PrismaClientKnownRequestError =>
  new PrismaClientKnownRequestError('Prisma error', {
    code,
    clientVersion: '5.0.0',
  });

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let response: ReturnType<typeof makeResponseMock>;
  let host: ArgumentsHost;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    response = makeResponseMock();
    host = makeArgumentsHost(response);
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  // ── HttpException handling ─────────────────────────────────────────────────

  describe('HttpException', () => {
    it('should return the correct status and message for a string response', () => {
      const exception = new NotFoundException('User not found');

      filter.catch(exception, host);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 404,
        data: null,
        message: 'User not found',
      });
    });

    it('should extract message from an object response', () => {
      // BadRequestException بدون رسالة مخصصة بيرجع object فيه message array (من class-validator مثلاً)
      const exception = new BadRequestException({
        message: 'Validation failed',
        error: 'Bad Request',
      });

      filter.catch(exception, host);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 400,
        data: null,
        message: 'Validation failed',
      });
    });

    it('should use the exception status code dynamically', () => {
      const exception = new BadRequestException('Invalid input');

      filter.catch(exception, host);

      expect(response.status).toHaveBeenCalledWith(400);
    });
  });

  // ── Prisma errors ───────────────────────────────────────────────────────────

  describe('PrismaClientKnownRequestError', () => {
    it('should return 409 for P2002 (unique constraint violation)', () => {
      const exception = makePrismaError('P2002');

      filter.catch(exception, host);

      expect(response.status).toHaveBeenCalledWith(409);
      expect(response.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 409,
        data: null,
        message: 'Already exists',
      });
    });

    it('should return 404 for P2025 (record not found)', () => {
      const exception = makePrismaError('P2025');

      filter.catch(exception, host);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 404,
        data: null,
        message: 'Record not found',
      });
    });

    it('should return 500 with generic message for unhandled Prisma error codes', () => {
      const exception = makePrismaError('P9999');

      filter.catch(exception, host);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 500,
        data: null,
        message: 'Database error',
      });
    });
  });

  // ── Unknown exceptions ──────────────────────────────────────────────────────

  describe('unknown exceptions', () => {
    it('should return 500 with a generic message for a plain Error', () => {
      const exception = new Error('Something unexpected happened');

      filter.catch(exception, host);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 500,
        data: null,
        message: 'Internal server error',
      });
    });

    it('should log unknown exceptions to the console', () => {
      const exception = new Error('Unexpected failure');

      filter.catch(exception, host);

      expect(consoleErrorSpy).toHaveBeenCalledWith(exception);
    });

    it('should handle non-Error thrown values (e.g. strings)', () => {
      filter.catch('something went wrong', host);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 500,
        data: null,
        message: 'Internal server error',
      });
    });

    it('should not log HttpException or Prisma errors to the console', () => {
      filter.catch(new NotFoundException('test'), host);
      filter.catch(makePrismaError('P2002'), host);

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});
