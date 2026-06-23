import { ErrorCode } from "../enums";

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  error?: ApiError;
  message?: string;
}
