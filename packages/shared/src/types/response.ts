import { ErrorCode } from "../enums";

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  error?: { code: ErrorCode; message: string };
  message?: string;
}
